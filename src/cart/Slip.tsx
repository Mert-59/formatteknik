import { useId } from 'react'
import gsap from 'gsap'
import { Check, Minus, Plus, X } from 'lucide-react'
import { itemKey, useCart, type CartItem } from './CartContext'
import { p2, stampTime } from './slipUtils'
import { prefersReducedMotion } from '../lib/scroll'
import { EmblemMark } from '../components/Emblem'

/**
 * Gönderilen fişe basılan kaşe: firma kaşesi düzeninde yuvarlak — dış halkada "FORMAT TEKNİK" ve
 * "KESİCİ TAKIMLAR" (logodaki gibi), ortada amblem, kaşeyi kesen şeritte "GÖNDERİLDİ", altta tarih ve saat.
 * Tek renk kızıl mürekkep, -7° eğik, dokulu (index.css .stamp). Boyutu çağıran verir (className: size-…).
 *  - animate: büyükten "basılır" (index.css .anim-stamp); yazdırmada kapalı
 *  - textured: mürekkep dokusu; yazdırmada kapalı (baskıda düz mürekkep daha net)
 */
export function Stamp({ at, className = '', animate = true, textured = true }: { at: number; className?: string; animate?: boolean; textured?: boolean }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const [date, time] = stampTime(at).split(' · ')
  const ring = 37.6 // halka yazısının yarıçapı (iki çemberin ortası)
  return (
    <svg
      viewBox="-50 -50 100 100"
      role="img"
      aria-label={`Gönderildi, ${stampTime(at)}`}
      fill="none"
      stroke="currentColor"
      className={`pointer-events-none select-none text-accent-ink ${textured ? 'stamp' : ''} ${animate ? 'anim-stamp' : '-rotate-7'} ${className}`}
    >
      <defs>
        {/* üst yazı soldan sağa saat yönünde; alt yazı soldan sağa saat yönünün tersine (harfler dik okunur) */}
        <path id={`${id}-top`} d={`M${-ring} 0A${ring} ${ring} 0 0 1 ${ring} 0`} />
        <path id={`${id}-bottom`} d={`M${-ring - 5.2} 0A${ring + 5.2} ${ring + 5.2} 0 0 0 ${ring + 5.2} 0`} />
      </defs>
      <circle r={47.6} strokeWidth={2.2} />
      <circle r={44} strokeWidth={0.8} />
      <circle r={31} strokeWidth={0.8} />
      <g fill="currentColor" stroke="none" className="font-mono" fontWeight={600} fontSize={7.2} letterSpacing={1.5}>
        <text>
          <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
            FORMAT TEKNİK
          </textPath>
        </text>
        <text>
          <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
            KESİCİ TAKIMLAR
          </textPath>
        </text>
      </g>
      {/* amblem: tek renk */}
      <g transform="translate(0 -18.5) scale(0.23)">
        <EmblemMark mono />
      </g>
      {/* kaşeyi enlemesine kesen şerit: altındaki çemberleri örter */}
      <rect x={-49.5} y={-7.6} width={99} height={15.2} fill="var(--color-paper)" strokeWidth={1.1} />
      <text y={3.4} textAnchor="middle" fill="currentColor" stroke="none" className="font-mono" fontWeight={700} fontSize={9.6} letterSpacing={1.6}>
        GÖNDERİLDİ
      </text>
      <g fill="currentColor" stroke="none" className="font-mono" textAnchor="middle" fontSize={6.2} letterSpacing={0.8}>
        <text y={16.5}>{date}</text>
        <text y={24}>{time}</text>
      </g>
    </svg>
  )
}

/**
 * WhatsApp açıldıktan sonra: "Mesajı gönderdiniz mi?" Site mesajın gidip gitmediğini bilemez;
 * mühür ve geçmiş kaydı müşterinin onayıyla olur (bkz. CartContext → confirmSent).
 */
