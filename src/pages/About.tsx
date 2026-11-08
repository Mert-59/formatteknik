import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionHead from '../components/SectionHead'
import BrandWall from '../components/BrandWall'
import { usePageMeta } from '../lib/usePageMeta'
import { BRANDS } from '../data/brands'
import { CATEGORIES } from '../data/catalog'
import { COMPANY, SECTORS } from '../data/company'

const RANGE = [
  { t: 'Kesici takımlar', d: 'Torna ve frezeleme uçları, matkaplar, kılavuzlar, raybalar.' },
  { t: 'Ölçüm ekipmanları', d: 'Mikrometre, kumpas ve diğer hassas ölçüm cihazları.' },
  { t: 'Bağlama sistemleri', d: 'Takım tutucular ve iş parçası bağlama sistemleri.' },
  { t: 'Sarf malzemeleri', d: 'Çapak alma ve diğer endüstriyel sarf malzemeleri.' },
]

const mono = 'font-mono text-[10px] tracking-[0.22em] text-muted'

/**
 * Rakamlar şeridi. Marka ve ürün grubu sayısı sitedeki listelerden sayılır (her zaman görünür);
 * kuruluş yılı ve teslimat yalnızca data/company.ts'de doluysa eklenir.
 */
function Facts() {
  const facts = [
    COMPANY.foundedYear > 0 && { value: String(COMPANY.foundedYear), label: 'KURULUŞ' },
    { value: String(BRANDS.length), label: 'MARKA' },
    { value: String(CATEGORIES.length), label: 'ÜRÜN GRUBU' },
    { value: String(SECTORS.length), label: 'SEKTÖR' },
  ].filter(Boolean) as { value: string; label: string }[]
  const delivery = COMPANY.deliveryTime || COMPANY.deliveryArea

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
      {/* sütun sayısı rakam sayısına uyar: ızgarada boş (gri) hücre kalmaz */}
      <dl
        className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line ${facts.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}
      >
        {facts.map((f, i) => (
          <div
            key={f.label}
            // telefonda (2 sütun) tek sayıda rakam varsa sonuncusu tüm satırı kaplar
            className={`bg-paper p-6 md:p-8 ${facts.length % 2 && i === facts.length - 1 ? 'max-md:col-span-2' : ''}`}
          >
            <dt className={mono}>{f.label}</dt>
            <dd className="mt-4 font-wide text-[clamp(36px,4.4vw,64px)] font-semibold leading-none tracking-[-0.04em] tabular-nums">{f.value}</dd>
          </div>
        ))}
        {delivery && (
          // teslimat: tüm satırı kaplar (metin olduğu için rakam hücresine sığmaz)
          <div className="col-span-full bg-paper p-6 md:p-8">
            <dt className={mono}>TESLİMAT</dt>
            <dd className="mt-3 text-[18px] font-semibold leading-snug md:text-[22px]">
              {COMPANY.deliveryTime}
              {COMPANY.deliveryTime && COMPANY.deliveryArea && <span className="text-muted"> · </span>}
              {COMPANY.deliveryArea && <span className={COMPANY.deliveryTime ? 'font-normal text-graphite' : ''}>{COMPANY.deliveryArea}</span>}
            </dd>
          </div>
        )}
      </dl>
    </section>
  )
}

export default function About() {
  usePageMeta(
    'Kurumsal',
    'Format Teknik; talaşlı imalat sektörüne kesici takımlar, ölçüm ekipmanları ve endüstriyel sarf malzemeleri tedarik eden, Çorlu merkezli bir çözüm ortağıdır.',
  )
  // Bölüm numaraları sırayla verilir: gizli bölüm numara atlatmaz.
  let n = 0
  const next = () => String(++n).padStart(2, '0')

  return (
    <>
      <PageHero
        label="KURUMSAL"
        title={<>Çorlu’dan üretime güç.</>}
        text="Format Teknik; talaşlı imalat sektörüne kesici takımlar, ölçüm ekipmanları ve endüstriyel sarf malzemeleri tedarik eden, Çorlu merkezli bir çözüm ortağıdır."
      />

      <section className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-24 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className={mono}>YAKLAŞIMIMIZ</p>
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

      <Facts />

      {/* sektörler */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <SectionHead index={next()} label="SEKTÖRLER" title={<>Hizmet verdiğimiz sektörler.</>} />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {SECTORS.map((s, i) => (
              <div key={s.name} className="bg-paper p-6 md:p-8">
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted">S-{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-10 font-wide text-[22px] font-semibold tracking-[-0.02em]">{s.name}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <SectionHead index={next()} label="ÜRÜN YELPAZESİ" title={<>Neler sunuyoruz?</>} />
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

      {/* fotoğraflar — data/company.ts'de fotoğraf yoksa hiç görünmez */}
      {COMPANY.photos.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
            <SectionHead index={next()} label="FOTOĞRAFLAR" title={<>Depomuz ve ekibimiz.</>} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COMPANY.photos.map((p, i) => (
                <figure key={p.src} className={i === 0 && COMPANY.photos.length > 2 ? 'sm:col-span-2 lg:row-span-2' : ''}>
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] h-full w-full rounded-2xl bg-mist object-cover"
                  />
                  {p.caption && <figcaption className="mt-2 text-[13px] text-muted">{p.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* referanslar — liste boşsa hiç görünmez */}
      {COMPANY.references.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
            <SectionHead index={next()} label="REFERANSLAR" title={<>Birlikte çalıştığımız firmalar.</>} />
            {/* esnek satırlar: son satırdaki hücreler genişleyerek boşluğu doldurur, kaç firma olursa olsun gri hücre kalmaz */}
            <ul className="flex flex-wrap gap-px overflow-hidden rounded-2xl border border-line bg-line">
              {COMPANY.references.map((r) => (
                <li
                  key={r.name}
                  className="flex min-h-28 grow basis-[calc(50%-1px)] flex-col items-center justify-center gap-2 bg-paper p-6 text-center sm:basis-[calc(33.333%-1px)] lg:basis-[calc(20%-1px)]"
                >
                  {r.logo ? (
                    <img src={r.logo} alt={r.name} loading="lazy" decoding="async" className="h-10 w-auto max-w-[80%] object-contain opacity-75 grayscale" />
                  ) : (
                    <span className="font-wide text-[17px] font-semibold tracking-[-0.01em] text-graphite">{r.name}</span>
                  )}
                  {r.sector && <span className="font-mono text-[9px] tracking-[0.2em] text-muted">{r.sector.toLocaleUpperCase('tr-TR')}</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-[1440px] border-t border-line px-5 pb-28 pt-24 md:px-10">
        <SectionHead index={next()} label="MARKALARIMIZ" title={<>Bayiliğini yaptığımız markalar.</>} />
        <BrandWall />
        <Link to="/iletisim" className="group mt-14 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-4 text-[15px] font-medium text-paper transition-colors hover:bg-accent-ink">
          Bizimle iletişime geçin <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>
    </>
  )
}
