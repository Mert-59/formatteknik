import { useEffect, useRef } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowDown, ArrowRight, ArrowUpRight, Camera, FileText } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CATEGORIES, type Category } from '../data/catalog'
import { GUIDES, type Guide } from '../data/guides'
import { BRANDS } from '../data/brands'
import { CATALOGS } from '../data/catalogs'
import CatalogCard from '../components/CatalogCard'
import { scrollToElement } from '../lib/scroll'
import { SITE, categoryPath, photoWhatsappUrl } from '../config/site'
import ToolDrawing from '../components/ToolDrawing'
import SectionHead from '../components/SectionHead'
import QuickAdd from '../cart/QuickAdd'
import { useCart } from '../cart/CartContext'
import { usePageMeta } from '../lib/usePageMeta'
import NotFound from './NotFound'

/**
 * Ürün grubu sayfası: /urunler/<grup>.
 * İçerik src/data/guides.ts'ten, grup adı/çizim src/data/catalog.ts'ten gelir.
 * Bilinmeyen grup → 404.
 */
export default function CategoryPage() {
  const { slug } = useParams()
  const index = CATEGORIES.findIndex((c) => c.slug === slug)
  const category = CATEGORIES[index]
  const guide = category && GUIDES[category.slug]
  if (!category || !guide) return <NotFound />
  return <CategoryView key={category.slug} category={category} guide={guide} index={index} />
}

const mono = 'font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]'
const p2 = (n: number) => String(n).padStart(2, '0')

