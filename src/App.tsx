import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { MotionConfig, motion } from 'motion/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './cart/CartDrawer'
import CartBar from './cart/CartBar'
import { CartProvider } from './cart/CartContext'
import { IntroContext, markIntroSeen, shouldAutoPlayIntro, type IntroPhase } from './lib/introState'
import { scrollToTop, useScrollLock } from './lib/scroll'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// 3D giriş (Three.js + il verisi) ayrı parça olarak yüklenir: diğer sayfalar bu yükü indirmez.
const Intro = lazy(() => import('./intro/Intro'))

function Shell() {
  const location = useLocation()
  const navigate = useNavigate()

  // Giriş kendiliğinden yalnızca ilk ziyarette oynar (karar index.html'de); altbilgiden tekrar izlenebilir.
  const [phase, setPhase] = useState<IntroPhase>(() => (shouldAutoPlayIntro() ? 'intro' : 'done'))
  const [run, setRun] = useState(0)

  useScrollLock(phase !== 'done')
  useEffect(() => {
    if (phase !== 'intro') document.documentElement.style.background = '' // ilk boyamadaki koyu zemin (index.html) kalkar
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

  const intro = useMemo(() => ({ phase, replay }), [phase, replay])

  return (
    <IntroContext.Provider value={intro}>
      <Header />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/urunler" element={<Products />} />
          <Route path="/kurumsal" element={<About />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
      <Footer />
      <CartBar />
      <CartDrawer />
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

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <CartProvider>
          <Shell />
        </CartProvider>
      </MotionConfig>
    </BrowserRouter>
  )
}
