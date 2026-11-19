import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import { GEAR, SPINDLE, TOOL, TOOL_SCALE, TOOL_TOP } from './emblem-paths'

/**
 * Format Teknik amblemi — firma logosunun yazısız, tek renk hâli (dişli çark + iş mili + parmak freze).
 * Yollar logodan üretilir: scripts/emblem.mjs → emblem-paths.ts. Renk: currentColor; freze sitenin kızılı.
 *
 * `spin`: dişli sayfa kaydırıldıkça döner — her 180 px kaydırma bir diş (22,5°); yukarı kaydırınca geri döner.
 * Üzerine gelince (bağlantının üstüne) bir diş ilerler. İş mili ve freze sabit kalır.
 * Hareketi azalt ayarı açıksa dönmez. Kaydırmada React yeniden çizilmez; yalnızca dişlinin dönüşü değişir.
 */
export default function Emblem({ spin = false, className = '' }: { spin?: boolean; className?: string }) {
  const gear = useRef<SVGPathElement>(null)
  useGearSpin(gear, spin)

  return (
    <svg viewBox="-50 -50 100 100" aria-hidden focusable="false" fill="currentColor" className={className}>
      {/* fill-box + center: dişli kendi merkezinde (0,0) döner */}
      <EmblemMark gearRef={gear} gearStyle={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    </svg>
  )
}

/**
 * Amblemin çizimi, başka bir SVG'nin içinde kullanmak için (ör. teklif fişindeki kaşe — cart/Slip.tsx).
 * Koordinatlar: merkez (0,0), dış yarıçap 48 — yerleştiren `translate(...) scale(...)` ile konumlar.
 * Dişli `gearRef` ile ayrıca döndürülebilir; iş mili ve freze sabit kalır.
 * `mono`: freze de currentColor (tek renk baskı, ör. kaşe mürekkebi).
 */
export function EmblemMark({
  gearRef,
  gearStyle,
  mono = false,
}: {
  gearRef?: RefObject<SVGPathElement | null>
  gearStyle?: CSSProperties
  mono?: boolean
}) {
  return (
    <g fill="currentColor" stroke="none">
      <path ref={gearRef} d={GEAR} fillRule="evenodd" style={gearStyle} />
      {/* küçük boyut düzeltmesi: takım grubu iş milinin tepesinden büyütülür (halkaya asılı kalır) */}
      <g transform={`translate(0 ${TOOL_TOP}) scale(${TOOL_SCALE}) translate(0 ${-TOOL_TOP})`}>
        <path d={SPINDLE} fillRule="evenodd" />
        <path d={TOOL} fillRule="evenodd" className={mono ? undefined : 'fill-accent'} />
      </g>
    </g>
  )
}

const TOOTH = 22.5 // 16 diş
const DEG_PER_PX = TOOTH / 180
const TAU = 90 // ms — yumuşatma süresi sabiti: ~0,3 sn'de yerine oturur (ekran tazeleme hızından bağımsız)

function useGearSpin(ref: RefObject<SVGPathElement | null>, on: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!on || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let extra = 0 // üzerine gelince eklenen dişler
    const target = () => window.scrollY * DEG_PER_PX + extra
    let angle = target() // sayfa ortasında açılırsa dişli zıplamasın: olduğu yerden başlar
    let raf = 0
    let last = 0
    const draw = () => (el.style.transform = `rotate(${angle.toFixed(2)}deg)`)
    const frame = (now: number) => {
      const t = target()
      const dt = last ? Math.min(now - last, 100) : 16
      last = now
      angle += (t - angle) * (1 - Math.exp(-dt / TAU))
      if (Math.abs(t - angle) < 0.05) angle = t
      draw()
      raf = angle === t ? 0 : requestAnimationFrame(frame)
      if (!raf) last = 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const tick = () => {
      extra += TOOTH
      kick()
    }

    draw()
    const host = el.closest('a, button')
    window.addEventListener('scroll', kick, { passive: true })
    host?.addEventListener('pointerenter', tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', kick)
      host?.removeEventListener('pointerenter', tick)
    }
  }, [ref, on])
}
