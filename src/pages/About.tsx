import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionHead from '../components/SectionHead'
import BrandWall from '../components/BrandWall'
import { usePageMeta } from '../lib/usePageMeta'

const RANGE = [
  { t: 'Kesici takımlar', d: 'Torna ve frezeleme uçları, matkaplar, kılavuzlar, raybalar.' },
  { t: 'Ölçüm ekipmanları', d: 'Mikrometre, kumpas ve diğer hassas ölçüm cihazları.' },
  { t: 'Bağlama sistemleri', d: 'Takım tutucular ve iş parçası bağlama sistemleri.' },
  { t: 'Sarf malzemeleri', d: 'Çapak alma ve diğer endüstriyel sarf malzemeleri.' },
]

export default function About() {
  usePageMeta(
    'Kurumsal',
    'Format Teknik; talaşlı imalat sektörüne kesici takımlar, ölçüm ekipmanları ve endüstriyel sarf malzemeleri tedarik eden, Çorlu merkezli bir çözüm ortağıdır.',
  )
  return (
    <>
      <PageHero
        label="KURUMSAL"
        title={<>Çorlu’dan üretime güç.</>}
        text="Format Teknik; talaşlı imalat sektörüne kesici takımlar, ölçüm ekipmanları ve endüstriyel sarf malzemeleri tedarik eden, Çorlu merkezli bir çözüm ortağıdır."
      />

      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-24 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-mono text-[10px] tracking-[0.22em] text-muted">YAKLAŞIMIMIZ</p>
          <p className="mt-6 font-wide text-[clamp(26px,2.8vw,40px)] font-semibold leading-[1.1] tracking-[-0.025em]">
            Müşterilerimize sadece ürün değil; verimlilik, kalite ve sürdürülebilirlik sunmayı ilke edindik.
          </p>
        </div>
        <div className="space-y-5 text-[16px] leading-relaxed text-graphite lg:col-span-6 lg:col-start-7">
          <p>
            Havacılık, medikal, otomotiv ve makina sektörlerinde çalışan işletmelere; doğru takımı doğru zamanda ulaştırmayı
            hedefliyoruz.
          </p>
          <p>
            Zamanında teslimat ve satış sonrası destek ilkesiyle çalışıyor, bayiliğini yaptığımız markaların ürünlerini
            ihtiyacınıza göre birlikte seçiyoruz.
          </p>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <SectionHead index="01" label="ÜRÜN YELPAZESİ" title={<>Neler sunuyoruz?</>} />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {RANGE.map((r, i) => (
              <div key={r.t} className="bg-paper p-6 md:p-8">
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted">0{i + 1}</span>
                <h3 className="mt-10 font-wide text-[22px] font-semibold tracking-[-0.02em]">{r.t}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        <SectionHead index="02" label="MARKALARIMIZ" title={<>Bayiliğini yaptığımız markalar.</>} />
        <BrandWall />
        <Link to="/iletisim" className="group mt-14 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-4 text-[15px] font-medium text-paper transition-colors hover:bg-accent-ink">
          Bizimle iletişime geçin <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>
    </>
  )
}
