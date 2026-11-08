import { useEffect, useState, type CSSProperties } from 'react'

/**
 * Açılıp kapanan öğeler (çekmece, menü, akordeon, alt çubuk) için: kapanırken animasyon bitene kadar
 * öğe sayfada kalır, sonra kaldırılır. Animasyonun kendisi CSS geçişidir (transition):
 * öğeye `data-state={state}` verilir, sınıflarda `data-[state=closed]:…` ile kapalı hâl yazılır.
 *
 *   const { mounted, state } = usePresence(open, 550)
 *   {mounted && <aside data-state={state} className="transition-transform duration-550 data-[state=closed]:translate-x-full">…}
 *
 * Başta açık gelen öğe animasyonsuz görünür. Açılışta iki kare beklenir: önce kapalı hâl çizilir,
 * sonra açık hâle geçilir (geçişin oynaması için gerekli).
 */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open)
  const [shown, setShown] = useState(open)
  // açılınca hemen sayfaya eklenir; kapanınca hemen "kapalı" hâle geçer (render sırasında, React'in önerdiği biçimde)
  if (open && !mounted) setMounted(true)
  if (!open && shown) setShown(false)

  useEffect(() => {
    if (open) {
      let second = 0
      const first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => setShown(true))
      })
      return () => {
        cancelAnimationFrame(first)
        cancelAnimationFrame(second)
      }
    }
    const t = window.setTimeout(() => setMounted(false), exitMs)
    return () => window.clearTimeout(t)
  }, [open, exitMs])

  return { mounted, state: (shown ? 'open' : 'closed') as 'open' | 'closed' }
}

/** CSS açılış animasyonlarının (index.css → .anim-*) gecikmesi/süresi/kayma mesafesi için satır içi stil. */
export const anim = (o: { delay?: number; dur?: number; y?: string }): CSSProperties =>
  ({
    ...(o.delay !== undefined && { '--anim-delay': `${o.delay}s` }),
    ...(o.dur !== undefined && { '--anim-dur': `${o.dur}s` }),
    ...(o.y !== undefined && { '--anim-y': o.y }),
  }) as CSSProperties