export function SendConfirm({ className = '' }: { className?: string }) {
  const { confirmSent, dismissSent, sendWhatsApp } = useCart()
  return (
    <div role="status" className={`anim-fade-up rounded-2xl border border-ink/15 bg-mist p-4 [--anim-dur:0.4s] [--anim-y:8px] ${className}`}>
      <p className="text-[15px] font-medium text-ink">WhatsApp açıldı. Mesajı gönderdiniz mi?</p>
      <p className="mt-1 text-[13px] leading-relaxed text-graphite">
        Onaylayınca fiş “gönderildi” olarak işaretlenir ve bu cihazdaki son fişlerinize kaydedilir.
      </p>
      <div className="mt-3.5 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={confirmSent}
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-ink text-[14px] font-medium text-paper transition-colors hover:bg-accent-ink"
        >
          <Check className="size-4" /> Evet, gönderdim
        </button>
        <button
          type="button"
          onClick={sendWhatsApp}
          className="h-12 rounded-full border border-ink/15 bg-paper text-[14px] font-medium transition-colors hover:border-ink"
        >
          WhatsApp’ı tekrar aç
        </button>
      </div>
      <button type="button" onClick={dismissSent} className="mt-2.5 text-[13px] text-muted underline-offset-4 hover:text-ink hover:underline">
        Henüz göndermedim
      </button>
    </div>
  )
}

/** Fiş satırı. `editable` değilse yalnızca okunur özet (ürünler sayfasının yan paneli). */
export function SlipItem({ item, index, editable = true }: { item: CartItem; index: number; editable?: boolean }) {
  const { setQty, remove, lastAdded } = useCart()
  // Çizgi bir kez oynar ve söner (index.css .slip-flash); yeni ekleme olunca yeniden takılır.
  const fresh = lastAdded.keys.includes(itemKey(item))
  const meta = [item.category, item.brand].filter(Boolean).join(' · ')

  return (
    <div className="relative flex gap-3">
      {/* yeni eklenen / adedi artan kalemde kısa kızıl çizgi */}
      {fresh && <span key={lastAdded.at} aria-hidden className="slip-flash absolute -left-5 inset-y-0 w-[2px] bg-accent sm:-left-6" />}
      <span className="w-5 shrink-0 pt-[3px] font-mono text-[10px] tabular-nums text-muted">{p2(index + 1)}</span>
      <div className="min-w-0 flex-1">
        <p className="break-words font-mono text-[14px] font-medium leading-snug">{item.code}</p>
        {meta && <p className="mt-0.5 truncate text-[12px] text-muted">{meta}</p>}
      </div>
      {editable ? (
        <div className="flex shrink-0 items-start gap-1">
          <div className="flex items-center rounded-full border border-line">
            <button
              type="button"
              className="grid size-9 place-items-center disabled:opacity-30 sm:size-8"
              onClick={() => setQty(item.id, item.qty - 1)}
              disabled={item.qty <= 1}
              aria-label={`${item.code} adedini azalt`}
            >
              <Minus className="size-3.5" />
            </button>
            <span className="min-w-7 text-center font-mono text-[13px] tabular-nums" aria-label={`Adet ${item.qty}`}>
              {item.qty}
            </span>
            <button type="button" className="grid size-9 place-items-center sm:size-8" onClick={() => setQty(item.id, item.qty + 1)} aria-label={`${item.code} adedini arttır`}>
              <Plus className="size-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={(e) => {
              // satır yukarı doğru kapanır, sonra fişten çıkar
              const row = e.currentTarget.closest('li')
              if (!row || prefersReducedMotion()) return remove(item.id)
              gsap.to(row, { height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0, duration: 0.3, ease: 'power2.inOut', onComplete: () => remove(item.id) })
            }}
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-accent-ink sm:size-8"
            aria-label={`${item.code} kalemini kaldır`}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <span className="shrink-0 pt-px font-mono text-[13px] tabular-nums text-graphite">× {item.qty}</span>
      )}
    </div>
  )
}
