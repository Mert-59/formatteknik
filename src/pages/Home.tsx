import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CATEGORIES } from '../data/catalog'
import { categoryPath } from '../config/site'
import { useIntro } from '../lib/introState'
import { useCart } from '../cart/CartContext'
import { EASE } from '../lib/motion'
import { usePageMeta } from '../lib/usePageMeta'
import Caliper from '../components/Caliper'
import ToolDrawing from '../components/ToolDrawing'
import SectionHead from '../components/SectionHead'
import BrandWall from '../components/BrandWall'

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } } }
const rise: Variants = {
  hidden: { y: 36, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 1.1, ease: EASE } },
}
const line: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.2, ease: EASE } },
}

/* ------------------------------------------------------------------ HERO */

function Hero() {
  const { phase } = useIntro()
  const { openCart } = useCart()
  const entered = phase !== 'intro'

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden pt-28 md:pt-32">
      {/* ince teknik ızgara */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,18,21,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,18,21,0.045)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_70%_60%_at_40%_40%,#000_30%,transparent_80%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate={entered ? 'show' : 'hidden'}
        className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 md:px-10"
      >
        <motion.div variants={rise} className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]">
          <span className="flex items-center gap-2.5">
            <span className="size-1.5 rounded-full bg-accent" /> ÇORLU / TEKİRDAĞ
          </span>
          <span className="max-sm:hidden">KESİCİ TAKIM · ÖLÇÜM · SARF</span>
        </motion.div>

        <div className="relative mt-[clamp(28px,7svh,64px)] flex flex-col gap-8 md:mt-10 md:flex-1 md:justify-end md:gap-10">
          {/* En uzun satır "Çözüm Ortağı." ≈7em: 11vw her genişlikte kapsayıcıya sığar */}
          <h1 className="font-wide text-[clamp(36px,11vw,164px)] font-semibold leading-[0.88] tracking-[-0.045em]">
            <span className="-mb-[0.16em] block overflow-hidden pb-[0.22em]">
              <motion.span variants={line} className="block">Güvenilir</motion.span>
            </span>
            <span className="-mb-[0.16em] block overflow-hidden pb-[0.22em]">
              <motion.span variants={line} className="block">
                Çözüm Ortağı<span className="text-accent">.</span>
              </motion.span>
            </span>
          </h1>
          {/* masaüstünde kısa "Güvenilir" satırının sağındaki boşluğa oturur */}
          <motion.div variants={rise} className="max-w-sm lg:absolute lg:right-0 lg:top-0 lg:w-[30%]">
            <p className="text-[16px] leading-relaxed text-graphite">
              Kesici takımlar, ölçüm ekipmanları ve endüstriyel sarf malzemeleri. Havacılık, medikal, otomotiv ve makina sektörlerine.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => openCart({ focus: true })}
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-accent-ink"
              >
                Kodla sipariş verin <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <Link to="/urunler" className="inline-flex items-center rounded-full border border-ink/15 px-5 py-3 text-[14px] font-medium transition-colors hover:border-ink">
                Ürün grupları
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div variants={rise} className="mb-6 mt-10 md:mb-8 md:mt-12 lg:ml-auto lg:w-[84%]">
          <Caliper active={entered} />
        </motion.div>
      </motion.div>
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
    <section ref={root} className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
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
  { t: 'WhatsApp’tan gönderin', d: 'Fişiniz numaralı, düzenli bir mesaj olarak hazırlanır; tek dokunuşla bize ulaşır.' },
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
        <SectionHead index="03" label="TEKLİF FİŞİ" title={<>Üç adımda sipariş.</>} aside={<>Üyelik yok, form yok. Fişiniz bu cihazda saklanır; hazır olduğunda gönderirsiniz.</>} />
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
      <Brands />
      <HowToOrder />
    </>
  )
}
