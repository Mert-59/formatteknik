import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, type Variants } from 'motion/react'
import { ArrowRight, ArrowUpRight, Plus } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { CATEGORIES } from '../data/catalog'
import { useIntro } from '../lib/introState'
import { useCart } from '../cart/CartContext'
import Caliper from '../components/Caliper'
import ToolDrawing from '../components/ToolDrawing'
import SectionHead from '../components/SectionHead'
import BrandWall from '../components/BrandWall'
import Engrave from '../components/Engrave'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } } }
const rise: Variants = {
  hidden: { y: 36, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 1.1, ease } },
}
const line: Variants = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 1.2, ease } },
}

const gutter = 'max(1.25rem, calc((100vw - 1440px) / 2 + 2.5rem))'

/* ------------------------------------------------------------------ HERO */

function Hero() {
  const { phase } = useIntro()
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
          {/* "Hassasiyetin" ≈6.8em: 11vw her genişlikte kapsayıcıya sığar */}
          <h1 className="font-wide text-[clamp(36px,11vw,164px)] font-semibold leading-[0.88] tracking-[-0.045em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={line} className="block">Güvenilir</motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={line} className="block">
                Çözüm Ortağı<span className="text-accent">.</span>
              </motion.span>
            </span>
          </h1>
          {/* kısa "adresi." satırının sağındaki boşluğa oturur */}
          <motion.div variants={rise} className="max-w-sm lg:absolute lg:bottom-[0.6vw] lg:right-0 lg:w-[30%]">
            <p className="text-[16px] leading-relaxed text-graphite">
              Kesici takımlar, ölçüm ekipmanları ve endüstriyel sarf malzemeleri. Havacılık, medikal, otomotiv ve makina sektörlerine.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link to="/urunler" className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-accent">
                Ürünleri keşfedin <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/iletisim" className="inline-flex items-center rounded-full border border-ink/15 px-5 py-3 text-[14px] font-medium transition-colors hover:border-ink">
                İletişim
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

/* ------------------------------------------------------ ÜRÜN GRUPLARI RAYI */

function ProductRail() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const { setOpen } = useCart()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const plot = (card: HTMLElement, extra: ScrollTrigger.Vars) =>
        gsap.fromTo(
          card.querySelector('.plot'),
          { '--plot': 1 },
          { '--plot': 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: card, once: true, ...extra } },
        )

      mm.add('(min-width: 1024px)', () => {
        const t = track.current!
        const distance = () => t.scrollWidth - window.innerWidth
        const tween = gsap.to(t, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        gsap.utils.toArray<HTMLElement>('.rail-card').forEach((card) => plot(card, { containerAnimation: tween, start: 'left 92%' }))
      })
      mm.add('(max-width: 1023px)', () => {
        gsap.utils.toArray<HTMLElement>('.rail-card').forEach((card) => plot(card, { start: 'top 85%' }))
      })
    },
    { scope: section },
  )

  return (
    <section ref={section} className="relative flex flex-col justify-center overflow-hidden bg-paper py-20 lg:h-svh lg:pb-0 lg:pt-20">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <SectionHead
          compact
          index="01"
          label="ÜRÜN GRUPLARI"
          title={<>Talaşlı imalatın tüm takımları.</>}
          aside={<>Dokuz ürün grubu, tek bir adres. Her grubun içinden ihtiyacınızı kodla ya da tarifle sepete ekleyin.</>}
        />
      </div>
      <div
        ref={track}
        className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] max-lg:snap-x max-lg:snap-mandatory lg:overflow-visible lg:pb-0"
        style={{ paddingLeft: gutter, paddingRight: gutter, scrollPaddingLeft: gutter }}
      >
        {CATEGORIES.map((c, i) => (
          <article
            key={c.slug}
            className="rail-card group flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-line bg-paper p-5 transition-colors duration-500 hover:border-ink/30 md:w-[360px]"
          >
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-muted">
              <span>
                <span className="text-ink">{String(i + 1).padStart(2, '0')}</span> / {String(CATEGORIES.length).padStart(2, '0')}
              </span>
              <span className="opacity-0 transition-opacity group-hover:opacity-100">GRUP</span>
            </div>
            <div className="mt-4 rounded-xl bg-mist px-4 py-4 text-ink transition-colors duration-500 group-hover:text-accent-ink">
              <ToolDrawing kind={c.drawing} className="h-[clamp(110px,19svh,150px)] w-full" />
            </div>
            <h3 className="mt-5 font-wide text-[22px] font-semibold leading-tight tracking-[-0.02em]">{c.name}</h3>
            <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{c.short}</p>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[13px]">
              <Link to={`/urunler#${c.slug}`} className="group/l inline-flex items-center gap-1.5 font-medium">
                İncele <ArrowUpRight className="size-4 transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" />
              </Link>
              <Link to={`/urunler#${c.slug}`} className="inline-flex items-center gap-1 text-muted hover:text-ink">
                <Plus className="size-3.5" /> Sepete ekle
              </Link>
            </div>
          </article>
        ))}
        <article className="flex w-[300px] shrink-0 snap-start flex-col justify-between rounded-2xl bg-ink p-6 text-paper md:w-[360px]">
          <p className="font-mono text-[10px] tracking-[0.22em] text-paper/60">SEPET SİPARİŞİ</p>
          <div>
            <p className="font-wide text-[28px] font-semibold leading-tight tracking-[-0.02em]">Kodu yazın, sepete ekleyin, WhatsApp’tan gönderin.</p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link to="/urunler" className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-[14px] font-medium text-ink transition-colors hover:bg-accent hover:text-white">
                Tüm ürünler <ArrowRight className="size-4" />
              </Link>
              <button type="button" onClick={() => setOpen(true)} className="rounded-full border border-paper/25 px-5 py-3 text-[14px] transition-colors hover:border-paper">
                Sepeti aç
              </button>
            </div>
          </div>
        </article>
        <div className="w-px shrink-0" aria-hidden />
      </div>
    </section>
  )
}

