import type { ReactNode } from 'react'

/**
 * İç sayfaların ortak açılışı: etiket, büyük başlık, kısa metin.
 * `aside`: etiket çizgisinin sağ ucunda kısa bilgi (teknik resim antedi gibi), ör. Kurumsal'da "KURULUŞ 2024".
 * Açılış animasyonları saf CSS (index.css .anim-*): ön-render HTML'i çizilir çizilmez oynar.
 */
export default function PageHero({ label, title, text, aside }: { label: string; title: ReactNode; text?: string; aside?: ReactNode }) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-44">
      <div className="anim-fade-up flex items-center gap-4 font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]">
        <span className="size-1.5 rounded-full bg-accent" />
        {label}
        <span className="h-px flex-1 bg-line" />
        {aside}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
        <h1 className="-mt-[0.16em] overflow-hidden pb-[0.06em] pt-[0.16em] font-wide text-[clamp(44px,8vw,128px)] font-semibold leading-[0.9] tracking-[-0.04em] lg:col-span-8">
          <span className="anim-line-up block [--anim-delay:0.1s]">{title}</span>
        </h1>
        {text && (
          <p className="anim-fade-up max-w-md text-[16px] leading-relaxed text-graphite [--anim-delay:0.35s] [--anim-dur:0.9s] [--anim-y:16px] lg:col-span-4 lg:pb-3">
            {text}
          </p>
        )}
      </div>
    </section>
  )
}
