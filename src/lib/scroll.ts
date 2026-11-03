import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// Mobil tarayıcıda adres çubuğu açılıp kapanınca yükseklik değişir; tetikleyiciler sıçramasın.
ScrollTrigger.config({ ignoreMobileResize: true })

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToTop() {
  window.scrollTo(0, 0)
}

export function scrollToElement(el: Element, offset = -96) {
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY + offset,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}

/*
 * Kaydırma kilidi: giriş, mobil menü ve sepet aynı anda kilit isteyebilir.
 * Sayaç tutulur; son kilit kalkınca sayfa yeniden kayar.
 */
let locks = 0
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    locks++
    document.documentElement.style.overflow = 'hidden'
    return () => {
      locks--
      if (locks === 0) document.documentElement.style.overflow = ''
    }
  }, [active])
}

/*
 * Modal davranışı (sepet, mobil menü): açılınca ilk öğeye odaklanır, Tab içeride döner,
 * Esc kapatır, kapanınca odak açan düğmeye geri döner. Üst üste açılırsa yalnızca en üstteki dinler.
 */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
const stack: HTMLElement[] = []

/** `focusIn`: ilk odağın aranacağı alt kapsayıcı (verilmezse modalın kendisi). */
export function useModal(ref: RefObject<HTMLElement | null>, active: boolean, onClose: () => void, focusIn?: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current
    if (!active || !root) return
    const opener = document.activeElement as HTMLElement | null
    stack.push(root)
    const first = (focusIn?.current ?? root).querySelector<HTMLElement>(FOCUSABLE)
    first?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== root) return
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const a = items[0]
      const z = items[items.length - 1]
      if (!root.contains(document.activeElement)) {
        e.preventDefault()
        a.focus()
      } else if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        z.focus()
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault()
        a.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      stack.splice(stack.indexOf(root), 1)
      if (opener?.isConnected) opener.focus({ preventScroll: true })
    }
  }, [ref, active, onClose, focusIn])
}
