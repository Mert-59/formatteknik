import { useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Intro from './intro/Intro'
import Header from './components/Header'
import Footer from './components/Footer'
import CartDrawer from './cart/CartDrawer'
import { CartProvider } from './cart/CartContext'
import { IntroContext, type IntroPhase } from './lib/introState'
import { scrollToTop, useSmoothScroll } from './lib/smoothScroll'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Shell() {
  const location = useLocation()
  const navigate = useNavigate()

  // Giriş yalnızca anasayfaya doğrudan gelindiğinde oynar.
  const [phase, setPhase] = useState<IntroPhase>(() =>
    location.pathname === '/' && !prefersReducedMotion() ? 'intro' : 'done',
  )
  const [run, setRun] = useState(0)

  useEffect(() => {
    const html = document.documentElement
    html.style.overflow = phase === 'done' ? '' : 'hidden'
    if (phase !== 'intro') html.style.background = '' // ilk boyamadaki koyu zemin (index.html) kalkar
  }, [phase])

  useSmoothScroll(phase === 'done')

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
      <CartDrawer />
      {phase !== 'done' && (
        <Intro key={run} onReveal={() => setPhase('revealing')} onComplete={() => setPhase('done')} />
      )}
    </IntroContext.Provider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Shell />
      </CartProvider>
    </BrowserRouter>
  )
}
