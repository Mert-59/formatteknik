/**
 * Ön-render: `npm run build` sonunda çalışır.
 *
 * 1) vite'ın ürettiği dist/index.html şablon olarak okunur.
 * 2) Her sayfa React ile sunucuda çizilir (dist-ssr/entry-server.js).
 * 3) Sayfanın HTML'i <div id="root"> içine, kendi başlık/açıklama/canonical/paylaşım etiketleri <head>'e yazılır.
 * 4) Çıktı: dist/index.html, urunler.html, urunler/<grup>.html (9 ürün grubu), kurumsal.html, iletisim.html, 404.html
 *    (barındırıcı /urunler adresinde urunler.html'i sunar — ayarlar README.md "Yayına alma" bölümünde).
 * 5) dist/sitemap.xml bu sayfalardan üretilir.
 *
 * Şablonda beklenen etiketlerden biri bulunamazsa derleme hata verir (sessizce yanlış HTML üretmesin).
 */
import { copyFile, mkdir, readFile, writeFile, rm, stat } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')

const { render, NAV, SITE, CATEGORY_PATHS, EXTRA_PATHS, CATALOG_FILES } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)
const template = await readFile(join(dist, 'index.html'), 'utf8')

// Katalog denetimi: src/data/catalogs.ts'teki her PDF ve kapak dist/'te olmalı; yoksa sitede kırık bağlantı olur.
const missing = []
for (const url of CATALOG_FILES) if (!(await stat(join(dist, url.slice(1))).catch(() => null))?.isFile()) missing.push(url)
if (missing.length) {
  throw new Error(`[prerender] Katalog dosyası eksik (public/ altına koyun ya da src/data/catalogs.ts'ten çıkarın):\n  ${missing.join('\n  ')}`)
}
console.log(`  ✓ ${CATALOG_FILES.length / 2} katalog: PDF ve kapak dosyaları yerinde`)

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Şablonda tam bir kez geçmesi gereken bir parçayı değiştirir. */
function replaceOnce(html, pattern, replacement, what) {
  const matches = html.match(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'))
  if (!matches || matches.length !== 1) throw new Error(`[prerender] index.html içinde "${what}" ${matches ? matches.length + ' kez' : 'hiç'} bulundu (1 bekleniyordu)`)
  return html.replace(pattern, replacement)
}

const meta = (attr, key) => new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*\\/?>`)

const pages = [
  ...NAV.map((n) => n.to),
  ...CATEGORY_PATHS, // /urunler/torna-uclari → urunler/torna-uclari.html
  ...EXTRA_PATHS, // /kataloglar → kataloglar.html
].map((url) => ({ url, route: url, file: url === '/' ? 'index.html' : `${url.slice(1)}.html` }))
// bilinmeyen her adres için: barındırıcılar 404.html'i "bulunamadı" sayfası olarak sunar
pages.push({ url: '/__404__', route: '404', file: '404.html' })

const indexable = []
for (const page of pages) {
  const { html, head } = render(page.url)
  if (!head) throw new Error(`[prerender] ${page.url}: sayfa usePageMeta çağırmadı`)
  const isHome = page.url === '/'
  const canonical = SITE.url + (isHome ? '/' : page.url)

  let out = template
  out = replaceOnce(out, /<div id="root"><\/div>/, `<div id="root" data-route="${page.route}">${html}</div>`, 'root')
  out = replaceOnce(out, /<title>[^<]*<\/title>/, `<title>${esc(head.title)}</title>`, '<title>')
  if (head.description) out = replaceOnce(out, meta('name', 'description'), `<meta name="description" content="${esc(head.description)}" />`, 'description')

  if (head.noindex) {
    out = replaceOnce(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex" />', 'canonical')
  } else {
    out = replaceOnce(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`, 'canonical')
    out = replaceOnce(out, meta('property', 'og:url'), `<meta property="og:url" content="${canonical}" />`, 'og:url')
    // anasayfa şablondaki paylaşım başlığını korur ("Güvenilir Çözüm Ortağı"); diğer sayfalar kendi başlığını
    if (!isHome) {
      out = replaceOnce(out, meta('property', 'og:title'), `<meta property="og:title" content="${esc(head.title)}" />`, 'og:title')
      if (head.description) out = replaceOnce(out, meta('property', 'og:description'), `<meta property="og:description" content="${esc(head.description)}" />`, 'og:description')
    }
  }

  const target = join(dist, page.file)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, out)
  if (!head.noindex) indexable.push(canonical)
  console.log(`  ✓ ${page.file.padEnd(34)} ${head.title}  (${(out.length / 1024).toFixed(1)} KB)`)
}

// /urunler (grup sayfaları) ve /kataloglar (PDF'ler) hem sayfa.html hem aynı adlı klasör olarak var:
// klasör adresine giden barındırıcılar için klasöre aynı sayfanın index.html kopyası konur.
for (const page of pages) {
  if (page.route === '404' || page.url === '/') continue
  const dir = join(dist, page.url.slice(1))
  if ((await stat(dir).catch(() => null))?.isDirectory()) await copyFile(join(dist, page.file), join(dir, 'index.html'))
}

// Site haritası: dizine eklenecek tüm sayfalar (elle güncellemeye gerek yok)
const sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  indexable.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
  '\n</urlset>\n'
await writeFile(join(dist, 'sitemap.xml'), sitemap)

await rm(ssrDir, { recursive: true, force: true })
console.log(`[prerender] ${pages.length} sayfa üretildi; sitemap.xml: ${indexable.length} adres.`)
