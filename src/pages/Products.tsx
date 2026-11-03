import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORIES } from '../data/catalog'
import ToolDrawing from '../components/ToolDrawing'
import AddToCart from '../cart/AddToCart'
import PageHero from '../components/PageHero'
import { scrollToElement } from '../lib/scroll'
import { usePageMeta } from '../lib/usePageMeta'

const headerOffset = () => (window.innerWidth < 768 ? -80 : -104)

export default function Products() {
  usePageMeta(
    'Ürünlerimiz',
    'Torna uçları, frezeler, kılavuz, karbür ve HSS matkaplar, ölçü aletleri, shrink-fit tutucular ve pensler. Kodu yazın, sepete ekleyin, WhatsApp veya e-postayla gönderin.',
  )
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const { hash } = useLocation()
  // /urunler#torna-uclari → grup formda seçili gelir
  const [slug, setSlug] = useState(() => {
    const s = decodeURIComponent(hash.slice(1))
    return CATEGORIES.some((c) => c.slug === s) ? s : ''
  })

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.cat').forEach((el) => {
        gsap.fromTo(
          el.querySelector('.plot'),
          { '--plot': 1 },
          { '--plot': 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
        )
      })
    },
    { scope: root },
  )

  // ... ve sayfa o gruba kayar
  useEffect(() => {
    const s = decodeURIComponent(hash.slice(1))
    if (!CATEGORIES.some((c) => c.slug === s)) return
    const t = window.setTimeout(() => {
      const el = document.getElementById(s)
      if (el) scrollToElement(el, headerOffset())
    }, 250)
    return () => window.clearTimeout(t)
  }, [hash])

  /** Kartlardaki "Bu gruptan ekle": grubu seçer, form görünmüyorsa forma kayar, kod alanına odaklanır. */
  const pick = (s: string) => {
    setSlug(s)
    const r = panel.current!.getBoundingClientRect()
    if (r.top < 0 || r.top > window.innerHeight * 0.6) scrollToElement(panel.current!, headerOffset())
    codeRef.current?.focus({ preventScroll: true })
  }

  return (
    <div ref={root}>
      <PageHero
        label="ÜRÜNLERİMİZ"
        title={<>Ürün grupları<span className="text-accent">.</span></>}
        text="Ürün grubunu seçin, kodunu ya da tarifini yazın, adedini girin ve sepete ekleyin. Sepetinizi tek dokunuşla WhatsApp veya e-postayla bize iletin."
      />

      <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-5 pb-28 md:px-10 lg:grid-cols-12 lg:gap-12">
        {/* tek sipariş formu — masaüstünde kaydırırken yanda sabit */}
        <aside className="lg:sticky lg:top-28 lg:col-span-5 xl:col-span-4">
          <div ref={panel} className="rounded-3xl border border-line bg-paper p-5 md:p-6">
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]">
              <span className="size-1.5 rounded-full bg-accent" />
              SEPETE EKLE
              <span className="h-px flex-1 bg-line" />
            </div>
            <AddToCart slug={slug} onSlugChange={setSlug} codeRef={codeRef} />
          </div>
        </aside>

        <div className="lg:col-span-7 xl:col-span-8">
          <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line">
            {CATEGORIES.map((c, i) => {
              const selected = c.slug === slug
              return (
                <li
                  key={c.slug}
                  id={c.slug}
                  className={`cat grid grid-cols-[88px_minmax(0,1fr)] items-start gap-4 p-4 transition-colors duration-300 sm:grid-cols-[168px_minmax(0,1fr)] sm:items-center sm:gap-6 md:p-6 ${
                    selected ? 'bg-mist' : 'bg-paper'
                  }`}
                >
                  <div className={`rounded-xl px-2 py-3 transition-colors sm:px-3 sm:py-4 ${selected ? 'bg-paper text-accent-ink' : 'bg-mist text-ink'}`}>
                    <ToolDrawing kind={c.drawing} className="w-full" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-muted">
                      <span className="text-ink">{String(i + 1).padStart(2, '0')}</span> / {String(CATEGORIES.length).padStart(2, '0')}
                    </span>
                    <h2 className="mt-1.5 font-wide text-[clamp(20px,2.2vw,28px)] font-semibold leading-tight tracking-[-0.02em]">{c.name}</h2>
                    <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted md:text-[15px]">{c.description}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <span className="font-mono text-[11px] tracking-[0.06em] text-muted max-sm:hidden">{c.example}</span>
                      <button
                        type="button"
                        onClick={() => pick(c.slug)}
                        aria-pressed={selected}
                        className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-[13px] font-medium transition-colors ${
                          selected ? 'border-ink bg-ink text-paper' : 'border-ink/15 hover:border-ink'
                        }`}
                      >
                        {selected ? 'Seçili grup' : 'Bu gruptan ekle'}
                        {!selected && <ArrowUpRight className="size-4" />}
                      </button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
