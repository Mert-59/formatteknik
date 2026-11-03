import type { ReactNode } from 'react'
import { motion } from 'motion/react'

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** İç sayfaların ortak açılışı: etiket, büyük başlık, kısa metin. */
export default function PageHero({ label, title, text }: { label: string; title: ReactNode; text?: string }) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-16 pt-32 md:px-10 md:pb-24 md:pt-44">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
        className="flex items-center gap-4 font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]"
      >
        <span className="size-1.5 rounded-full bg-accent" />
        {label}
        <span className="h-px flex-1 bg-line" />
      </motion.div>
      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
        <h1 className="-mt-[0.16em] overflow-hidden pb-[0.06em] pt-[0.16em] font-wide text-[clamp(44px,8vw,128px)] font-semibold leading-[0.9] tracking-[-0.04em] lg:col-span-8">
          <motion.span className="block" initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease, delay: 0.1 }}>
            {title}
          </motion.span>
        </h1>
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.35 }}
            className="max-w-md text-[16px] leading-relaxed text-graphite lg:col-span-4 lg:pb-3"
          >
            {text}
          </motion.p>
        )}
      </div>
    </section>
  )
}
