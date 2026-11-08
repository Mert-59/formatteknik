import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/usePageMeta'

export default function NotFound() {
  usePageMeta('Sayfa bulunamadı', undefined, { noindex: true })
  return (
    <section className="mx-auto flex min-h-[70svh] max-w-[1440px] flex-col justify-center px-5 pt-32 md:px-10">
      <p className="font-mono text-[11px] tracking-[0.22em] text-muted">HATA 404 — TOLERANS DIŞI</p>
      <h1 className="mt-6 font-wide text-[clamp(44px,8vw,120px)] font-semibold leading-[0.9] tracking-[-0.04em]">
        Bu ölçüde bir sayfa yok<span className="text-accent">.</span>
      </h1>
      <Link to="/" className="mt-10 w-fit rounded-full bg-ink px-6 py-4 text-[15px] font-medium text-paper hover:bg-accent-ink">
        Anasayfaya dönün
      </Link>
    </section>
  )
}
