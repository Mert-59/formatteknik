import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Mobil tarayıcıda adres çubuğu açılıp kapanınca yükseklik değişir; tetikleyiciler sıçramasın.
ScrollTrigger.config({ ignoreMobileResize: true })

let lenis: Lenis | null = null

/** Lenis yumuşak kaydırma; GSAP ticker'ına bağlı, ScrollTrigger ile senkron. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const instance = new Lenis({ lerp: 0.11, wheelMultiplier: 1 })
    lenis = instance
    instance.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      instance.destroy()
      lenis = null
    }
  }, [enabled])
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

export function scrollToElement(el: Element, offset = -96) {
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset, duration: 1.2 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
}

/** Çekmece/menü açıkken arka planın kaymasını durdurur. */
export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