/* -------------------------------------------------------------- SEKTÖRLER */

const SECTORS = [
  { name: 'HAVACILIK', text: 'Dar toleranslar, zorlu alaşımlar, kusursuz yüzeyler.' },
  { name: 'MEDİKAL', text: 'Küçük parçalarda mikron seviyesinde tekrarlanabilirlik.' },
  { name: 'OTOMOTİV', text: 'Seri üretimde uzun takım ömrü ve süreklilik.' },
  { name: 'MAKİNA', text: 'Genel imalatta güvenilir, verimli kesme.' },
]

function Sectors() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <SectionHead
        index="02"
        label="SEKTÖRLER"
        title={<>Hassasiyetin işlendiği yerler.</>}
        aside={<>Her sektörün toleransı farklı. Doğru takım için ürün grubunu ve kullanım amacını bize yazmanız yeterli.</>}
      />
      <ul>
        {SECTORS.map((s, i) => (
          <li key={s.name} className="flex flex-col gap-4 border-t border-line py-6 md:py-8 lg:flex-row lg:items-end lg:gap-8">
            <span className="w-16 shrink-0 font-mono text-[11px] tracking-[0.2em] text-muted">S-{String(i + 1).padStart(2, '0')}</span>
            <span className="min-w-0 flex-1 font-wide text-[clamp(40px,8.2vw,128px)] font-bold leading-[0.82] tracking-[-0.04em]">
              <Engrave text={s.name} mode="scrub" start="top 88%" end="top 45%" />
            </span>
            <p className="max-w-xs text-[15px] leading-relaxed text-muted lg:w-64 lg:shrink-0">{s.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------------------------------------------- İLKE */

function Principle() {
  const root = useRef<HTMLDivElement>(null)
  const words = 'Sadece ürün değil; verimlilik, kalite ve sürdürülebilirlik.'.split(' ')
  useGSAP(
    () => {
      gsap.fromTo(
        '.pw',
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'bottom 55%', scrub: true } },
      )
    },
    { scope: root },
  )
  return (
    <section className="bg-mist">
      <div ref={root} className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <p className="mb-8 font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]">İLKEMİZ</p>
        <p className="max-w-[22ch] font-wide text-[clamp(34px,5.6vw,92px)] font-semibold leading-[1] tracking-[-0.035em]">
          {words.map((w, i) => (
            <span key={i} className="pw">{w} </span>
          ))}
        </p>
      </div>
    </section>
  )
}

/* --------------------------------------------------------------- MARKALAR */

function Brands() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
      <SectionHead
        index="03"
        label="MARKALARIMIZ"
        title={<>Güvendiğimiz markalar.</>}
        aside={<>Bayiliğini yaptığımız ve tedarik ettiğimiz kesici takım, ölçüm ve sarf malzemesi markaları.</>}
      />
      <BrandWall />
    </section>
  )
}

/* ----------------------------------------------------- SEPET NASIL ÇALIŞIR */

const STEPS = [
  { t: 'Ürün grubunu seçin', d: 'Dokuz ürün grubundan ihtiyacınıza uygun olanı açın.' },
  { t: 'Kodu ve adedi yazın', d: 'Ürün kodunu ya da ölçü ve kullanım amacını yazıp sepete ekleyin.' },
  { t: 'WhatsApp ile gönderin', d: 'Sepetiniz düzenli bir mesaj olarak hazırlanır; tek dokunuşla bize ulaşır.' },
]

function HowToOrder() {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const st = { trigger: root.current, start: 'top 75%', end: 'top 35%', scrub: true }
      gsap.fromTo('.step-line', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.step-line-v', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { ...st, end: 'bottom 60%' } })
    },
    { scope: root },
  )
  return (
    <section className="border-t border-line">
      <div ref={root} className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-36">
        <SectionHead index="04" label="SEPET SİPARİŞİ" title={<>Üç adımda sipariş.</>} />
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
        <Link
          to="/urunler"
          className="group mt-14 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-4 text-[15px] font-medium text-paper transition-colors hover:bg-accent"
        >
          Sepet oluşturmaya başlayın <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <ProductRail />
      <Sectors />
      <Principle />
      <Brands />
      <HowToOrder />
    </>
  )
}
