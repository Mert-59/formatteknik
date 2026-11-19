/*
 * Format Teknik — service worker (uygulama olarak kurulabilirlik + hızlı açılış + çevrimdışı).
 *
 * BU DOSYA ŞABLONDUR. Derlemede (scripts/prerender.mjs → scripts/pwa.mjs) dist/sw.js'e yazılırken
 * VERSION ve PRECACHE doldurulur: sitedeki her sayfa, kod, stil, logo ve simge (PDF kataloglar HARİÇ).
 * Site her derlendiğinde içerik değişirse VERSION değişir; tarayıcı yeni sürümü bir sonraki açılışta kullanır.
 *
 * Stratejiler:
 *  - Sayfalar: önce ağ (taze içerik), ağ yoksa / 4 sn'de cevap gelmezse kayıtlı hâli. Kayıtlı değilse
 *    anasayfanın HTML'i: uygulama tek pakettir, adres hangi sayfaysa React onu çizer.
 *  - Kod, stil, görseller: önce önbellek (dosya adları içeriğe göre değişir, eskimez).
 *  - PDF kataloglar: hiç dokunulmaz, doğrudan ağdan (153 MB — telefona kendiliğinden inmesin).
 *  - Yazı tipleri: sitenin kendi dosyaları (dist/assets), önceden indirilir; Google'a istek gitmez.
 * Hiçbir veri bir sunucuya gönderilmez; yalnızca sitenin kendi dosyaları cihazda önbelleğe alınır.
 */
const VERSION = '@VERSION@'
const PRECACHE = [/* @PRECACHE@ */]

const PAGES = 'ft-sayfa-' + VERSION
const RUNTIME = 'ft-runtime-v1' // önceden indirilmeyen görseller (katalog kapakları vb.)
// Artık kullanılmayan önbellekler — etkinleşince silinir. ft-fonts-v1: Google yazı tipleri (19 Kasım 2026'dan beri
// yazı tipleri sitenin kendi dosyaları).
const OLD_CACHES = ['ft-fonts-v1']
const PRECACHED = new Set(PRECACHE)
const NETWORK_TIMEOUT = 4000

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGES)
      // adları içeriğe göre değişen dosyalar tarayıcı önbelleğinden alınabilir; diğerleri sunucudan taze
      await cache.addAll(PRECACHE.map((url) => new Request(url, { cache: url.startsWith('/assets/') ? 'default' : 'reload' })))
      // yeni sürüm beklemeden devralır; açık sayfa yenilenmez, bir sonraki sayfa geçişinde yeni sürüm gelir
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Bir önceki sürümün önbelleği tutulur: güncelleme anında açık kalmış eski sayfa kendi dosyalarını bulabilsin.
      // Daha eskiler silinir. (caches.keys() oluşturulma sırasıyla döner.)
      const old = (await caches.keys()).filter((k) => k.startsWith('ft-sayfa-') && k !== PAGES)
      await Promise.all(old.slice(0, -1).map((k) => caches.delete(k)))
      await Promise.all(OLD_CACHES.map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

/** /urunler/ , /urunler.html → /urunler (önbellek anahtarı) */
function pageKey(url) {
  let p = url.pathname.replace(/\/+$/, '') || '/'
  if (p.endsWith('.html')) p = p.slice(0, -5) || '/'
  return p === '/index' ? '/' : p
}

/** Önce güncel sürümün önbelleği (eski sürümdeki aynı adlı dosya öne geçmesin), sonra diğerleri. */
async function match(request) {
  return (await (await caches.open(PAGES)).match(request)) || (await caches.match(request))
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('zaman aşımı')), ms))
}

async function page(request) {
  const key = pageKey(new URL(request.url))
  try {
    // istek olduğu gibi iletilir: eski adreslerin yönlendirmeleri (301) tarayıcıya ulaşır
    const response = await Promise.race([fetch(request), timeout(NETWORK_TIMEOUT)])
    if (response.ok && response.type === 'basic' && !response.redirected) {
      const cache = await caches.open(PAGES)
      cache.put(key, response.clone())
    }
    return response
  } catch {
    return (await match(key)) || (await match('/')) || Response.error()
  }
}

async function cacheFirst(request, cacheName) {
  const hit = await match(request)
  if (hit) return hit
  const response = await fetch(request)
  if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
    const cache = await caches.open(cacheName)
    cache.put(request, response.clone())
  }
  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  if (url.origin === self.location.origin) {
    if (request.mode === 'navigate') return event.respondWith(page(request))
    if (url.pathname.endsWith('.pdf')) return // kataloglar: doğrudan ağdan
    if (PRECACHED.has(url.pathname) || /^\/(assets|brands|icons|logo|kataloglar\/kapak)\//.test(url.pathname)) {
      return event.respondWith(cacheFirst(request, RUNTIME))
    }
    return
  }
})
