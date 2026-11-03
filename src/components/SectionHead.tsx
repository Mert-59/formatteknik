import type { ReactNode } from 'react'

type Props = { index: string; label: string; title: ReactNode; aside?: ReactNode; compact?: boolean }

/** "02 — ÜRÜN GRUPLARI" biçiminde bölüm başlığı: numara, etiket ve teknik çizgi. */
export default function SectionHead({ index, label, title, aside, compact }: Props) {
  return (
    <div className={compact ? 'mb-8 md:mb-10' : 'mb-12 md:mb-16'}>
      <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]">
        <span className="text-ink">{index}</span>
        <span className="h-px w-10 bg-ink/25" />
        <span>{label}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
      <div className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${compact ? 'mt-5' : 'mt-6'}`}>
        <h2
          className={`font-wide font-semibold leading-[0.95] tracking-[-0.03em] ${
            compact ? 'max-w-[20ch] text-[clamp(30px,3.6vw,54px)]' : 'max-w-[16ch] text-[clamp(34px,5vw,72px)]'
          }`}
        >
          {title}
        </h2>
        {aside && <div className="max-w-md text-[15px] leading-relaxed text-muted">{aside}</div>}
      </div>
    </div>
  )
}
