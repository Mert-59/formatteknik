import { useId, useState, type FormEvent, type RefObject } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown, Minus, Plus } from 'lucide-react'
import { useCart } from './CartContext'
import { BRANDS } from '../data/brands'
import { CATEGORIES } from '../data/catalog'

const field = 'w-full rounded-lg border bg-paper px-3.5 py-3 text-[14px] outline-none transition-colors placeholder:text-muted'
const ok = 'border-line focus:border-ink'
const bad = 'border-accent-ink'
const label = 'mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted'

const clampQty = (n: number) => Math.max(1, Math.min(9999, Math.round(n) || 1))

type Props = {
  /** Seçili ürün grubu (slug); '' = seçilmedi */
  slug: string
  onSlugChange: (slug: string) => void
  codeRef: RefObject<HTMLInputElement | null>
}

/** Ürünler sayfasının tek sipariş formu: ürün grubu + kod/açıklama + marka + adet. */
export default function AddToCart({ slug, onSlugChange, codeRef }: Props) {
  const { add, setOpen } = useCart()
  const id = useId()
  const [code, setCode] = useState('')
  const [brand, setBrand] = useState('')
  const [qty, setQty] = useState('1') // yazarken boş kalabilsin; gönderirken sayıya çevrilir
  const [errors, setErrors] = useState({ cat: false, code: false })
  const [added, setAdded] = useState(0)
  const category = CATEGORIES.find((c) => c.slug === slug)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = { cat: !category, code: !code.trim() }
    setErrors(next)
    if (!category) {
      document.getElementById(`${id}-cat`)?.focus()
      return
    }
    if (next.code) {
      codeRef.current?.focus()
      return
    }
    add({ category: category.name, code: code.trim(), brand, qty: clampQty(Number(qty)), note: '' })
    setAdded(Date.now())
    setCode('')
    setQty('1')
    codeRef.current?.focus()
  }

  const step = (d: number) => setQty((q) => String(clampQty(Number(q) + d)))
  const hasError = errors.cat || errors.code

  return (
    <form onSubmit={submit} noValidate aria-label="Sepete ürün ekle">
      <div className="grid grid-cols-[minmax(0,1fr)_128px] gap-3">
        <div className="col-span-2">
          <label htmlFor={`${id}-cat`} className={label}>ÜRÜN GRUBU</label>
          <div className="relative">
            <select
              id={`${id}-cat`}
              className={`${field} appearance-none pr-9 ${errors.cat ? bad : ok} ${slug ? '' : 'text-muted'}`}
              value={slug}
              onChange={(e) => {
                onSlugChange(e.target.value)
                if (errors.cat) setErrors((x) => ({ ...x, cat: false }))
              }}
              aria-invalid={errors.cat}
              aria-describedby={errors.cat ? `${id}-err` : undefined}
            >
              <option value="" disabled>Seçin…</option>
              {CATEGORIES.map((c, i) => (
                <option key={c.slug} value={c.slug} className="text-ink">
                  {String(i + 1).padStart(2, '0')} — {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>
        </div>

        <div className="col-span-2">
          <label htmlFor={`${id}-code`} className={label}>ÜRÜN KODU / AÇIKLAMA</label>
          <input
            ref={codeRef}
            id={`${id}-code`}
            className={`${field} ${errors.code ? bad : ok}`}
            placeholder={category?.example ?? 'Örn. CNMG 120408'}
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              if (errors.code) setErrors((x) => ({ ...x, code: false }))
            }}
            aria-invalid={errors.code}
            aria-describedby={errors.code ? `${id}-err` : `${id}-hint`}
          />
        </div>

        <div className="min-w-0">
          <label htmlFor={`${id}-brand`} className={label}>MARKA</label>
          <div className="relative">
            <select id={`${id}-brand`} className={`${field} ${ok} appearance-none pr-9`} value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">Fark etmez</option>
              {BRANDS.map((b) => (
                <option key={b.name} value={b.name}>{b.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-qty`} className={label}>ADET</label>
          <div className="flex h-[50px] items-center justify-between rounded-lg border border-line focus-within:border-ink md:h-[46px]">
            <button type="button" className="grid h-full w-10 place-items-center" onClick={() => step(-1)} aria-label="Adedi azalt">
              <Minus className="size-3.5" />
            </button>
            <input
              id={`${id}-qty`}
              className="w-12 bg-transparent text-center font-mono text-[14px] tabular-nums outline-none"
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(e.target.value.replace(/\D/g, '').slice(0, 4))}
              onBlur={() => setQty(String(clampQty(Number(qty))))}
            />
            <button type="button" className="grid h-full w-10 place-items-center" onClick={() => step(1)} aria-label="Adedi arttır">
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-[15px] font-medium text-paper transition-colors hover:bg-accent-ink active:bg-accent-ink"
      >
        <Plus className="size-4" /> Sepete ekle
      </button>

      <div className="mt-3 min-h-10" aria-live="polite">
        <AnimatePresence mode="wait">
          {hasError ? (
            <motion.p key="err" id={`${id}-err`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[13px] text-accent-ink">
              {errors.cat ? 'Lütfen önce ürün grubunu seçin.' : 'Lütfen ürün kodunu veya kısa bir açıklama yazın.'}
            </motion.p>
          ) : added ? (
            <motion.p key={added} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center gap-x-2 text-[13px] text-graphite">
              <Check className="size-4 text-accent-ink" /> Sepete eklendi.
              <button type="button" className="font-medium text-ink underline underline-offset-2" onClick={() => setOpen(true)}>
                Sepeti aç
              </button>
            </motion.p>
          ) : (
            <motion.p key="hint" id={`${id}-hint`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[13px] text-muted">
              Kodu bilmiyorsanız ölçü ve kullanım amacını yazmanız yeterli.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  )
}
