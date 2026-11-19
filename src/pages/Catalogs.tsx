import { Link } from 'react-router-dom'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import PageHero from '../components/PageHero'
import CatalogCard from '../components/CatalogCard'
import { CATEGORIES } from '../data/catalog'
import { ALL_CATALOGS, CATALOGS } from '../data/catalogs'
import { SITE, categoryPath, whatsappUrl } from '../config/site'
import { usePageMeta } from '../lib/usePageMeta'

const mono = 'font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]'
const p2 = (n: number) => String(n).padStart(2, '0')

/**
 * Katalog kütüphanesi (/kataloglar): tüm PDF kataloglar, ürün grubu sırasıyla.
 * Veri: src/data/catalogs.ts — kataloğu olmayan grup listelenmez.
 */
export default function Catalogs() {
  usePageMeta(
    'Kataloglar',
    'Mitsubishi Materials, Mitutoyo, Sanowa, Carmon, IZAR, Gisstec ve Format ürün katalogları (PDF): tornalama, frezeleme, delme, kılavuz, ölçü aletleri, kayar otomat pensleri.',
  )

  const groups = CATEGORIES.map((c, i) => ({ c, i, list: CATALOGS[c.slug] ?? [] })).filter((g) => g.list.length > 0)
  const pages = ALL_CATALOGS.reduce((n, k) => n + k.pages, 0)

  return (
    <>
      <PageHero
        label="KATALOGLAR"
        title={<>Kataloglar</>}
        text="Tedarik ettiğimiz markaların ürün katalogları. Görüntüleyin ya da indirin; ihtiyacınız olan ürünün kodunu teklif fişine yazın."
      />

      <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
        {/* özet satırı */}
        <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-line pb-4 ${mono}`}>
          <span>
            <span className="text-ink">{p2(ALL_CATALOGS.length)}</span> KATALOG
          </span>
          <span aria-hidden>·</span>
          <span>
            <span className="text-ink">{p2(groups.length)}</span> ÜRÜN GRUBU
          </span>
          <span aria-hidden>·</span>
          <span>
            <span className="text-ink">{pages.toLocaleString('tr-TR')}</span> SAYFA
          </span>
        </p>

        {/* grup grup: solda grup, sağda o grubun katalogları */}
        <div className="divide-y divide-line">
          {groups.map(({ c, i, list }) => (
            <div key={c.slug} className="grid gap-6 py-10 md:py-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-3">
                <p className="font-mono text-[10px] tracking-[0.2em] text-muted">
                  <span className="text-ink">{p2(i + 1)}</span> / {p2(CATEGORIES.length)}
                </p>
                <h2 className="mt-2 font-wide text-[clamp(22px,2.2vw,30px)] font-semibold leading-tight tracking-[-0.02em]">{c.name}</h2>
                <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-muted">{c.short}</p>
                <Link
                  to={categoryPath(c.slug)}
                  className="tap group mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-graphite underline-offset-4 hover:text-ink hover:underline"
                >
                  Grup sayfası <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:col-span-9">
                {list.map((k) => (
                  <CatalogCard key={k.id} catalog={k} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* aradığı kataloğu bulamayan için */}
        <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-paper md:flex-row md:items-center md:p-12">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-paper/60">KATALOG İSTEYİN</p>
            <p className="mt-3 max-w-xl font-wide text-[clamp(22px,2.4vw,32px)] font-semibold leading-tight tracking-[-0.02em]">
              Aradığınız katalog burada yok mu? Marka ve ürün grubunu yazın, size gönderelim.
            </p>
          </div>
          <a
            href={whatsappUrl(`Merhaba ${SITE.name}, katalog istiyorum: `)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-paper px-6 py-4 text-[15px] font-medium text-ink transition-colors hover:bg-accent-ink hover:text-white"
          >
            <MessageCircle className="size-4" /> WhatsApp’tan isteyin
          </a>
        </div>
      </section>
    </>
  )
}
