import { Download, Eye, Wifi } from 'lucide-react'
import { LARGE_PDF_MB, catalogCover, catalogFileName, catalogPdf, catalogSizeMB, formatSize, type Catalog } from '../data/catalogs'

/**
 * PDF katalog kartı: gerçek kapak (ilk sayfa), marka, başlık, sayfa · boyut · dil,
 * "Görüntüle" (yeni sekmede tarayıcının PDF görüntüleyicisi) ve "İndir" (anlamlı dosya adıyla).
 * Büyük dosyada (LARGE_PDF_MB üstü) "Wi-Fi önerilir" notu: telefonda "Görüntüle" çoğu zaman dosyanın tamamını indirir.
 */
export default function CatalogCard({ catalog: c }: { catalog: Catalog }) {
  const pdf = catalogPdf(c)
  const big = catalogSizeMB(c) > LARGE_PDF_MB
  const meta = [`${c.pages.toLocaleString('tr-TR')} SAYFA`, formatSize(catalogSizeMB(c)).toLocaleUpperCase('tr-TR'), c.lang.toLocaleUpperCase('tr-TR')]

  return (
    <article className="group grid grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-2xl border border-line bg-paper p-4 transition-colors duration-300 hover:border-ink/25 sm:grid-cols-[112px_minmax(0,1fr)] sm:gap-5 sm:p-5">
      {/* kapak: kâğıt gibi hafif gölgeli; üzerine gelince hafifçe kalkar */}
      <a
        href={pdf}
        target="_blank"
        rel="noopener"
        tabIndex={-1}
        aria-hidden
        className="relative block aspect-[3/4] self-start overflow-hidden rounded-[6px] bg-mist shadow-[0_1px_2px_rgba(15,18,21,0.08),0_8px_20px_-8px_rgba(15,18,21,0.25)] ring-1 ring-line transition-transform duration-500 ease-out-expo group-hover:-translate-y-1"
      >
        <img src={catalogCover(c)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
        <span className="absolute left-1.5 top-1.5 rounded-[3px] bg-ink px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-[0.14em] text-paper">PDF</span>
      </a>

      <div className="flex min-w-0 flex-col">
        {/* yabancı marka adı: İngilizce büyük harf (Mitsubishi → MITSUBISHI, MİTSUBİSHİ değil) */}
        <p className="font-mono text-[10px] tracking-[0.2em] text-muted">{c.brand.toLocaleUpperCase('en-US')}</p>
        <h3 className="mt-1.5 text-[16px] font-semibold leading-snug tracking-[-0.01em] sm:text-[17px]">{c.title}</h3>
        <p className="mt-2 font-mono text-[12px] leading-relaxed tracking-[0.04em] text-muted">{meta.join(' · ')}</p>
        {c.note && <p className="mt-1 text-[12px] text-muted">{c.note}</p>}
        {big && (
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-muted">
            <Wifi className="size-3.5 shrink-0" aria-hidden /> Büyük dosya — mobil veride Wi-Fi önerilir
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <a
            href={pdf}
            target="_blank"
            rel="noopener"
            aria-label={`${c.brand} ${c.title} kataloğunu görüntüle (PDF, ${formatSize(catalogSizeMB(c))}, yeni sekmede açılır)`}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:bg-accent-ink"
          >
            <Eye className="size-4" /> Görüntüle
          </a>
          <a
            href={pdf}
            download={catalogFileName(c)}
            aria-label={`${c.brand} ${c.title} kataloğunu indir (PDF, ${formatSize(catalogSizeMB(c))})`}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-ink/15 px-4 text-[13px] font-medium transition-colors hover:border-ink"
          >
            <Download className="size-4" /> İndir
          </a>
        </div>
      </div>
    </article>
  )
}