function CategoryView({ category: c, guide: g, index }: { category: Category; guide: Guide; index: number }) {
  usePageMeta(c.name, g.metaDescription)
  const root = useRef<HTMLDivElement>(null)
  const { count, orderNo } = useCart()

  // Başlıktaki teknik çizim "plotter" gibi çizilir (bkz. index.css .plot)
  useGSAP(() => {
    gsap.fromTo('.hero-plot .plot', { '--plot': 1 }, { '--plot': 0, duration: 1.8, ease: 'power2.inOut', delay: 0.2 })
  }, { scope: root })

  const brands = g.brands.map((name) => BRANDS.find((b) => b.name === name) ?? { name })
  const catalogs = CATALOGS[c.slug] ?? []
  const { hash } = useLocation()

  // Başka sayfadan /urunler/<grup>#katalog ile gelinince katalog bölümüne kay (sayfa içi bağlantıda tarayıcı kendisi kayar)
  useEffect(() => {
    if (hash !== '#katalog') return
    const t = window.setTimeout(() => {
      const el = document.getElementById('katalog')
      if (el) scrollToElement(el, window.innerWidth < 768 ? -80 : -104)
    }, 250)
    return () => window.clearTimeout(t)
  }, [hash])
  const others = CATEGORIES.filter((o) => o.slug !== c.slug)

  // Bölüm numaraları sırayla (gizli marka bölümü numara atlatmaz)
  let n = 0
  const next = () => p2(++n)

  // Arama motorları için sayfa konumu: Anasayfa › Ürünlerimiz › Grup
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Anasayfa', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Ürünlerimiz', item: `${SITE.url}/urunler` },
      { '@type': 'ListItem', position: 3, name: c.name, item: SITE.url + categoryPath(c.slug) },
    ],
  }

  return (
    <div ref={root}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* başlık */}
      <section className="mx-auto max-w-[1440px] px-5 pb-14 pt-28 md:px-10 md:pb-20 md:pt-40">
        <nav aria-label="Sayfa konumu" className={`anim-fade-up flex items-center gap-3 ${mono}`}>
          <span className="size-1.5 rounded-full bg-accent" />
          <Link to="/urunler" className="hover:text-ink">
            ÜRÜNLERİMİZ
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink" aria-current="page">
            {p2(index + 1)} — {c.name.toLocaleUpperCase('tr-TR')}
          </span>
          <span className="h-px flex-1 bg-line" />
        </nav>

        <div className="mt-8 grid items-end gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h1 className="-mt-[0.16em] overflow-hidden pb-[0.06em] pt-[0.16em] font-wide text-[clamp(40px,7vw,104px)] font-semibold leading-[0.92] tracking-[-0.04em]">
              <span className="anim-line-up block [--anim-delay:0.1s]">
                {c.name}
              </span>
            </h1>
            <p className="anim-fade-up mt-6 max-w-xl text-[17px] leading-relaxed text-graphite [--anim-delay:0.35s] [--anim-dur:0.9s] [--anim-y:16px]">
              {c.description}
            </p>
            {/* katalog varsa: aşağıdaki katalog bölümüne kısa yol */}
            {catalogs.length > 0 && (
              <a
                href="#katalog"
                className="anim-fade-up mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-ink/15 px-4 text-[13px] font-medium transition-colors hover:border-ink [--anim-delay:0.5s]"
              >
                <FileText className="size-4" />
                {catalogs.length > 1 ? `${catalogs.length} PDF katalog` : 'PDF katalog'}
                <ArrowDown className="size-3.5 text-muted" />
              </a>
            )}
          </div>
          <div className="hero-plot rounded-3xl bg-mist px-6 py-8 text-ink md:px-10 md:py-12 lg:col-span-5">
            <ToolDrawing kind={c.drawing} className="mx-auto w-full max-w-[420px]" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] items-start gap-12 px-5 pb-24 md:px-10 lg:grid-cols-12">
        {/* fişe ekleme — telefonda içeriğin üstünde, masaüstünde sağda sabit */}
        <aside className="max-lg:order-first lg:sticky lg:top-28 lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
          <div className="rounded-3xl border border-line bg-paper p-5 md:p-6">
            <p className={mono}>BU GRUPTAN TEKLİF İSTEYİN</p>
            <p className="mt-2 text-[14px] leading-relaxed text-graphite">Kodu ya da ölçüyü yazın, Enter’a basın. Fişiniz hazır olunca WhatsApp’tan gönderin.</p>
            <div className="mt-5">
              <QuickAdd category={c.slug} showOpen />
            </div>
            <a
              href={photoWhatsappUrl(count ? orderNo : '')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-graphite underline-offset-4 hover:text-ink hover:underline"
            >
              <Camera className="size-4" /> Kodu bilmiyorum, fotoğrafla sor
            </a>
          </div>
        </aside>

        <div className="space-y-20 md:space-y-24 lg:col-span-7 lg:row-start-1">
          {/* genel bakış */}
          <section>
            <p className={mono}>GENEL BAKIŞ</p>
            <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-graphite md:text-[17px]">
              {g.overview.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>

          {/* PDF kataloglar — data/catalogs.ts'te bu grup için katalog yoksa gösterilmez */}
          {catalogs.length > 0 && (
            <section id="katalog" className="scroll-mt-28">
              <SectionHead
                compact
                index={next()}
                label="KATALOG"
                title={<>{catalogs.length > 1 ? 'Ürün katalogları.' : 'Ürün kataloğu.'}</>}
              />
              <div className="space-y-4">
                {catalogs.map((k) => (
                  <CatalogCard key={k.id} catalog={k} />
                ))}
              </div>
              <Link
                to="/kataloglar"
                className="group mt-5 inline-flex items-center gap-1.5 text-[14px] text-graphite underline-offset-4 hover:text-ink hover:underline"
              >
                Tüm kataloglar <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </section>
          )}

          {/* markalar — guides.ts'te liste boşsa gösterilmez */}
          {brands.length > 0 && (
            <section>
              <SectionHead compact index={next()} label="MARKALAR" title={<>Bu grupta tedarik ettiğimiz markalar.</>} />
              <ul className="flex flex-wrap gap-px overflow-hidden rounded-2xl border border-line bg-line">
                {brands.map((b) => (
                  <li key={b.name} className="flex min-h-24 grow basis-[calc(50%-1px)] items-center justify-center bg-paper p-5 sm:basis-[calc(33.333%-1px)]">
                    {'logo' in b && b.logo ? (
                      <img src={b.logo} alt={b.name} loading="lazy" decoding="async" className="h-9 w-auto max-w-[75%] object-contain" />
                    ) : (
                      <span className="font-wide text-[17px] font-semibold text-graphite">{b.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {/* diğer gruplar */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <SectionHead compact index={next()} label="DİĞER ÜRÜN GRUPLARI" title={<>Tek adreste dokuz grup.</>} />
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.slug} className="bg-paper">
                <Link to={categoryPath(o.slug)} className="group flex h-full items-start justify-between gap-4 p-5 transition-colors hover:bg-mist md:p-6">
                  <span>
                    <span className="block text-[16px] font-semibold">{o.name}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-muted">{o.short}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/urunler" className="group mt-10 inline-flex items-center gap-2 text-[15px] font-medium underline-offset-4 hover:underline">
            Tüm ürün grupları <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
