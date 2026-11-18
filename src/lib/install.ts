import { useSyncExternalStore } from 'react'

/**
 * "Ana ekrana ekle" (PWA kurulumu).
 *
 * - Android / masaüstü Chrome ve Edge: tarayıcı `beforeinstallprompt` olayını verir; olay saklanır ve
 *   kullanıcı bizim düğmemize basınca tarayıcının kendi kurulum penceresi açılır.
 * - iPhone / iPad: böyle bir olay yok; kullanıcıya "Paylaş → Ana Ekrana Ekle" tarifi gösterilir.
 * - Uygulama zaten kuruluysa (ya da uygulama penceresinde açıksa) hiçbir şey gösterilmez.
 * "Şimdi değil" kalıcıdır (ft-install-v1): davet bir daha kendiliğinden çıkmaz; altbilgideki bağlantı kalır.
 *
 * Bu modül ana pakette yüklenir; olay sayfa açılır açılmaz gelebildiği için dinleyici modül yüklenince kurulur.
 */

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** 'prompt': tarayıcının kurulum penceresi açılabilir · 'ios': elle ekleme tarifi · null: gösterilecek bir şey yok */
export type InstallMode = 'prompt' | 'ios' | null

const PREF_KEY = 'ft-install-v1'
let deferred: InstallPromptEvent | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

const readPref = () => {
  try {
    return localStorage.getItem(PREF_KEY) ?? ''
  } catch {
    return ''
  }
}
const writePref = (v: 'dismissed' | 'installed') => {
  try {
    localStorage.setItem(PREF_KEY, v)
  } catch {
    /* gizli pencere: yalnızca bu oturum */
  }
  emit()
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // tarayıcının kendi alt şeridi yerine daveti biz, doğru anda gösteririz
    deferred = e as InstallPromptEvent
    emit()
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    writePref('installed')
  })
}

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

function snapshot() {
  const pref = readPref()
  const mode: InstallMode = isStandalone() || pref === 'installed' ? null : deferred ? 'prompt' : isIOS() ? 'ios' : null
  return `${mode ?? ''}|${pref === 'dismissed' ? 1 : 0}`
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/**
 * mode: ne gösterilebilir · dismissed: kullanıcı daveti kapattı (yalnızca altbilgi bağlantısı kalır).
 * Ön-render'da ve devralmada hiçbir şey gösterilmez (sunucu değeri: null).
 */
export function useInstall() {
  const snap = useSyncExternalStore(subscribe, snapshot, () => '|0')
  const [m, d] = snap.split('|')
  return {
    mode: (m || null) as InstallMode,
    dismissed: d === '1',
    /** Tarayıcının kurulum penceresini açar (yalnızca mode === 'prompt') */
    async install() {
      if (!deferred) return
      const e = deferred
      deferred = null // olay bir kez kullanılabilir
      await e.prompt()
      const { outcome } = await e.userChoice
      if (outcome === 'accepted') writePref('installed')
      else emit()
    },
    dismiss: () => writePref('dismissed'),
  }
}
