/**
 * `npm run preview`: dist/ klasörünü yayındaki gibi sunar (bağımlılık yok).
 *  - /urunler → urunler.html (barındırıcılardaki "temiz adres" davranışı)
 *  - /urunler.html → /urunler'e kalıcı yönlendirme
 *  - bulunamayan adres → 404.html, durum kodu 404
 *  - eski site adresleri → vercel.json'daki yönlendirmeler (yayındaki gibi; bkz. scripts/redirects.mjs).
 *    vercel.json değişince sunucuyu yeniden başlatın. Alan adı (www) kuralı yerelde uygulanmaz.
 * Kullanım: npm run preview  (ya da: node scripts/serve.mjs 4173)
 */
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadRedirects, matchRedirect } from './redirects.mjs'

const dist = fileURLToPath(new URL('../dist/', import.meta.url))
const port = Number(process.argv[2] || process.env.PORT || 4173)
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.json': 'application/json',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.pdf': 'application/pdf', // kataloglar: tarayıcı indirmek yerine görüntülesin
}

const { path: redirects } = await loadRedirects(fileURLToPath(new URL('..', import.meta.url)))

const isFile = async (p) => (await stat(p).catch(() => null))?.isFile() ?? false

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x')
  const path = decodeURIComponent(url.pathname)
  // Vercel kalıcı yönlendirmede 308 döner (Apache 301); arama motorları ikisini de kalıcı sayar
  const hit = matchRedirect(redirects, path)
  if (hit) {
    res.writeHead(hit.rule.permanent === false ? 307 : 308, { Location: hit.location + url.search }).end()
    return
  }
  if (path.endsWith('.html') && path !== '/index.html' && path !== '/404.html') {
    res.writeHead(301, { Location: path.slice(0, -5) || '/' }).end()
    return
  }
  const clean = path.replace(/\/+$/, '') || '/'
  const candidates = clean === '/' ? ['index.html'] : [clean.slice(1), `${clean.slice(1)}.html`]
  for (const c of candidates) {
    const file = normalize(join(dist, c))
    if (!file.startsWith(dist)) break
    if (await isFile(file)) {
      res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' })
      res.end(await readFile(file))
      return
    }
  }
  res.writeHead(404, { 'Content-Type': types['.html'] })
  res.end(await readFile(join(dist, '404.html')).catch(() => 'Bulunamadı'))
}).listen(port, () => console.log(`dist/ sunuluyor → http://localhost:${port}`))
