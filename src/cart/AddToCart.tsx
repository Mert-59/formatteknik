import { useId, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown, Minus, Plus } from 'lucide-react'
import { useCart } from './CartContext'
import { BRANDS } from '../data/brands'
import type { Category } from '../data/catalog'

const field =
  'w-full rounded-lg border border-line bg-paper px-3.5 py-3 text-[14px] outline-none transition-colors placeholder:text-muted/70 focus:border-ink'

/** Ürün grubuna, kod/açıklama + marka + adet ile sepete ekleme formu. */
export default function AddToCart({ category }: { category: Category }) {
  const { add, setOpen } = useCart()
  const id = useId()
  const [code, setCode] = useState('')
  const [brand, setBrand] = useState('')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState(false)
  const [added, setAdded] = useState(0)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError(true)
      return
    }
    add({ category: category.name, code: code.trim(), brand, qty, note: '' })
    setAdded(Date.now())
    setCode('')
    setQty(1)
    setError(false)
  }

  return (
    // Telefonda zaten bir kartın içinde: ikinci çerçeve yerine yalnızca üst ayraç
    <form onSubmit={submit} className="border-t border-line pt-5 sm:rounded-2xl sm:border sm:bg-paper sm:p-4 md:p-5" noValidate>
      {/* mobil: kod tam satır, marka + adet yan yana · masaüstü: tek satır */}
      <div className="grid grid-cols-[minmax(0,1fr)_128px] gap-3 md:grid-cols-[minmax(0,1fr)_180px_128px]">
        <div className="col-span-2 md:col-span-1">
          <label htmlFor={`${id}-code`} className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted">
            ÜRÜN KODU / AÇIKLAMA
          </label>
          <input
            id={`${id}-code`}
            className={`${field} ${error ? 'border-accent' : ''}`}
            placeholder={category.example}
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              if (error) setError(false)
            }}
            aria-invalid={error}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor={`${id}-brand`} className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted">
            MARKA
          </label>
          <div className="relative">
            <select id={`${id}-brand`} className={`${field} appearance-none pr-9`} value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">Fark etmez</option>
              {BRANDS.map((b) => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>
        </div>
        <div>
          <span className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted">ADET</span>
          <div className="flex h-[50px] items-center justify-between rounded-lg border border-line md:h-[46px]">
            <button type="button" className="grid h-full w-10 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Azalt">
              <Minus className="size-3.5" />
            </button>
            <input
              className="w-12 bg-transparent text-center font-mono text-[14px] tabular-nums outline-none"
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(9999, Number(e.target.value.replace(/\D/g, '')) || 1)))}
              aria-label="Adet"
            />
            <button type="button" className="grid h-full w-10 place-items-center" onClick={() => setQty((q) => Math.min(9999, q + 1))} aria-label="Arttır">
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p key="err" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[13px] text-accent-ink">
              Lütfen ürün kodunu veya kısa bir açıklama yazın.
            </motion.p>
          ) : added ? (
            <motion.p key={added} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[13px] text-graphite">
              <Check className="size-4 text-accent" /> Sepete eklendi.
              <button type="button" className="font-medium text-ink underline underline-offset-2" onClick={() => setOpen(true)}>
                Sepeti aç
              </button>
            </motion.p>
          ) : (
            <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[13px] text-muted">
              Kodu bilmiyorsanız ölçü ve kullanım amacını yazmanız yeterli.
            </motion.p>
          )}
        </AnimatePresence>
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 text-[15px] font-medium text-paper transition-colors hover:bg-accent active:bg-accent max-sm:w-full sm:h-11 sm:text-[14px]"
        >
          <Plus className="size-4" /> Sepete ekle
        </button>
      </div>
    </form>
  )
}
