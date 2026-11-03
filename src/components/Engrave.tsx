import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/*
 * Girişteki lazer kazımanın sayfa içi karşılığı.
 * Katmanlar: silik dış hat (taslak) → soldan dolan mürekkep (önde kızıl ısı) → lazer cephesi.
 * mode="scrub": kaydırmaya bağlı ilerler. mode="once": görünür olunca bir kez kazınır.
 */

type Props = {
  text: string
  className?: string
  mode?: 'scrub' | 'once'
  start?: string
  end?: string
}

export default function Engrave({ text, className = '', mode = 'once', start = 'top 85%', end = 'top 40%' }: Props) {
  const root = useRef<HTMLSpanElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const front = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const s = { p: 0, cool: 0 }
      const render = () => {
        const p = s.p * 100
        const hot = 9 * (1 - s.cool)
        fill.current!.style.clipPath = `inset(0 ${100 - p}% 0 0)`
        fill.current!.style.backgroundImage = `linear-gradient(90deg, var(--color-ink) ${p - hot}%, var(--color-accent) ${p}%)`
        front.current!.style.left = `${p}%`
        front.current!.style.opacity = s.p > 0.001 && s.p < 0.999 ? '1' : '0'
      }
      render()

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        s.p = 1
        s.cool = 1
        render()
        return
      }

      if (mode === 'scrub') {
        gsap.to(s, {
          p: 1,
          ease: 'none',
          onUpdate: () => {
            s.cool = s.p >= 1 ? 1 : 0
            render()
          },
          scrollTrigger: { trigger: root.current, start, end, scrub: 0.6 },
        })
      } else {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start, once: true } })
          .to(s, { p: 1, duration: 1.6, ease: 'power1.inOut', onUpdate: render })
          .to(s, { cool: 1, duration: 0.9, ease: 'power2.out', onUpdate: render })
      }
    },
    { scope: root },
  )

  return (
    <span ref={root} className={`relative inline-block whitespace-nowrap ${className}`}>
      {/* taslak */}
      <span aria-hidden className="text-transparent [-webkit-text-stroke:1px_#cfd3d7]">{text}</span>
      {/* kazınan mürekkep — Türkçe aksanlar (İ noktası, Ç çengeli) satır kutusu dışına taşar;
          dolgu zemini onları da kapsasın diye kutu dikeyde genişletilir. */}
      <span
        ref={fill}
        className="absolute inset-x-0 bg-clip-text text-transparent [-webkit-background-clip:text]"
        style={{ top: '-0.3em', bottom: '-0.25em', paddingTop: '0.3em' }}
      >
        {text}
      </span>
      {/* lazer cephesi */}
      <span
        ref={front}
        aria-hidden
        className="pointer-events-none absolute -bottom-[4%] -top-[4%] w-[2px] -translate-x-1/2 bg-accent opacity-0 shadow-[0_0_14px_3px_rgba(229,64,27,0.55),0_0_2px_1px_#fff]"
      />
    </span>
  )
}
