import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { BRANDS } from '../data/brands'

/**
 * Markalarımız: teknik şartname tablosu gibi ince çizgili ızgara.
 * Hücre üzerine gelince köşelerde nişangah işaretleri belirir; logo griden renge geçer.
 *
 * Son satır eksik kalırsa (ör. 10 marka / 3 sütun) son hücre kalan boşluğu kaplar;
 * marka sayısı değişse de ızgarada boş hücre oluşmaz.
 */
const COLS = [
  { n: 2, span: ['', 'max-sm:col-span-2'] },
  { n: 3, span: ['', 'sm:max-lg:col-span-2', 'sm:max-lg:col-span-3'] },
  { n: 5, span: ['', 'lg:col-span-2', 'lg:col-span-3', 'lg:col-span-4', 'lg:col-span-5'] },
]

/** img width/height öznitelikleri için temel kutu (yerleşim kaymasını önler; asıl boyut CSS'te) */
const LOGO_BOX = 48

function lastCellSpan(count: number) {
  return COLS.map(({ n, span }) => {
    const rem = count % n
    return rem === 0 ? '' : span[n - rem]
  }).join(' ')
}
export default function BrandWall() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.brand-cell', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        stagger: { each: 0.05, grid: 'auto', from: 'start' },
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line [--logo-k:40px] sm:grid-cols-3 sm:[--logo-k:50px] lg:grid-cols-5 lg:[--logo-k:56px]"
    >
      {BRANDS.map((b, i) => (
        <div
          key={b.name}
          className={`brand-cell group relative flex min-h-28 items-center justify-center bg-paper p-6 transition-colors duration-500 hover:bg-mist ${
            i === BRANDS.length - 1 ? lastCellSpan(BRANDS.length) : 'aspect-[3/2]'
          }`}
        >
          <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.18em] text-muted">
            M-{String(i + 1).padStart(2, '0')}
          </span>

          {/* nişangah köşeleri */}
          {['left-3 top-3 border-l border-t', 'right-3 top-3 border-r border-t', 'left-3 bottom-3 border-l border-b', 'right-3 bottom-3 border-r border-b'].map((c) => (
            <span key={c} className={`absolute size-3 border-accent opacity-0 transition-all duration-300 group-hover:opacity-100 ${c}`} />
          ))}

          {b.logo ? (
            <span className="flex max-w-[78%] flex-col items-center gap-2.5">
              <img
                src={b.logo}
                alt={b.name}
                loading="lazy"
                decoding="async"
                width={Math.round(LOGO_BOX * (b.ratio ?? 3))}
                height={LOGO_BOX}
                // Eşit görsel ağırlık: yükseklik ∝ 1/√oran → her logo yaklaşık aynı alanı kaplar
                style={{ height: `calc(var(--logo-k) / ${Math.sqrt(b.ratio ?? 3).toFixed(3)})` }}
                className="w-auto max-w-full object-contain opacity-75 grayscale transition-[filter,opacity] duration-500 group-hover:opacity-100 group-hover:grayscale-0"
              />
              {b.caption && (
                <span className="font-mono text-[9px] tracking-[0.24em] text-muted transition-colors duration-300 group-hover:text-ink">
                  {b.name.toLocaleUpperCase('en')}
                </span>
              )}
            </span>
          ) : (
            <span className="font-wide text-[clamp(17px,1.6vw,24px)] font-semibold tracking-[-0.01em] text-graphite transition-colors duration-300 group-hover:text-ink">
              {b.name}
            </span>
          )}

          {/* üzerine gelince marka adı; adı zaten görünen hücrelerde (yazı logo / alt yazı) gösterilmez */}
          {b.logo && !b.caption && (
            <span className="absolute bottom-4 right-4 font-mono text-[9px] tracking-[0.18em] text-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {b.name.toLocaleUpperCase('en')}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
