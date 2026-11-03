import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { CATEGORIES } from '../data/catalog'
import ToolDrawing from '../components/ToolDrawing'
import AddToCart from '../cart/AddToCart'
import PageHero from '../components/PageHero'
import { scrollToElement } from '../lib/smoothScroll'

gsap.registerPlugin(ScrollTrigger)

const goTo = (slug: string) => {
  const el = document.getElementById(slug)
  if (el) scrollToElement(el, window.innerWidth < 1024 ? -132 : -96)
  history.replaceState(null, '', `#${slug}`)
}

export default function Products() {
  const root = useRef<HTMLDivElement>(null)
  const chips = useRef<HTMLDivElement>(null)
  const { hash } = useLocation()
  const [active, setActive] = useState(CATEGORIES[0].slug)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.cat').forEach((el) => {
        gsap.fromTo(
          el.querySelector('.plot'),
          { '--plot': 1 },
          { '--plot': 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 80%', once: true } },
        )
        // Ekranın ortasından geçen grup "aktif" olur
        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => self.isActive && setActive(el.id),
        })
      })
    },
    { scope: root },
  )

  // Mobil şeritte aktif çipi görünür tut
  useEffect(() => {
    const bar = chips.current
    const chip = bar?.querySelector<HTMLElement>(`[data-slug="${active}"]`)
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - 20, behavior: 'smooth' })
  }, [active])

  // /urunler#torna-uclari → ilgili gruba kaydır
  useEffect(() => {
    if (!hash) return
    const slug = decodeURIComponent(hash.slice(1))
    const t = window.setTimeout(() => goTo(slug), 250)
    return () => window.clearTimeout(t)
  }, [hash])

  return (
    <div ref={root}>
      <PageHero
        label="ÜRÜNLERİMİZ"
        title={<>Ürün grupları<span className="text-accent">.</span></>}
        text="Aradığınız ürünün kodunu ya da tarifini yazın, adedini girin ve sepete ekleyin. Sepetinizi tek dokunuşla WhatsApp üzerinden bize iletin."
      />

      {/* mobil/tablet: yapışkan kategori şeridi */}
      <div className="sticky top-16 z-20 -mt-6 mb-6 border-y border-line bg-paper/90 backdrop-blur-md md:top-20 lg:hidden">
        <div ref={chips} className="no-scrollbar flex gap-2 overflow-x-auto px-5 py-3 md:px-10">
          {CATEGORIES.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              data-slug={c.slug}
              onClick={() => goTo(c.slug)}
              className={`flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] transition-colors ${
                active === c.slug ? 'border-ink bg-ink text-paper' : 'border-line text-graphite'
              }`}
            >
              <span className={`font-mono text-[10px] ${active === c.slug ? 'text-paper/60' : 'text-muted'}`}>{String(i + 1).padStart(2, '0')}</span>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-28 md:px-10 lg:grid-cols-12">
        {/* masaüstü: içindekiler */}
        <aside className="hidden lg:col-span-3 lg:block">
          <nav className="sticky top-28 font-mono text-[11px] tracking-[0.14em]" aria-label="Ürün grupları">
            <p className="mb-4 tracking-[0.22em] text-muted">İÇİNDEKİLER</p>
            <ol className="space-y-1">
              {CATEGORIES.map((c, i) => (
                <li key={c.slug}>
                  <a
                    href={`#${c.slug}`}
                    onClick={(e) => {
                      e.preventDefault()
                      goTo(c.slug)
                    }}
                    className={`group flex items-center gap-3 py-1.5 transition-colors ${active === c.slug ? 'text-ink' : 'text-graphite hover:text-ink'}`}
                  >
                    <span className={active === c.slug ? 'text-accent-ink' : 'text-muted'}>{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`h-px bg-current transition-all ${active === c.slug ? 'w-6 opacity-100' : 'w-3 opacity-30 group-hover:w-6 group-hover:opacity-100'}`}
                    />
                    {c.name.toLocaleUpperCase('tr-TR')}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="space-y-4 md:space-y-6 lg:col-span-9">
          {CATEGORIES.map((c, i) => (
            <section key={c.slug} id={c.slug} className="cat rounded-3xl border border-line p-4 sm:p-5 md:p-8">
              <div className="grid gap-5 sm:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] sm:gap-8">
                <div className="rounded-2xl bg-mist px-4 py-5 text-ink sm:px-5 sm:py-8">
                  <ToolDrawing kind={c.drawing} className="mx-auto w-full max-w-[360px]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted">
                    <span className="text-ink">{String(i + 1).padStart(2, '0')}</span> / {String(CATEGORIES.length).padStart(2, '0')} — ÜRÜN GRUBU
                  </span>
                  <h2 className="mt-3 font-wide text-[clamp(26px,3vw,42px)] font-semibold leading-tight tracking-[-0.025em]">{c.name}</h2>
                  <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted">{c.description}</p>
                </div>
              </div>
              <div className="mt-5 md:mt-6">
                <AddToCart category={c} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
