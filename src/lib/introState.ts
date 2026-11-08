import { createContext, useContext } from 'react'

export type IntroPhase = 'intro' | 'revealing' | 'done'

/** `run`: giriş kaçıncı kez oynuyor ("Girişi izle" her basışta artar; anasayfa açılış animasyonları buna göre baştan başlar) */
export const IntroContext = createContext<{ phase: IntroPhase; run: number; replay: () => void }>({
  phase: 'done',
  run: 0,
  replay: () => {},
})

export const useIntro = () => useContext(IntroContext)

declare global {
  interface Window {
    /** index.html'deki ilk betik belirler: girişin bu açılışta kendiliğinden oynayıp oynamayacağı */
    __ftIntro?: boolean
  }
}

/** index.html'deki betikle aynı anahtar */
const SEEN_KEY = 'ft-intro-seen-v1'

/** Girişin bu açılışta kendiliğinden oynaması gerekir mi (ilk ziyaret, anasayfa, uygun cihaz). */
export const shouldAutoPlayIntro = () => window.__ftIntro === true

/** Giriş bir kez görüldü (ya da atlandı): sonraki ziyaretlerde kendiliğinden oynamaz. */
export function markIntroSeen() {
  window.__ftIntro = false
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* gizli pencere vb. — giriş sonraki açılışta yine oynar */
  }
}
