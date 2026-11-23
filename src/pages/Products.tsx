import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Camera, FileText, Plus, Send } from 'lucide-react'
import { CATEGORIES } from '../data/catalog'
import { CATALOGS } from '../data/catalogs'
import { SITE, categoryPath, photoWhatsappUrl } from '../config/site'
import { useIsClient } from '../lib/client'
import ToolDrawing from '../components/ToolDrawing'
import PageHero from '../components/PageHero'
import QuickAdd from '../cart/QuickAdd'
import { SendConfirm, SlipItem, Stamp } from '../cart/Slip'
import RecentSlips from '../cart/History'
import { useCart } from '../cart/CartContext'
import { scrollToElement } from '../lib/scroll'
import { usePageMeta } from '../lib/usePageMeta'
import { usePresence } from '../lib/presence'

const headerOffset = () => (window.innerWidth < 768 ? -80 : -104)
/** '#torna-uclari' → 'torna-uclari' (geçerli bir grup değilse '') */
const fromHash = (h: string) => {
  const s = decodeURIComponent(h.slice(1))
  return CATEGORIES.some((c) => c.slug === s) ? s : ''
}
const mono = 'font-mono text-[10px] tracking-[0.22em] text-muted md:text-[11px]'

/**
 * Grup paneli: yüksekliği "auto"ya açılır/kapanır (grid satırı 0fr ↔ 1fr, ölçüm gerekmez).
 * Kapalıyken içerik sayfadan kalkar (her grupta ayrı form bekletilmez).
 */
