import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CATEGORIES } from '../data/catalog'
import { ALL_CATALOGS, catalogCover } from '../data/catalogs'
import { categoryPath } from '../config/site'
import { useIntro } from '../lib/introState'
import { useCart } from '../cart/CartContext'
import { anim } from '../lib/presence'
import { usePageMeta } from '../lib/usePageMeta'
import Caliper from '../components/Caliper'
import ToolDrawing from '../components/ToolDrawing'
import SectionHead from '../components/SectionHead'
import BrandWall from '../components/BrandWall'
import HeroCode from '../components/HeroCode'

/*
 * Açılış sırası (saf CSS, index.css .anim-*): üst satır → iki başlık satırı → metin → kumpas, 80 ms arayla.
 * Giriş sürerken animasyonlar ilk karede bekler (data-entered="false"), geçişle birlikte oynar.
 */
const STAGGER = 0.08
const START = 0.45
const rise = (i: number) => anim({ delay: START + i * STAGGER, dur: 1.1, y: '36px' })
const line = (i: number) => anim({ delay: START + i * STAGGER, dur: 1.2, y: '110%' })

/* ------------------------------------------------------------------ HERO */

function Hero() {
  const { phase, run } = useIntro()
  const entered = phase !== 'intro'

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden pt-28 md:pt-32">
      {/* ince teknik ızgara */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,18,21,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,18,21,0.045)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_70%_60%_at_40%_40%,#000_30%,transparent_80%)]" />

      {/* key: "Girişi izle" ile giriş yeniden oynayınca açılış animasyonları da baştan başlar */}
      <div
        key={run}
        data-entered={entered}
        className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 md:px-10"
      >
        <div style={rise(0)} className="anim-fade-up flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]">
          <span className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-accent" /> ÇORLU / TEKİRDAĞ
          </span>
          <span className="max-sm:hidden">KESİCİ TAKIM · ÖLÇÜM · SARF</span>
        </div>

        <div className="relative mt-[clamp(28px,7svh,64px)] flex flex-col gap-8 md:mt-10 md:flex-1 md:justify-end md:gap-10">
          {/* En uzun satır "Çözüm Ortağı" ≈7em: 11vw her genişlikte kapsayıcıya sığar */}
          <h1 className="font-wide text-[clamp(36px,11vw,164px)] font-semibold leading-[0.88] tracking-[-0.045em]">
            <span className="-mb-[0.16em] block overflow-hidden pb-[0.22em]">
              <span style={line(1)} className="anim-line-up block">Güvenilir</span>
            </span>
            <span className="-mb-[0.16em] block overflow-hidden pb-[0.22em]">
              <span style={line(2)} className="anim-line-up block">
                Çözüm Ortağı
              </span>
            </span>
          </h1>
          {/* masaüstünde kısa "Güvenilir" satırının sağındaki boşluğa oturur */}
          <div style={rise(3)} className="anim-fade-up max-w-sm lg:absolute lg:right-0 lg:top-0 lg:w-[30%]">
            <p className="text-[16px] leading-relaxed text-graphite">
              Kesici takımlar, ölçüm ekipmanları ve endüstriyel sarf malzemeleri. Havacılık, medikal, otomotiv ve makina sektörlerine.
            </p>
            {/* doğrudan kod alanı + dönen müşteriye son fiş (bkz. HeroCode) */}
            <HeroCode />
          </div>
        </div>

        <div style={rise(4)} className="anim-fade-up mb-6 mt-10 md:mb-8 md:mt-12 lg:ml-auto lg:w-[84%]">
          <Caliper active={entered} />
        </div>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- ÜRÜN GRUPLARI */

function ProductGrid() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.grid-card').forEach((card) =>
        gsap.fromTo(
          card.querySelector('.plot'),
          { '--plot': 1 },
          { '--plot': 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: card, start: 'top 88%', once: true } },
        ),
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} className="mx-auto max-w-[1440px] px-5 pb-10 pt-24 md:px-10 md:pb-12 md:pt-32">
      <SectionHead
        index="01"
        label="ÜRÜN GRUPLARI"
        title={<>Talaşlı imalatın tüm takımları.</>}
        aside={<>Dokuz ürün grubu, tek bir adres. İhtiyacınızı kodla ya da tarifle teklif fişine ekleyin.</>}
      />
      {/* teknik şartname tablosu: telefonda satır, geniş ekranda 3×3 */}
      <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
        {CATEGORIES.map((c, i) => (
          <li key={c.slug} className="grid-card bg-paper">
            <Link
              to={categoryPath(c.slug)}
              className="group grid h-full grid-cols-[88px_minmax(0,1fr)] items-center gap-4 p-4 transition-colors duration-500 hover:bg-mist sm:flex sm:flex-col sm:items-stretch sm:gap-0 sm:p-5 md:p-6"
            >
              <div className="rounded-xl bg-mist px-2 py-3 text-ink transition-colors duration-500 group-hover:bg-paper group-hover:text-accent-ink sm:order-2 sm:mt-4 sm:px-4 sm:py-5">
                <ToolDrawing kind={c.drawing} className="w-full sm:h-[clamp(96px,10vw,150px)]" />
              </div>
              <div className="min-w-0 sm:contents">
                <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-muted sm:order-1">
                  <span>
                    <span className="text-ink">{String(i + 1).padStart(2, '0')}</span> / {String(CATEGORIES.length).padStart(2, '0')}
                  </span>
                  <ArrowUpRight className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                </div>
                <h3 className="mt-1.5 font-wide text-[19px] font-semibold leading-tight tracking-[-0.02em] sm:order-3 sm:mt-5 md:text-[22px]">{c.name}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted sm:order-4 sm:mt-2">{c.short}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------------------------------------------- KATALOG ŞERİDİ */

/** Yelpazedeki kapaklar (soldan sağa); listede olmayan kimlik atlanır. */
const FEATURED_COVERS = ['mitsubishi-tornalama', 'mitutoyo-olcu-aletleri', 'format-kilavuz', 'pens-kayar-otomat']
/** yelpazedeki kapakların duruşu: dönüş (derece) ve yatay kayma (px), --fan ile çarpılır: dar telefonda 0.7, üzerine gelince 1.35 */
const FAN = [
  { r: -10, x: -66 },
  { r: -3.5, x: -22 },
  { r: 3.5, x: 22 },
  { r: 10, x: 66 },
]

/**
 * Ürün grupları ile markalar arasında kısa bir şerit: katalog ve sayfa sayısı + kapak yelpazesi → /kataloglar.
 * Sayılar data/catalogs.ts'ten hesaplanır; katalog eklenince kendiliğinden güncellenir.
 */
function CatalogStrip() {
  const pages = ALL_CATALOGS.reduce((n, k) => n + k.pages, 0)
  // marka adları büyükten küçüğe (sayfa sayısına göre), "Mitsubishi Materials" → "Mitsubishi"
  const byBrand = new Map<string, number>()
  for (const k of ALL_CATALOGS) {
    const b = k.brand.replace(/ Materials$/, '')
    byBrand.set(b, (byBrand.get(b) ?? 0) + k.pages)
  }
  const brands = [...byBrand.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => b)
  const covers = FEATURED_COVERS.map((id) => ALL_CATALOGS.find((k) => k.id === id)).filter((k) => k !== undefined)

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10 md:pb-32" aria-label="PDF kataloglar">
      <Link
        to="/kataloglar"
        className="group grid items-center gap-8 md:hover:[--fan:1.35] overflow-hidden rounded-3xl bg-ink p-7 text-paper [--fan:0.7] min-[400px]:[--fan:1] md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 md:p-12"
      >
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] text-paper/60">PDF KATALOGLAR</p>
          <p className="mt-3 font-wide text-[clamp(28px,3.4vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em]">
            {ALL_CATALOGS.length} katalog
            <span className="text-paper/40 max-md:hidden"> · </span>
            <br className="md:hidden" />
            <span className="whitespace-nowrap">{pages.toLocaleString('tr-TR')} sayfa</span>
          </p>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-paper/70">
            {brands.slice(0, 4).join(', ')}
            {brands.length > 4 ? ` ve ${brands.length - 4} marka daha` : ''}. Kodu katalogda bulun, teklif fişine yazın.
          </p>
          <span className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-paper px-5 text-[14px] font-medium text-ink transition-colors group-hover:bg-accent-ink group-hover:text-white">
            Kataloglara göz atın <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* kapak yelpazesi — gerçek ilk sayfalar; telefonda metnin altında ortada */}
        {/* dar ekranda (--fan 0.7) yelpaze daralır: kutu metin sütununu genişletmesin */}
        <div aria-hidden className="relative mx-auto h-[150px] w-full max-w-[260px] md:h-[190px] md:w-[300px] md:max-w-none">
          {covers.map((k, i) => (
            <img
              key={k.id}
              src={catalogCover(k)}
              alt=""
              loading="lazy"
              decoding="async"
              width={120}
              height={160}
              style={{ transform: `translateX(calc(${FAN[i].x}px * var(--fan))) rotate(calc(${FAN[i].r}deg * var(--fan)))` }}
              className="absolute bottom-0 left-1/2 -ml-[52px] aspect-[3/4] w-[104px] origin-bottom rounded-[6px] bg-mist object-cover object-top shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform duration-700 ease-out-expo md:-ml-[60px] md:w-[120px]"
            />
          ))}
        </div>
      </Link>
    </section>
  )
}

