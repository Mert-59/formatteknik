/**
 * Uygulama (PWA) derleme adımı — scripts/prerender.mjs sonunda çalışır.
 *
 * public/sw.js şablonundaki VERSION ve PRECACHE doldurulup dist/sw.js'e yazılır:
 *  - PRECACHE: ön-render edilen her sayfa (temiz adresiyle: /urunler) + dist/assets, brands, icons,
 *    favicon.ico, manifest.webmanifest. PDF kataloglar ve kapakları bilerek dışarıda (bkz. sw.js).
 *  - VERSION: bu dosyaların içeriğinden üretilen kısa özet. İçerik değişmezse sürüm de değişmez;
 *    gereksiz yere herkesin önbelleği yenilenmez.
 */
import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const DIRS = ['assets', 'brands', 'icons']
const FILES = ['favicon.ico', 'manifest.webmanifest', 'logo/format-teknik.webp'] // logo: Kurumsal sayfası (PNG yedeği gerektiğinde iner)

async function walk(dir) {
  const out = []
  for (const e of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else out.push(p)
  }
  return out
}

/** pages: [{ url: '/urunler', file: 'urunler.html' }] (404 hariç) */
export async function buildServiceWorker(dist, pages) {
  const entries = pages.map((p) => ({ url: p.url, file: join(dist, p.file) }))
  for (const d of DIRS) {
    for (const f of await walk(join(dist, d))) entries.push({ url: '/' + relative(dist, f).split(sep).join('/'), file: f })
  }
  for (const f of FILES) entries.push({ url: '/' + f, file: join(dist, f) })
  entries.sort((a, b) => a.url.localeCompare(b.url))

  const hash = createHash('sha256')
  let bytes = 0
  for (const e of entries) {
    const data = await readFile(e.file) // dosya yoksa derleme burada durur
    bytes += data.length
    hash.update(e.url).update('\0').update(data)
  }
  const version = hash.digest('hex').slice(0, 10)

  const swPath = join(dist, 'sw.js')
  let sw = await readFile(swPath, 'utf8')
  const fill = (marker, value) => {
    if (sw.split(marker).length !== 2) throw new Error(`[pwa] public/sw.js içinde "${marker}" tam bir kez bulunmalı`)
    sw = sw.replace(marker, value)
  }
  fill("'@VERSION@'", JSON.stringify(version))
  fill('[/* @PRECACHE@ */]', JSON.stringify(entries.map((e) => e.url), null, 2))
  await writeFile(swPath, sw)
  return { version, count: entries.length, bytes }
}
