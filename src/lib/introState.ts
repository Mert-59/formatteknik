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
 * Ziyaret sayacı index.html'deki ilk betikte tutulur (giriş her 3 ziyarette bir: 1., 4., 7. …):
 *  - localStorage 'ft-visits': ziyaret sayısı, 'ft-last-active': son etkinlik (30 dk kuralı)
 *  - sessionStorage 'ft-visit': bu ziyaret sayıldı, 'ft-intro-due': bu ziyarette giriş oynayacak
 *  - localStorage 'ft-intro-seen-v1': eski sürümün işareti — yalnızca sayacın başlangıcı için okunur
 */
const DUE_KEY = 'ft-intro-due'
const SEEN_KEY = 'ft-intro-seen-v1'

/** Ziyaretçi etkin (site içi sayfa geçişi): 30 dakika kuralı için son etkinlik zamanı güncellenir. */
export function touchVisit() {
  try {
    localStorage.setItem('ft-last-active', String(Date.now()))
  } catch {
    /* depolama yoksa sayaç da yok */
  }
}

/** Girişin bu açılışta kendiliğinden oynaması gerekir mi (sırası gelen ziyaret, anasayfa, uygun cihaz). */
export const shouldAutoPlayIntro = () => window.__ftIntro === true

/** Giriş oynadı (ya da atlandı): bu ziyarette bir daha kendiliğinden oynamaz; sırası 3 ziyaret sonra gelir. */
export function markIntroSeen() {
  window.__ftIntro = false
  try {
    sessionStorage.removeItem(DUE_KEY)
    localStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* gizli pencere vb. — depolama yoksa giriş anasayfa her açıldığında oynar */
  }
}
