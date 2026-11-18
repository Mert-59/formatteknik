import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { NAV, SITE } from '../config/site'
import { InstagramIcon } from './icons'
import { useIntro } from '../lib/introState'
import Engrave from './Engrave'
import { InstallLink } from './InstallInvite'

const YEAR = new Date().getFullYear()

/**
 * Tasarım imzası: "by Mert" etiketi (mertarabaci.com.tr).
 * Biçim: sola sivri uçlu etiket (clip-path) ve ucunda delik — teknik çizim / fiyat etiketi dili.
 * Renk: mürekkep zemin, kâğıt yazı; üzerine gelince sitenin kızılı.
 */
function MakerTag() {
  return (
    <a
      href="https://mertarabaci.com.tr/"
      target="_blank"
      rel="noopener"
      aria-label="Tasarım ve geliştirme: Mert (mertarabaci.com.tr, yeni sekmede açılır)"
      className="group relative inline-flex h-7 items-center rounded-r-[6px] bg-ink pl-[18px] pr-3 font-sans text-[12px] font-semibold tracking-normal text-paper transition-colors duration-300 [clip-path:polygon(11px_0,100%_0,100%_100%,11px_100%,0_50%)] hover:bg-accent-ink focus-visible:bg-accent-ink"
    >
      {/* etiket deliği */}
      <span aria-hidden className="absolute left-[9px] top-1/2 size-[5px] -translate-y-1/2 rounded-full bg-paper" />
      <span className="pl-1.5">by Mert</span>
    </a>
  )
}

export default function Footer() {
  const { replay } = useIntro()
  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 pb-10 pt-20 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <p className="font-mono text-[10px] tracking-[0.22em] text-muted">İLETİŞİM</p>
          <a href={SITE.phoneHref} className="mt-4 block font-wide text-[clamp(22px,3vw,40px)] font-semibold tracking-[-0.02em] hover:text-accent-ink">
            {SITE.phoneDisplay}
          </a>
          <a href={`mailto:${SITE.email}`} className="mt-2 block text-[16px] text-graphite hover:text-ink">
            {SITE.email}
          </a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram: ${SITE.instagramHandle} (yeni sekmede açılır)`}
            className="group mt-2 inline-flex items-center gap-2 text-[16px] text-graphite hover:text-ink"
          >
            <InstagramIcon className="size-4" />
            {SITE.instagramHandle}
            <ArrowUpRight className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
          </a>
          <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-muted">{SITE.address}</p>
          {SITE.hours && <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted">{SITE.hours}</p>}
        </div>
        <div className="md:col-span-3">
          <p className="font-mono text-[10px] tracking-[0.22em] text-muted">SAYFALAR</p>
          <ul className="mt-4 space-y-2 text-[15px]">
            {[...NAV, { to: '/kataloglar', label: 'Kataloglar' }].map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-graphite hover:text-ink">{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-muted">HİKÂYE</p>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-muted">
            Bu sitenin girişi, Türkiye haritasından Çorlu’ya varır. İzlemek ister misiniz?
          </p>
          <button
            type="button"
            onClick={replay}
            className="mt-4 inline-flex items-center gap-3 rounded-full border border-ink/15 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] transition-colors hover:border-ink"
          >
            ↺ GİRİŞİ İZLE
          </button>
          {/* kurulabiliyorsa (ve henüz kurulmadıysa): uygulama olarak ana ekrana ekle */}
          <InstallLink />
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="footer-mark font-wide font-bold leading-[0.85] tracking-[-0.03em]">
          <Engrave text="FORMAT TEKNİK" start="top 92%" />
        </p>
      </div>

      <div className="safe-b mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 pt-6 font-mono text-[10px] tracking-[0.16em] text-muted md:px-10">
        {/* yıl derleme anında yazılır; yılbaşında yeniden derlenene kadar tarayıcıdaki yıl farklı olabilir */}
        <span suppressHydrationWarning>
          © {YEAR} {SITE.name.toLocaleUpperCase('tr-TR')}
        </span>
        <span className="flex items-center gap-4">
          <span>{SITE.city.toLocaleUpperCase('tr-TR')}</span>
          <MakerTag />
        </span>
      </div>
    </footer>
  )
}
