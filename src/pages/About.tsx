import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import SectionHead from '../components/SectionHead'
import BrandWall from '../components/BrandWall'
import Logo from '../components/Logo'
import { usePageMeta } from '../lib/usePageMeta'
import { COMPANY, SECTORS } from '../data/company'

const RANGE = [
  { t: 'Kesici takımlar', d: 'Torna ve frezeleme uçları, matkaplar, kılavuzlar, raybalar.' },
  { t: 'Ölçüm ekipmanları', d: 'Mikrometre, kumpas ve diğer hassas ölçüm cihazları.' },
  { t: 'Bağlama sistemleri', d: 'Takım tutucular ve iş parçası bağlama sistemleri.' },
  { t: 'Sarf malzemeleri', d: 'Çapak alma ve diğer endüstriyel sarf malzemeleri.' },
]

const mono = 'font-mono text-[10px] tracking-[0.22em] text-muted'

/*
 * Sektör ve ürün yelpazesi hücreleri. Telefonda (<640 px) sıkı liste: numara solda, başlık ve metin sağda.
 * Daha geniş ekranda kart: numara üstte, başlık aşağıda.
 */
const CELL = 'grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 bg-paper px-5 py-4 sm:block sm:p-6 md:p-8'
const CELL_NO = 'row-span-2 pt-[0.45em] font-mono text-[10px] tracking-[0.2em] text-muted'
const CELL_TITLE = 'font-wide text-[18px] font-semibold tracking-[-0.02em] sm:mt-10 sm:text-[22px]'

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
        aside={
          COMPANY.foundedYear > 0 && (
            <span>
              KURULUŞ <span className="text-ink">{COMPANY.foundedYear}</span>
            </span>
          )
        }
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
          {/* firmanın kendi logosu: tanıtım metniyle birlikte */}
          <Logo className="mb-4 w-[min(260px,70%)]" />
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

      {/* sektörler */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          <SectionHead index={next()} label="SEKTÖRLER" title={<>Hizmet verdiğimiz sektörler.</>} />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {SECTORS.map((s, i) => (
              <div key={s.name} className={CELL}>
                <span className={CELL_NO}>S-{String(i + 1).padStart(2, '0')}</span>
                <h3 className={CELL_TITLE}>{s.name}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted sm:mt-2">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
          <SectionHead index={next()} label="ÜRÜN YELPAZESİ" title={<>Neler sunuyoruz?</>} />
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {RANGE.map((r, i) => (
              <div key={r.t} className={CELL}>
                <span className={CELL_NO}>0{i + 1}</span>
                <h3 className={CELL_TITLE}>{r.t}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-muted sm:mt-2">{r.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* fotoğraflar — data/company.ts'de fotoğraf yoksa hiç görünmez */}
      {COMPANY.photos.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
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
          <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-10 md:py-24">
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
