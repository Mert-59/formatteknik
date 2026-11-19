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

/** Cihazda "giriş görüldü" kaydı (index.html'deki betik okur). Değeri: ilk görüldüğü an. */
const SEEN_KEY = 'ft-intro-v2'

/**
 * Giriş oynadı (ya da atlandı): bu cihazda bir daha kendiliğinden oynamaz — dönen müşteri ve ana ekrandaki uygulama
 * doğrudan anasayfayı görür. Altbilgideki "Girişi izle" her zaman çalışır. Tarayıcı verisi silinirse giriş yeniden oynar.
 */
export function markIntroSeen() {
  window.__ftIntro = false
  try {
    if (!localStorage.getItem(SEEN_KEY)) localStorage.setItem(SEEN_KEY, String(Date.now()))
  } catch {
    // gizli pencere / kapalı depolama: yalnızca bu yüklenişte oynamaz
  }
}
