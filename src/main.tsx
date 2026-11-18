import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

const el = document.getElementById('root')!

/*
 * Ön-render (scripts/prerender.mjs): her sayfanın HTML'i derlemede üretilir ve <div id="root" data-route="…">
 * hangi sayfaya ait olduğunu taşır. Adres o sayfaysa React hazır HTML'i devralır (hydrate).
 * Değilse sıfırdan çizer: geliştirme sunucusu, barındırıcının başka sayfanın HTML'ini döndürmesi ve 404.
 * (404.html tek bir adres için üretilir; /urunler/… altındaki bir 404'te menüde "Ürünlerimiz" etkin olur,
 * HTML birebir tutmaz. 404 dizine eklenmediği için sıfırdan çizmek yeterli.)
 */
const path = location.pathname.replace(/\/+$/, '') || '/'
const prerendered = el.hasChildNodes() && el.dataset.route === path

if (prerendered) {
  hydrateRoot(el, app)
} else {
  el.textContent = ''
  createRoot(el).render(app)
}

/*
 * Uygulama (PWA): service worker yalnızca derlenmiş sitede kaydedilir (geliştirme sunucusunda önbellek karışmasın).
 * Sayfa tamamen yüklendikten sonra: sitenin kendi açılışıyla (giriş, görseller) bant genişliği için yarışmasın.
 * Bkz. public/sw.js, scripts/pwa.mjs.
 */
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {})
  if (document.readyState === 'complete') register()
  else window.addEventListener('load', register, { once: true })
}
