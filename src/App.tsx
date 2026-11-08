import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './cart/CartDrawer'
import CartBar from './cart/CartBar'
import PrintSlip from './cart/PrintSlip'
import { CartProvider } from './cart/CartContext'
import { IntroContext, markIntroSeen, shouldAutoPlayIntro, type IntroPhase } from './lib/introState'
import { scrollToTop, useScrollLock } from './lib/scroll'
import Home from './pages/Home'
import Products from './pages/Products'
import CategoryPage from './pages/CategoryPage'
import Catalogs from './pages/Catalogs'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// 3D giriş (Three.js + il verisi) ayrı parça olarak yüklenir: diğer sayfalar bu yükü indirmez.
const Intro = lazy(() => import('./intro/Intro'))

function Shell() {
  const location = useLocation()
  const navigate = useNavigate()

  /*
   * Giriş kendiliğinden anasayfanın her 3 açılışında bir oynar (karar index.html'deki betikte); altbilgiden tekrar izlenebilir.
   * Ön-render'daki HTML girişsiz ('done') çizilir; tarayıcıda karar, ekrana çizilmeden hemen önce uygulanır.
   * O ana kadar index.html'deki betik sayfayı koyu zemin + `ft-intro` sınıfıyla gizli tutar (bkz. index.css).
   */
  const [phase, setPhase] = useState<IntroPhase>('done')
  const [run, setRun] = useState(0)
  // Sayfa geçişi solması ilk açılışta oynamaz: ön-render içeriği hemen görünür
  const [pageFade, setPageFade] = useState(false)

  useLayoutEffect(() => {
    // Bilinçli: karar tarayıcıya özgü (index.html betiği); ön-render HTML'i ile uyuşmazlık olmasın diye çizimden önce uygulanır.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (shouldAutoPlayIntro()) setPhase('intro')
    setPageFade(true)
  }, [])

  useLayoutEffect(() => {
    // giriş katmanı ekranda ya da giriş hiç oynamayacak: ön-render içeriğini gizleyen sınıf kalkar
    if (phase === 'intro' || !shouldAutoPlayIntro()) document.documentElement.classList.remove('ft-intro')
  }, [phase])

  useScrollLock(phase !== 'done')
  useEffect(() => {
    // ilk boyamadaki koyu zemin (index.html) kalkar — giriş oynayacaksa geçişe kadar bekler
    if (phase !== 'intro' && !shouldAutoPlayIntro()) document.documentElement.style.background = ''
  }, [phase])

  // Sayfa değişince başa dön; düzen oturunca tetikleyicileri yeniden ölç.
  useEffect(() => {
    if (!location.hash) scrollToTop()
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (phase !== 'done') return
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => window.clearTimeout(t)
  }, [phase, location.pathname])

  const replay = useCallback(() => {
    if (location.pathname !== '/') navigate('/')
    scrollToTop()
    setRun((r) => r + 1)
    setPhase('intro')
  }, [location.pathname, navigate])

  const intro = useMemo(() => ({ phase, run, replay }), [phase, run, replay])

  return (
    <IntroContext.Provider value={intro}>
      <Header />
      {/* sayfa değişince yeni sayfa solarak gelir (index.css .anim-fade); ilk açılışta değil — ön-render içeriği hemen görünür */}
      <main key={location.pathname} className={pageFade ? 'anim-fade' : undefined}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/urunler" element={<Products />} />
          <Route path="/urunler/:slug" element={<CategoryPage />} />
          <Route path="/kataloglar" element={<Catalogs />} />
          <Route path="/kurumsal" element={<About />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartBar />
      <CartDrawer />
      <PrintSlip />
      {phase !== 'done' && (
        // Parça inene kadar koyu zemin: anasayfa bir an bile görünmesin
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-night" />}>
          <Intro
            key={run}
            onReveal={() => {
              markIntroSeen() // sonuna kadar izlendi ya da atlandı
              setPhase('revealing')
            }}
            onComplete={() => setPhase('done')}
          />
        </Suspense>
      )}
    </IntroContext.Provider>
  )
}

/** Yönlendiriciden bağımsız uygulama: tarayıcıda BrowserRouter, ön-render'da StaticRouter içine konur. */
export function AppContent() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
