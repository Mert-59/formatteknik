import { useCallback, useSyncExternalStore } from 'react'

/*
 * Ön-render (derleme sırasında üretilen HTML) ile tarayıcıdaki ilk çizimin aynı olması gerekir;
 * aksi hâlde React "hydration" uyuşmazlığı verir. Tarayıcıya özgü değerler (ekran genişliği,
 * adres çubuğundaki #çapa vb.) bu kancalarla okunur: sunucuda ve devralma (hydration) sırasında
 * sabit değer döner, hemen ardından gerçek değerle yeniden çizilir.
 */

const noop = () => () => {}

/** Sunucuda ve devralma sırasında false; tarayıcıda hemen ardından true. */
export const useIsClient = () =>
  useSyncExternalStore(
    noop,
    () => true,
    () => false,
  )

const subscribeOnline = (onChange: () => void) => {
  window.addEventListener('online', onChange)
  window.addEventListener('offline', onChange)
  return () => {
    window.removeEventListener('online', onChange)
    window.removeEventListener('offline', onChange)
  }
}

/** İnternet bağlantısı var mı (tarayıcının bildiği kadarıyla). Sunucuda ve devralmada true. */
export const useOnline = () =>
  useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  )

/** CSS medya sorgusu. Sunucuda `serverValue` (varsayılan: masaüstü varsayımı, false). */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  )
}
