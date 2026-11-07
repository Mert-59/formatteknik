import { motion } from 'motion/react'
import { Minus, Plus, X } from 'lucide-react'
import { itemKey, useCart, type CartItem } from './CartContext'

const p2 = (n: number) => String(n).padStart(2, '0')
const stampTime =(at: number) => {
  const d = new Date(at)
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${p2(d.getFullYear() % 100)} · ${p2(d.getHours())}:${p2(d.getMinutes())}`
}

/** Gönderilen fişe basılan mühür: kızıl mürekkep, hafif dönük, dokulu. */
export function Stamp({ at, className = '' }: { at: number; className?: string }) {
  return (
    <motion.div
      aria-label={`Gönderildi, ${stampTime(at)}`}
      role="img"
      initial={{ scale: 1.9, opacity: 0, rotate: -16 }}
      animate={{ scale: 1, opacity: 1, rotate: -7 }}
      transition={{ type: 'spring', stiffness: 560, damping: 24, mass: 0.8 }}
      className={`stamp pointer-events-none select-none rounded-[6px] border-2 border-accent px-3 py-1.5 text-center font-mono text-accent-ink ${className}`}
    >
      <span className="block text-[15px] font-semibold leading-tight tracking-[0.26em]">GÖNDERİLDİ</span>
      <span className="block text-[9.5px] tracking-[0.14em]">{stampTime(at)}</span>
    </motion.div>
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
            onClick={() => remove(item.id)}
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
