/**
 * Yönlendirme denetimi: eski sitenin her adresi yeni sitede doğru sayfaya gidiyor mu?
 *
 *   npm run preview                                          (ayrı pencerede; dist/ önce derlenmiş olmalı)
 *   npm run check:redirects                                  → http://localhost:4173 üzerinde dener
 *   npm run check:redirects -- https://www.formatteknik.com.tr   → YAYINDAKİ siteyi dener (yayından hemen sonra)
 *
 * Her eski adres (scripts/old-urls.txt) için:
 *   1) vercel.json'da ona ÖZEL bir kural olmalı (genel "yakalayıcı" kurala düşmemeli),
 *   2) sunucu kalıcı yönlendirme (301/308) dönmeli,
 *   3) yönlendirme zinciri, kuralın gösterdiği sayfada 200 ile bitmeli.
 * Ayrıca genel kurallar birkaç örnek adresle, yayındaki sitede de alan adı (www + https) yönlendirmesi denenir.
 * Bir sorun varsa çıkış kodu 1'dir.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { loadRedirects, matchRedirect } from './redirects.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const base = (process.argv[2] || 'http://localhost:4173').replace(/\/+$/, '')
const SITE_HOST = 'www.formatteknik.com.tr'
const { path: rules } = await loadRedirects(root)

const oldUrls = (await readFile(new URL('./old-urls.txt', import.meta.url), 'utf8'))
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))

/** Yalnızca başlıkları ister (PDF'ler indirilmesin). HEAD desteklenmiyorsa GET'e geçip gövdeyi okumaz. */
async function request(url) {
  let res = await fetch(url, { method: 'HEAD', redirect: 'manual' })
  if (res.status === 405 || res.status === 501) {
    res = await fetch(url, { redirect: 'manual' })
    await res.body?.cancel()
  }
  return res
}

/** Yönlendirmeleri tek tek izler: { first, final, finalUrl, hops } */
async function follow(url) {
  let current = url
  let first = null
  for (let hops = 0; hops < 6; hops++) {
    const res = await request(current)
    first ??= res.status
    const loc = res.headers.get('location')
    if (res.status >= 300 && res.status < 400 && loc) {
      current = new URL(loc, current).href
      continue
    }
    return { first, final: res.status, finalUrl: current, hops }
  }
  return { first, final: 0, finalUrl: current, hops: 6 }
}

const problems = []
const warnings = []
const ok = (s) => console.log(`  ✓ ${s}`)
const bad = (s) => {
  problems.push(s)
  console.log(`  ✗ ${s}`)
}
const pathOf = (href) => decodeURI(new URL(href).pathname)

async function check(path, expected, { mustBeSpecific } = {}) {
  const hit = matchRedirect(rules, path)
  if (!hit) return bad(`${path}: vercel.json'da kural yok`)
  if (mustBeSpecific && hit.rule.generic) return bad(`${path}: özel kural yok, genel kurala (${hit.rule.source}) düşüyor`)
  const target = expected ?? hit.location
  let r
  try {
    r = await follow(base + path)
  } catch (e) {
    return bad(`${path}: sunucuya ulaşılamadı (${e.cause?.code ?? e.message}) — "npm run preview" açık mı?`)
  }
  if (r.first !== 301 && r.first !== 308) return bad(`${path}: kalıcı yönlendirme yok (durum ${r.first})`)
  if (r.final !== 200) return bad(`${path} → ${pathOf(r.finalUrl)}: hedef sayfa açılmıyor (durum ${r.final})`)
  if (pathOf(r.finalUrl) !== target) return bad(`${path} → ${pathOf(r.finalUrl)}: beklenen ${target}`)
  if (r.hops > 1) warnings.push(`${path}: ${r.hops} adımda yönlendi (1 olmalı)`)
  ok(`${path.padEnd(52)} → ${target}`)
}

console.log(`\nYönlendirme denetimi: ${base}\n`)

console.log(`Eski site adresleri (${oldUrls.length})`)
for (const p of oldUrls) await check(p, undefined, { mustBeSpecific: true })

console.log('\nGenel kurallar (listede olmayan eski adresler)')
for (const [p, exp] of [
  ['/tr/kategori-yeni-bir-grup/999', '/urunler'],
  ['/tr/urun-bilinmeyen/123', '/urunler'],
  ['/tr/bilinmeyen-sayfa', '/'],
  ['/tr/urunler/', '/urunler'],
  ['/en', '/'],
  ['/en/products', '/'],
  ['/uploads/files/eski-bir-katalog.pdf', '/kataloglar'],
]) {
  await check(p, exp)
}

console.log('\nYeni sayfalar yönlenmeden açılmalı')
for (const p of ['/', '/urunler', '/urunler/kilavuz', '/kataloglar', '/kurumsal', '/iletisim']) {
  const r = await follow(base + p).catch(() => null)
  if (r && r.first === 200) ok(p)
  else bad(`${p}: ${r ? `durum ${r.first}` : 'ulaşılamadı'}`)
}

// Alan adı: yalnızca yayındaki sitede anlamlı (yerel sunucu tek bir adreste çalışır)
if (new URL(base).host === SITE_HOST) {
  console.log('\nAlan adı: tek adres https://www.formatteknik.com.tr')
  for (const from of [
    'https://formatteknik.com.tr/urunler',
    'http://formatteknik.com.tr/urunler',
    'http://www.formatteknik.com.tr/urunler',
    'http://formatteknik.com.tr/tr/kategori-kilavuz/59',
  ]) {
    const expected = from.endsWith('/59') ? `https://${SITE_HOST}/urunler/kilavuz` : `https://${SITE_HOST}/urunler`
    const r = await follow(from).catch(() => null)
    if (r && r.final === 200 && r.finalUrl === expected) ok(`${from.padEnd(52)} → ${expected}`)
    else bad(`${from}: ${r ? `${r.finalUrl} (durum ${r.final})` : 'ulaşılamadı'} — beklenen ${expected}`)
  }
} else {
  console.log(`\n(Alan adı yönlendirmesi yalnızca yayındaki sitede denenir: npm run check:redirects -- https://${SITE_HOST})`)
}

for (const w of warnings) console.log(`  ! ${w}`)
console.log(problems.length ? `\n✗ ${problems.length} sorun bulundu.\n` : '\n✓ Tüm yönlendirmeler doğru.\n')
process.exit(problems.length ? 1 : 0)