/* --------------------------------------------------------------- MARKALAR */

function Brands() {
  return (
    <section className="bg-mist">
      <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <SectionHead
          index="02"
          label="MARKALARIMIZ"
          title={<>Güvendiğimiz markalar.</>}
          aside={<>Bayiliğini yaptığımız ve tedarik ettiğimiz kesici takım, ölçüm ve sarf malzemesi markaları.</>}
        />
        <BrandWall />
      </div>
    </section>
  )
}

/* ----------------------------------------------------- SEPET NASIL ÇALIŞIR */

const STEPS = [
  { t: 'Kodu yazın', d: 'Ürün kodunu ya da ölçü ve kullanım amacını yazın. Elinizde liste varsa tek seferde yapıştırın.' },
  { t: 'Fişe ekleyin', d: 'Enter’a basın, sıradakine geçin. Ürün grubu ve marka isteğe bağlı.' },
  { t: 'WhatsApp’tan gönderin', d: 'Fişiniz numaralı, düzenli bir mesaj olarak hazırlanır; tek dokunuşla bize ulaşır. Fiyat ve teslim süresiyle dönüş yaparız.' },
]

function HowToOrder() {
  const root = useRef<HTMLDivElement>(null)
  const { openCart } = useCart()
  useGSAP(
    () => {
      const st = { trigger: root.current, start: 'top 75%', end: 'top 35%', scrub: true }
      gsap.fromTo('.step-line', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.step-line-v', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { ...st, end: 'bottom 60%' } })
    },
    { scope: root },
  )
  return (
    <section>
      <div ref={root} className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <SectionHead index="03" label="TEKLİF FİŞİ" title={<>Üç adımda teklif.</>} aside={<>Üyelik yok, form yok. Fişiniz bu cihazda saklanır; hazır olduğunda gönderirsiniz.</>} />
        <div className="relative grid gap-10 md:grid-cols-3 md:gap-6">
          <div className="step-line absolute left-0 right-0 top-[27px] hidden h-px origin-left bg-ink/25 md:block" />
          <div className="step-line-v absolute bottom-10 left-[27px] top-0 w-px origin-top bg-ink/25 md:hidden" />
          {STEPS.map((s, i) => (
            <div key={s.t} className="relative max-md:grid max-md:grid-cols-[56px_1fr] max-md:gap-x-5">
              <span className="relative z-10 grid size-14 place-items-center rounded-full border border-ink/20 bg-paper font-mono text-[13px]">
                0{i + 1}
              </span>
              <div>
                <h3 className="font-wide text-[22px] font-semibold tracking-[-0.02em] max-md:pt-3 md:mt-6 md:text-[24px]">{s.t}</h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => openCart({ focus: true })}
          className="group mt-14 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-4 text-[15px] font-medium text-paper transition-colors hover:bg-accent-ink"
        >
          Fişi açın, ilk kodu yazın <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </section>
  )
}

export default function Home() {
  usePageMeta('', 'Format Teknik — Çorlu/Tekirdağ. Kesici takımlar, ölçüm ekipmanları ve endüstriyel sarf malzemeleri. Havacılık, medikal, otomotiv ve makina sektörlerine.')
  return (
    <>
      <Hero />
      <ProductGrid />
      <CatalogStrip />
      <Brands />
      <HowToOrder />
    </>
  )
}
