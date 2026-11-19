import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, MessageCircle, Phone, ReceiptText, X } from 'lucide-react'
import { InstagramIcon } from './icons'
import gsap from 'gsap'
import { NAV, SITE, whatsappUrl } from '../config/site'
import { useCart } from '../cart/CartContext'
import { useModal, useScrollLock } from '../lib/scroll'
import Emblem from './Emblem'
import { anim, usePresence } from '../lib/presence'

/**
 * Logo yazısı. Telefonda (<640 px) iki satıra dizilir: FORMAT üstte, TEKNİK altta ve FORMAT'ın genişliğine yayılmış.
 * Böylece başlıkta "Teklif Fişi" düğmesi yazısıyla birlikte tam görünür (tek satırda sığmıyordu).
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-[0.35em] leading-none max-sm:flex-col max-sm:items-stretch max-sm:gap-[0.32em] ${className}`}>
      <span className="font-wide font-bold tracking-[-0.01em]">FORMAT</span>
      <span className="font-mono text-[0.78em] font-medium tracking-[0.2em] text-graphite max-sm:flex max-sm:justify-between max-sm:text-[0.6em] max-sm:tracking-normal">
        {/* telefonda harfler FORMAT genişliğine eşit aralıkla yayılır */}
        <span className="sm:hidden contents">
          {[...'TEKNİK'].map((ch, i) => (
            <span key={i}>{ch}</span>
          ))}
        </span>
        <span className="max-sm:hidden">TEKNİK</span>
      </span>
    </span>
  )
}

function CartButton({ onClick }: { onClick: () => void }) {
  const { count, lastAdded } = useCart()
  const badge = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!lastAdded.at || !badge.current) return
    gsap.fromTo(badge.current, { scale: 1.6 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }, [lastAdded.at])

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-11 items-center gap-2.5 rounded-full max-sm:pl-3.5 md:h-10 border border-ink/15 bg-paper pl-4 pr-1.5 text-[13px] font-medium transition-colors hover:border-ink"
      aria-label={`Teklif fişi, ${count} kalem`}
    >
      {/* dar ekranda (<400 px) simge kalkar, yazı ve sayı kalır: başlıkta amblem + yazı + düğmeler sığsın */}
      <ReceiptText className="size-4 shrink-0 max-[399px]:hidden" strokeWidth={1.6} />
      <span className="whitespace-nowrap">Teklif Fişi</span>
      <span
        ref={badge}
        className={`grid h-7 min-w-7 place-items-center rounded-full px-1.5 font-mono text-[11px] tabular-nums transition-colors ${count ? 'bg-accent-ink text-white' : 'bg-mist text-muted'}`}
      >
        {count}
      </span>
    </button>
  )
}

export default function Header() {
  const { openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  // Menü açıldığı sayfaya bağlıdır: sayfa değişince kendiliğinden kapanır.
  const [menuAt, setMenuAt] = useState<string | null>(null)
  const menu = menuAt === pathname
  const menuPresence = usePresence(menu, 600) // kapanış perdesi bitene kadar menü sayfada kalır
  const shell = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLElement>(null)
  const closeMenu = useCallback(() => setMenuAt(null), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useScrollLock(menu)
  // Menü açıkken odak üst bar + menü içinde kalır; Esc kapatır.
  useModal(shell, menu, closeMenu, panel)

  return (
    <div ref={shell}>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || menu ? 'border-b border-line bg-paper/85 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <div className="safe-x mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-2 min-[360px]:gap-3 min-[400px]:gap-4 md:h-20 md:gap-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-[0.35em] text-[16px] min-[360px]:text-[19px] sm:gap-[0.45em] md:text-[21px]"
            aria-label="Format Teknik — Anasayfa"
          >
            {/* amblem: kaydırdıkça dişli döner, üzerine gelince bir diş ilerler (bkz. Emblem). Telefonda iki satırlık
                yazı bloğu, masaüstünde tek satır yüksekliğinde. Çok dar ekranda (<360 px) sığmadığı için gizli. */}
            <Emblem spin className="size-[1.7em] shrink-0 max-[359px]:hidden sm:size-[1.55em]" />
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-[14px] transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="anim-fade absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent [--anim-dur:0.35s]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 min-[360px]:gap-2">
            <CartButton onClick={() => openCart()} />
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-ink/15 md:size-10 lg:hidden"
              onClick={() => setMenuAt(menu ? null : pathname)}
              aria-label={menu ? 'Menüyü kapat' : 'Menüyü aç'}
              aria-expanded={menu}
              aria-controls="mobil-menu"
            >
              {menu ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {menuPresence.mounted && (
          // perde gibi yukarıdan aşağı açılır, kapanırken geri toplanır
          <div
            id="mobil-menu"
            data-state={menuPresence.state}
            className="safe-b fixed inset-0 z-30 flex flex-col overflow-y-auto overscroll-contain bg-paper pt-24 transition-[clip-path] duration-600 ease-curtain [clip-path:inset(0_0_0%_0)] data-[state=closed]:[clip-path:inset(0_0_100%_0)] lg:hidden"
          >
            <nav ref={panel} className="safe-x flex flex-col" aria-label="Mobil menü">
              {NAV.map((item, i) => (
                <div key={item.to} className="anim-fade-up border-b border-line" style={anim({ delay: 0.15 + i * 0.06, dur: 0.6, y: '40px' })}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-baseline justify-between py-[clamp(12px,2.6svh,20px)] font-wide text-[clamp(28px,8.5vw,40px)] font-semibold tracking-[-0.02em] ${isActive ? 'text-ink' : 'text-graphite'}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="flex items-center gap-3">
                          {item.label}
                          {isActive && <span className="size-2 rounded-full bg-accent" />}
                        </span>
                        <span className="font-mono text-[11px] tracking-[0.2em] text-muted">0{i + 1}</span>
                      </>
                    )}
                  </NavLink>
                </div>
              ))}
            </nav>

            {/* hızlı iletişim — telefonda tek dokunuşla */}
            <div className="anim-fade-up safe-x mt-auto pt-8" style={anim({ delay: 0.45, dur: 0.6, y: '20px' })}>
              {/* Instagram: hesap adıyla, diğer düğmelerle aynı hap biçiminde */}
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram: ${SITE.instagramHandle} (yeni sekmede açılır)`}
                className="group mb-2 flex h-12 items-center justify-between rounded-full border border-ink/15 px-5 text-[14px] font-medium transition-colors hover:border-ink"
              >
                <span className="flex items-center gap-2">
                  <InstagramIcon className="size-4" /> Instagram
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px] font-normal tracking-[0.08em] text-muted group-hover:text-ink">
                  {SITE.instagramHandle} <ArrowUpRight className="size-3.5" />
                </span>
              </a>
              <div className="grid grid-cols-2 gap-2">
                <a href={SITE.phoneHref} className="flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 text-[14px] font-medium">
                  <Phone className="size-4" /> Ara
                </a>
                <a
                  href={whatsappUrl(`Merhaba ${SITE.name}, bilgi almak istiyorum.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-[14px] font-medium text-paper"
                >
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}
