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

/** Girişin bu açılışta kendiliğinden oynaması gerekir mi (anasayfa, uygun cihaz) — karar index.html'deki ilk betikte. */
export const shouldAutoPlayIntro = () => window.__ftIntro === true

/** Giriş oynadı (ya da atlandı): bu sayfa yüklenişinde bir daha kendiliğinden oynamaz (anasayfa yeniden açılınca yine oynar). */
export function markIntroSeen() {
  window.__ftIntro = false
}