function Collapse({ open, id, children }: { open: boolean; id: string; children: ReactNode }) {
  const { mounted, state } = usePresence(open, 450)
  if (!mounted) return null
  return (
    <div
      id={id}
      data-state={state}
      className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-450 ease-curtain data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0"
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

/** Masaüstünde sağda sabit duran canlı fiş: eklenen her kalem anında burada görünür. */
function SlipPanel() {
  const { items, count, units, orderNo, sentAt, openedAt, sendWhatsApp, openCart } = useCart()
  return (
    <div className="rounded-3xl border border-line bg-paper">
      <div className="flex items-center gap-3 border-b border-line px-6 py-4">
        <span className="size-1.5 rounded-full bg-accent" />
        <span className={mono}>TEKLİF FİŞİ</span>
        <span className="h-px flex-1 bg-line" />
        {orderNo && <span className="font-mono text-[12px] text-ink">{orderNo}</span>}
      </div>

      {count === 0 ? (
        <div className="px-6 py-8">
          <p className="text-[15px] leading-relaxed text-graphite">
            Fişiniz boş. Soldan bir grubun yanındaki + ile formu açın, kodu yazıp <span className="font-medium text-ink">Enter</span>’a basın.
          </p>
          <button type="button" onClick={() => openCart({ focus: true })} className="tap mt-5 text-[14px] font-medium underline underline-offset-4 hover:text-accent-ink">
            Grubunu bilmiyorum, kodla ekleyeceğim
          </button>
          {/* düzenli alımda: geçen fişi tek dokunuşla tekrarla (geçmiş yoksa çizilmez) */}
          <RecentSlips limit={2} className="mt-7" />
        </div>
      ) : (
        <>
          <div className="relative max-h-[calc(100svh-22rem)] overflow-y-auto overscroll-contain">
            <ul className="divide-y divide-line">
              {items.map((it, i) => (
                <li key={it.id} className="px-6 py-3">
                  <SlipItem item={it} index={i} editable={false} />
                </li>
              ))}
            </ul>
            {sentAt > 0 && <Stamp at={sentAt} className="absolute left-1/2 top-3 size-[92px] -translate-x-1/2" />}
          </div>
          <div className="border-t border-line p-5">
            <p className="mb-4 flex justify-between text-[14px]">
              <span className="text-muted">Toplam</span>
              <span className="font-medium">
                {count} kalem · {units} adet
              </span>
            </p>
            {sentAt > 0 && (
              <p className="mb-4 text-[13px] leading-relaxed text-graphite">
                Fişiniz bize ulaştı; {SITE.replyTime || 'en kısa sürede'} dönüş yapacağız. Acil mi?{' '}
                <a href={SITE.phoneHref} className="whitespace-nowrap font-medium text-ink underline underline-offset-2 hover:text-accent-ink">
                  {SITE.phoneDisplay}
                </a>
              </p>
            )}
            {openedAt > 0 && !sentAt ? (
              // WhatsApp açıldı: gönderdi mi? (site bunu kendisi bilemez)
              <SendConfirm />
            ) : (
              <button
                type="button"
                onClick={sendWhatsApp}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-paper transition-colors hover:bg-whatsapp"
              >
                <Send className="size-4" /> {sentAt ? 'Tekrar gönder' : 'WhatsApp ile gönder'}
              </button>
            )}
            <button type="button" onClick={() => openCart()} className="mt-2 flex h-11 w-full items-center justify-center gap-1.5 text-[14px] text-graphite hover:text-ink">
              Fişi düzenle <ArrowRight className="size-4" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Products() {
  usePageMeta(
    'Ürünlerimiz',
    'Torna uçları, frezeler, kılavuz, karbür ve HSS matkaplar, ölçü aletleri, shrink-fit tutucular ve pensler. Kodu yazın, teklif fişine ekleyin, WhatsApp’tan gönderin.',
  )
  const root = useRef<HTMLDivElement>(null)
  // #çapa yalnızca tarayıcıda bilinir: ön-render'da ve devralmada '' (bkz. lib/client.ts), hemen ardından gerçek değer
  const isClient = useIsClient()
  const { hash: locationHash } = useLocation()
  const hash = isClient ? locationHash : ''
  const { openCart, count, orderNo } = useCart()
  // /urunler#torna-uclari → o grup açık gelir (adres sonradan değişirse de)
  const [openSlug, setOpenSlug] = useState(() => fromHash(hash))
  const [seenHash, setSeenHash] = useState(hash)
  if (hash !== seenHash) {
    setSeenHash(hash)
    if (fromHash(hash)) setOpenSlug(fromHash(hash))
  }
  // Yalnızca kullanıcı bir grubu açtığında kod alanına odaklanılır (adresle gelince klavye açılmasın)
  const [byUser, setByUser] = useState(false)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.cat').forEach((el) => {
        gsap.fromTo(
          el.querySelector('.plot'),
          { '--plot': 1 },
          { '--plot': 0, duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
        )
      })
    },
    { scope: root },
  )

  // ... ve sayfa o gruba kayar
  useEffect(() => {
    const s = fromHash(hash)
    if (!s) return
    const t = window.setTimeout(() => {
      const el = document.getElementById(s)
      if (el) scrollToElement(el, headerOffset())
    }, 250)
    return () => window.clearTimeout(t)
  }, [hash])

  const toggle = (slug: string) => {
    setByUser(true)
    setOpenSlug((s) => (s === slug ? '' : slug))
  }

  return (
    <div ref={root}>
      <PageHero
        label="ÜRÜNLERİMİZ"
        title={<>Ürün grupları</>}
        text="Grubun yanındaki + ile formu açın, kodu ya da tarifi yazın, Enter’a basın. Fişiniz hazır olunca tek dokunuşla WhatsApp’tan gönderin."
      />

      <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-5 pb-28 md:px-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className={mono}>
              <span className="text-ink">{String(CATEGORIES.length).padStart(2, '0')}</span> GRUP
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-4 text-[14px] text-graphite md:gap-y-2">
              <button type="button" onClick={() => openCart({ focus: true })} className="tap inline-flex items-center gap-1.5 underline-offset-4 hover:text-ink hover:underline">
                Grubunu bilmiyorum, kodla ekle <ArrowRight className="size-4" />
              </button>
              {/* kodu da bilmeyen için: fotoğrafı WhatsApp'tan gönder */}
              <a
                href={photoWhatsappUrl(count ? orderNo : '')}
                target="_blank"
                rel="noopener noreferrer"
                title="Takımın ya da kutusunun fotoğrafını WhatsApp’tan gönderin"
                className="tap inline-flex items-center gap-1.5 underline-offset-4 hover:text-ink hover:underline"
              >
                <Camera className="size-4" /> Kodu bilmiyorum, fotoğrafla sor
              </a>
              <Link to="/kataloglar" className="tap inline-flex items-center gap-1.5 underline-offset-4 hover:text-ink hover:underline">
                <FileText className="size-4" /> Kataloglar (PDF)
              </Link>
            </div>
          </div>

          <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line">
            {CATEGORIES.map((c, i) => {
              const isOpen = c.slug === openSlug
              return (
                <li key={c.slug} id={c.slug} className={`cat transition-colors duration-300 ${isOpen ? 'bg-mist' : 'bg-paper'}`}>
                  {/*
                    Satırın tamamı grup sayfasına gider (anasayfadaki kartla aynı davranış): başlıktaki bağlantı satırı kaplar.
                    "+" düğmesi bağlantının üstündedir ve teklif formunu yerinde açıp kapatır.
                  */}
                  <div className="group relative grid w-full grid-cols-[88px_minmax(0,1fr)] items-start gap-4 p-4 text-left sm:grid-cols-[168px_minmax(0,1fr)] sm:items-center sm:gap-6 md:p-6">
                    <div
                      className={`rounded-xl px-2 py-3 transition-colors duration-300 sm:px-3 sm:py-4 ${
                        isOpen ? 'bg-paper text-accent-ink' : 'bg-mist text-ink group-hover:text-accent-ink'
                      }`}
                    >
                      <ToolDrawing kind={c.drawing} className="w-full" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-muted">
                          <span className="text-ink">{String(i + 1).padStart(2, '0')}</span> / {String(CATEGORIES.length).padStart(2, '0')}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggle(c.slug)}
                          aria-expanded={isOpen}
                          aria-controls={`${c.slug}-ekle`}
                          aria-label={`${c.name}: teklif formunu ${isOpen ? 'kapat' : 'aç'}`}
                          title={isOpen ? 'Formu kapat' : 'Bu gruptan teklif iste'}
                          className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                            isOpen ? 'rotate-45 border-ink bg-ink text-paper' : 'border-ink/15 bg-paper hover:border-ink hover:bg-ink hover:text-paper'
                          }`}
                        >
                          <Plus className="size-4" aria-hidden />
                        </button>
                      </div>
                      <h2 className="mt-1 font-wide text-[clamp(20px,2.2vw,28px)] font-semibold leading-tight tracking-[-0.02em]">
                        <Link to={categoryPath(c.slug)} className="underline-offset-4 after:absolute after:inset-0 group-hover:underline">
                          {c.name}
                        </Link>
                      </h2>
                      <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted md:text-[15px]">{c.description}</p>
                      <span className="mt-3 block font-mono text-[11px] tracking-[0.06em] text-muted max-sm:hidden">{c.example}</span>
                    </div>
                  </div>

                  <Collapse open={isOpen} id={`${c.slug}-ekle`}>
                        <div className="px-4 pb-4 sm:pl-[calc(168px+2.5rem)] md:px-6 md:pb-6 md:pl-[calc(168px+3rem)]">
                          <div className="rounded-2xl border border-line bg-paper p-4 md:p-5">
                            <QuickAdd category={c.slug} autoFocus={byUser} showOpen />
                          </div>
                          {/* grubun kendi sayfası */}
                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] font-medium text-graphite">
                            <Link to={categoryPath(c.slug)} className="tap inline-flex items-center gap-1.5 underline-offset-4 hover:text-ink hover:underline">
                              {c.name} sayfası <ArrowRight className="size-4" />
                            </Link>
                            {/* grubun PDF kataloğu varsa: grup sayfasındaki katalog bölümüne */}
                            {(CATALOGS[c.slug]?.length ?? 0) > 0 && (
                              <Link to={`${categoryPath(c.slug)}#katalog`} className="tap inline-flex items-center gap-1.5 underline-offset-4 hover:text-ink hover:underline">
                                <FileText className="size-4" /> {CATALOGS[c.slug].length > 1 ? `${CATALOGS[c.slug].length} PDF katalog` : 'PDF katalog'}
                              </Link>
                            )}
                          </div>
                        </div>
                  </Collapse>
                </li>
              )
            })}
          </ul>
        </div>

        {/* canlı fiş — masaüstünde kaydırırken yanda sabit; telefonda alt çubuk (CartBar) */}
        <aside className="max-lg:hidden lg:sticky lg:top-28 lg:col-span-5 xl:col-span-4">
          <SlipPanel />
        </aside>
      </div>
    </div>
  )
}
