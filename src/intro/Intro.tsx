import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { IntroScene } from './IntroScene'
import { placeName } from './geo'

gsap.registerPlugin(useGSAP)

type Props = {
  /** Geçiş başladığında (ana sayfa görünmeye başlar) */
  onReveal: () => void
  /** Giriş tamamen bittiğinde (bileşen kaldırılabilir) */
  onComplete: () => void
}

const REVEAL_DURATION = 1.5

function createScene(canvas: HTMLCanvasElement) {
  try {
    return new IntroScene(canvas)
  } catch (err) {
    console.warn('[Intro] WebGL başlatılamadı, giriş atlanıyor.', err)
    return null
  }
}

/** Kelimeleri maskeli satırlara böler; her kelime alttan kayarak gelir. */
function Words({ text }: { text: string }) {
  return text.split(' ').map((word, i) => (
    <span key={i} className="mr-[0.24em] inline-block overflow-hidden pb-[0.12em] align-bottom">
      <span className="w inline-block will-change-transform">{word}</span>
    </span>
  ))
}

export default function Intro({ onReveal, onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const layerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLSpanElement>(null)
  const crossRef = useRef<HTMLDivElement>(null)
  const placeRef = useRef<HTMLSpanElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<() => void>(() => {})

  const callbacks = useRef({ onReveal, onComplete })
  useLayoutEffect(() => {
    callbacks.current = { onReveal, onComplete }
  })

  useGSAP(
    () => {
      const layer = layerRef.current!
      const ring = ringRef.current!
      const stage = stageRef.current!

      let revealed = false
      let finished = false
      const reveal = () => {
        if (revealed) return
        revealed = true
        callbacks.current.onReveal()
      }
      const finish = () => {
        if (finished) return
        finished = true
        callbacks.current.onComplete()
      }

      const scene = createScene(canvasRef.current!)
      if (!scene) {
        reveal()
        finish()
        return
      }

      const tl = gsap.timeline({ paused: true })
      scene.addTo(tl) // 3D hareketler + etiketler: draw, rise, fly, arrive, engrave, settle, reveal

      /* ---------- HUD ve anlatı ---------- */
      gsap.set('.hud', { opacity: 0 })
      gsap.set('.cap .w', { yPercent: 115 })

      tl.to('.hud', { opacity: 1, duration: 0.8, stagger: 0.06, ease: 'power1.out' }, 0)

      tl.to('.cap-a .w', { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07 }, 0.9)
      tl.to('.cap-a .w', { yPercent: -115, duration: 0.6, ease: 'power2.in', stagger: 0.04 }, 3.4)
      tl.to('.cap-b .w', { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.07 }, 3.9)
      tl.to('.cap-b .w', { yPercent: -115, duration: 0.5, ease: 'power2.in', stagger: 0.035 }, 'arrive+=0.45')

      const setStage = (text: string, at: string) => {
        tl.to(stage, { opacity: 0, duration: 0.15, ease: 'none' }, at)
          .call(() => { stage.textContent = text }, [], '>')
          .to(stage, { opacity: 1, duration: 0.25, ease: 'none' }, '>')
      }
      setStage('02 / MARMARA', 'fly+=2.6')
      setStage('03 / TEKİRDAĞ', 'arrive+=0.4')

      tl.to(crossRef.current, { opacity: 0, scale: 0.6, duration: 0.6, ease: 'power2.in' }, 'arrive')

      /* ---------- Geçiş: ana sayfa kazınan yazının merkezinden açılan daireyle görünür ---------- */
      tl.to('.hud', { opacity: 0, duration: 0.5, ease: 'power1.in' }, 'reveal')

      const mask = { p: 0 }
      let cx = 0
      let cy = 0
      const applyMask = () => {
        const w = window.innerWidth
        const h = window.innerHeight
        const maxR = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + 60
        const r = mask.p * maxR
        const g = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${r}px, #000 ${r + 1.5}px)`
        layer.style.setProperty('mask-image', g)
        layer.style.setProperty('-webkit-mask-image', g)
        ring.style.width = ring.style.height = `${r * 2}px`
        ring.style.transform = `translate3d(${cx - r}px, ${cy - r}px, 0)`
        ring.style.opacity = String(Math.min(1, mask.p * 40) * (1 - Math.max(0, (mask.p - 0.6) / 0.4)))
      }
      tl.to(mask, {
        p: 1,
        duration: REVEAL_DURATION,
        ease: 'power3.inOut',
        onStart: reveal,
        onComplete: finish,
      }, 'reveal')

      const end = tl.labels.reveal + REVEAL_DURATION

      // Geliştirme: konsoldan kare kare inceleme → __introTl.pause().seek(5)
      if (import.meta.env.DEV) Object.assign(window, { __introTl: tl, __introScene: scene })

      /* ---------- Her kare: HUD okumaları ve maske ---------- */
      let frame = 0
      scene.onFrame = () => {
        const p = scene.focusOnScreen()
        cx = p.x
        cy = p.y
        if (mask.p > 0) applyMask()

        if (frame++ % 6 === 0) {
          const [lon, lat] = scene.targetLonLat()
          placeRef.current!.textContent = placeName(lon, lat).toLocaleUpperCase('tr-TR')
        }
        barRef.current!.style.transform = `scaleX(${Math.min(1, tl.time() / end)})`
      }

      /* ---------- Atla ---------- */
      skipRef.current = () => {
        if (revealed) return
        tl.pause()
        reveal()
        gsap.to(layer, { opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: finish })
      }
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') skipRef.current()
      }
      window.addEventListener('keydown', onKey)

      let cancelled = false
      scene.warmup().then(() => {
        if (!cancelled) tl.play()
      })

      return () => {
        cancelled = true
        window.removeEventListener('keydown', onKey)
        scene.onFrame = null
        scene.dispose()
      }
    },
    { scope: rootRef },
  )

  return (
    <div ref={rootRef} className="fixed inset-0 z-50 overflow-hidden" role="presentation">
      <div ref={layerRef} className="absolute inset-0 bg-night text-snow">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden />

        {/* kenar karartma */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.6))]" />

        {/* ilerleme çizgisi */}
        <div className="hud absolute inset-x-0 top-0 h-px bg-white/10">
          <div ref={barRef} className="h-full origin-left bg-accent" style={{ transform: 'scaleX(0)' }} />
        </div>

        {/* üst bar */}
        <div className="hud absolute inset-x-0 top-0 flex items-start justify-between p-5 font-mono text-[11px] tracking-[0.22em] md:p-8">
          <span>
            FORMAT <span className="text-fog">TEKNİK</span>
          </span>
          <span ref={stageRef} className="text-fog">01 / TÜRKİYE</span>
        </div>

        {/* nişangah — kameranın baktığı nokta; KONUM göstergesi bu noktaya aittir */}
        <div
          ref={crossRef}
          className="hud pointer-events-none absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="absolute left-1/2 top-0 h-3 w-px bg-snow/40" />
          <span className="absolute bottom-0 left-1/2 h-3 w-px bg-snow/40" />
          <span className="absolute left-0 top-1/2 h-px w-3 bg-snow/40" />
          <span className="absolute right-0 top-1/2 h-px w-3 bg-snow/40" />
          <span className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
        </div>

        {/* anlatı */}
        <div className="pointer-events-none absolute bottom-24 left-5 w-[min(88vw,13em)] text-[clamp(30px,5.2vw,68px)] font-semibold leading-[0.98] tracking-[-0.02em] [font-stretch:125%] md:bottom-24 md:left-8">
          <p className="cap cap-a absolute bottom-0 left-0"><Words text="Türkiye’nin üretim haritasında…" /></p>
          <p className="cap cap-b absolute bottom-0 left-0"><Words text="…hassasiyetin bir adresi var." /></p>
        </div>

        {/* okumalar */}
        <div className="hud absolute bottom-5 left-5 grid grid-cols-[auto_auto] gap-x-5 gap-y-1 font-mono text-[10px] tracking-[0.16em] text-fog md:bottom-8 md:left-8 md:text-[11px]">
          <span>KONUM</span><span ref={placeRef} className="text-accent">—</span>
        </div>

        <button
          type="button"
          onClick={() => skipRef.current()}
          className="hud group absolute bottom-2 right-2 flex items-center gap-3 p-3 font-mono text-[11px] tracking-[0.22em] text-fog transition-colors hover:text-snow focus-visible:text-snow focus-visible:outline-none md:bottom-5 md:right-5"
        >
          GİRİŞİ ATLA
          <span className="inline-block h-px w-8 bg-current transition-all group-hover:w-12" />
        </button>
      </div>

      {/* geçiş halkası — maskenin kenarını belirginleştirir */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-0 top-0 rounded-full border border-snow/50 opacity-0 shadow-[0_0_24px_rgba(233,237,241,0.12)]"
      />
    </div>
  )
}
