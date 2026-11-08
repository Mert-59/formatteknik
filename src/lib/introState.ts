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

/*
 * Açılış sayacı index.html'deki ilk betikte tutulur (giriş anasayfanın her 3 açılışında bir: 1., 4., 7. …, yenileme dahil):
 *  - localStorage 'ft-home-loads': anasayfanın kaç kez yüklendiği
 *  - localStorage 'ft-intro-seen-v1': girişi en az bir kez görmüş — önceki sürümlerden gelenlerde sayacın başlangıcı için okunur
 */
const SEEN_KEY = 'ft-intro-seen-v1'

/** Girişin bu açılışta kendiliğinden oynaması gerekir mi (sırası gelen açılış, anasayfa, uygun cihaz). */
export const shouldAutoPlayIntro = () => window.__ftIntro === true

/** Giriş oynadı (ya da atlandı): bu sayfa yüklenişinde bir daha kendiliğinden oynamaz. */
export function markIntroSeen() {
  window.__ftIntro = false
  try {
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* gizli pencere vb. — depolama yoksa giriş anasayfa her açıldığında oynar */
  }
}
