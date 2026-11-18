import gsap from 'gsap'
import { Check, Minus, Plus, X } from 'lucide-react'
import { itemKey, useCart, type CartItem } from './CartContext'
import { p2, stampTime } from './slipUtils'
import { prefersReducedMotion } from '../lib/scroll'

/** Gönderilen fişe basılan mühür: kızıl mürekkep, hafif dönük, dokulu. */
export function Stamp({ at, className = '' }: { at: number; className?: string }) {
  return (
    // anim-stamp: büyükten basılır, hafif geri sekip -7° eğik oturur (index.css)
    <div
      aria-label={`Gönderildi, ${stampTime(at)}`}
      role="img"
      className={`stamp anim-stamp pointer-events-none select-none rounded-[6px] border-2 border-accent px-3 py-1.5 text-center font-mono text-accent-ink ${className}`}
    >
      <span className="block text-[15px] font-semibold leading-tight tracking-[0.26em]">GÖNDERİLDİ</span>
      <span className="block text-[9.5px] tracking-[0.14em]">{stampTime(at)}</span>
    </div>
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
