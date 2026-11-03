import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/*
 * Etkileşimli dijital kumpas (viewBox 1200×230).
 * - Fare: hareketli çene imleci yatayda takip eder.
 * - Dokunmatik: kumpas sürüklenir.
 * - Boşta: kendi kendine ölçüm yapar (inç değerlerine uğrar).
 * - Tam inç değerlerinde ekranın üstünde "= N inç" belirir (küçük sürpriz).
 */

const PPM = 6.4 // 1 mm = 6.4 birim
const ZERO = 150 // sabit çenenin ölçüm yüzeyi
const RANGE = 150 // mm
const INCH = 25.4
const IDLE_STOPS = [25.4, 63.5, 12, 101.6, 50.8, 38.1, 76.2]
const SLIDER_RIGHT = 406 // sürgü gövdesinin sağ kenarı (0 mm'de)

/** Dar ekranda cetvelin yalnızca baş kısmı gösterilir: kumpas ~%60 büyür, gerisi ekran dışına uzanır. */
const VIEW = {
  wide: { x: 0, w: 1200 },
  compact: { x: 40, w: 760 },
}

function useCompact() {
  const query = '(max-width: 767px)'
  const [compact, setCompact] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setCompact(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return compact
}

const fmt = (mm: number) => mm.toFixed(2).replace('.', ',')

function Scale() {
  const ticks: React.ReactNode[] = []
  for (let mm = 0; mm <= RANGE; mm++) {
    const x = ZERO + mm * PPM
    const len = mm % 10 === 0 ? 16 : mm % 5 === 0 ? 11 : 6
    ticks.push(<line key={mm} x1={x} y1={84} x2={x} y2={84 - len} />)
    if (mm % 10 === 0)
      ticks.push(
        <text key={`t${mm}`} x={x} y={58} textAnchor="middle" className="fill-graphite font-mono text-[11px]" stroke="none">
          {mm / 10}
        </text>,
      )
  }
  return <g className="stroke-graphite" strokeWidth={1}>{ticks}</g>
}

export default function Caliper({ active }: { active: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const slider = useRef<SVGGElement>(null)
  const value = useRef<SVGTextElement>(null)
  const gap = useRef<SVGRectElement>(null)
  const dim = useRef<SVGPathElement>(null)
  const inch = useRef<SVGTextElement>(null)
  const compact = useCompact()
  const view = compact ? VIEW.compact : VIEW.wide
  // Sürgü görünür alanın dışına çıkmasın
  const maxMm = Math.min(RANGE, Math.floor((view.x + view.w - 8 - SLIDER_RIGHT) / PPM))

  useGSAP(
    () => {
      if (!active) return
      const stops = IDLE_STOPS.filter((v) => v <= maxMm)
      const s = { mm: 0 }
      const render = () => {
        const x = s.mm * PPM
        slider.current!.setAttribute('transform', `translate(${x} 0)`)
        value.current!.textContent = fmt(s.mm)
        gap.current!.setAttribute('width', String(Math.max(0, x)))
        dim.current!.setAttribute('d', `M${ZERO} 186 H${ZERO + x}`)
        const inches = s.mm / INCH
        const near = Math.round(inches)
        const isInch = near >= 1 && Math.abs(inches - near) * INCH < 0.05
        inch.current!.textContent = isInch ? `= ${near} inç` : ''
      }
      const to = gsap.quickTo(s, 'mm', { duration: 0.7, ease: 'power3.out', onUpdate: render })

      // Boşta gezinti
      let idle: gsap.core.Timeline | null = null
      const startIdle = () => {
        idle?.kill()
        idle = gsap.timeline({ repeat: -1 })
        for (const stop of stops) idle.to(s, { mm: stop, duration: 1.4, ease: 'power3.inOut', onUpdate: render }).to({}, { duration: 1.3 })
      }
      let idleTimer = window.setTimeout(startIdle, 1400)
      const wake = () => {
        idle?.kill()
        idle = null
        window.clearTimeout(idleTimer)
        idleTimer = window.setTimeout(startIdle, 3500)
      }

      const toMm = (clientX: number) => {
        const r = svg.current!.getBoundingClientRect()
        const vx = view.x + ((clientX - r.left) / r.width) * view.w
        return gsap.utils.clamp(0, maxMm, (vx - ZERO) / PPM)
      }

      // Fare: bölüm içinde her yerde
      const section = root.current!.closest('section') ?? root.current!
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return
        wake()
        to(toMm(e.clientX))
      }
      section.addEventListener('pointermove', onMove)

      // Dokunmatik: sürükle
      let dragging = false
      const el = svg.current!
      const onDown = (e: PointerEvent) => {
        if (e.pointerType === 'mouse') return
        dragging = true
        wake()
        to(toMm(e.clientX))
      }
      const onDrag = (e: PointerEvent) => {
        if (!dragging) return
        wake()
        to(toMm(e.clientX))
      }
      const onUp = () => { dragging = false }
      el.addEventListener('pointerdown', onDown)
      window.addEventListener('pointermove', onDrag)
      window.addEventListener('pointerup', onUp)

      // Açılış: sıfırdan 1 inç'e
      gsap.to(s, { mm: INCH, duration: 1.6, delay: 0.6, ease: 'power3.inOut', onUpdate: render })

      return () => {
        idle?.kill()
        window.clearTimeout(idleTimer)
        section.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerdown', onDown)
        window.removeEventListener('pointermove', onDrag)
        window.removeEventListener('pointerup', onUp)
      }
    },
    { dependencies: [active, compact], scope: root, revertOnUpdate: true },
  )

  return (
    <div ref={root} className="relative select-none">
      <svg
        ref={svg}
        viewBox={`${view.x} 0 ${view.w} 230`}
        className="block w-full touch-pan-y"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
        strokeLinejoin="round"
        role="img"
        aria-label="Etkileşimli dijital kumpas"
      >
        {/* cetvel */}
        <rect x={60} y={40} width={1100} height={44} rx={3} fill="var(--color-mist)" />
        <Scale />

        {/* sabit çeneler */}
        <path d="M96 84 L150 84 L150 200 L141 214 L124 214 L96 128 Z" fill="var(--color-paper)" />
        <path d="M126 40 L150 40 L150 12 L141 12 Z" fill="var(--color-paper)" />

        {/* ölçülen aralık */}
        <rect ref={gap} x={ZERO} y={96} width={0} height={104} fill="var(--color-accent)" fillOpacity={0.07} stroke="none" />
        <path ref={dim} d={`M${ZERO} 186 H${ZERO}`} stroke="var(--color-accent)" strokeWidth={1} />

        {/* sürgü */}
        <g ref={slider}>
          <path d="M150 96 L150 200 L159 214 L176 214 L204 128 L204 96 Z" fill="var(--color-paper)" />
          <path d="M150 28 L150 12 L159 12 L174 28 Z" fill="var(--color-paper)" />
          <rect x={150} y={28} width={256} height={68} rx={8} fill="var(--color-paper)" />
          <rect x={232} y={39} width={152} height={46} rx={4} fill="#dfe4dc" stroke="var(--color-graphite)" strokeWidth={1} />
          <text ref={value} x={348} y={73} textAnchor="end" className="fill-ink font-mono text-[27px] font-medium tabular-nums" stroke="none">
            0,00
          </text>
          <text x={354} y={73} className="fill-graphite font-mono text-[12px]" stroke="none">mm</text>
          <text ref={inch} x={236} y={20} className="fill-accent-ink font-mono text-[13px] font-medium" stroke="none" />
          <circle cx={184} cy={50} r={6} />
          <circle cx={184} cy={74} r={6} />
          <text x={196} y={54} className="fill-muted font-mono text-[8px]" stroke="none">ON</text>
          <text x={196} y={78} className="fill-muted font-mono text-[8px]" stroke="none">0</text>
          <circle cx={290} cy={104} r={9} fill="var(--color-paper)" />
          <path d="M284 104 H296" strokeWidth={1} />
        </g>
      </svg>
      <p className="mt-3 flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]">
        <span className="inline-block h-px w-8 bg-current" />
        <span className="max-md:hidden">İMLECİ GEZDİRİN — KUMPAS ÖLÇSÜN</span>
        <span className="md:hidden">KUMPASI PARMAĞINIZLA KAYDIRIN</span>
      </p>
    </div>
  )
}
