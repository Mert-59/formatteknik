import { useEffect, useId, useMemo, useRef, useState, type ClipboardEvent, type FormEvent, type RefObject } from 'react'
import { Check, ChevronDown, ListPlus, Minus, Plus } from 'lucide-react'
import { useCart } from './CartContext'
import { parseLines } from './parse'
import { BRANDS } from '../data/brands'
import { CATEGORIES } from '../data/catalog'

const field = 'w-full rounded-lg border bg-paper px-3.5 py-3 text-[15px] outline-none transition-colors placeholder:text-muted/80'
const ok = 'border-line focus:border-ink'
const bad = 'border-accent-ink'
const label = 'mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted'

const clampQty = (n: number) => Math.max(1, Math.min(9999, Math.round(n) || 1))
const LIST_EXAMPLE = 'CNMG 120408 x10\nM8x1.25 makine kılavuzu 5 adet\nØ8,5 5xD karbür matkap; 4'

type Props = {
  /** Sabit ürün grubu (slug). Verilirse grup seçimi gösterilmez. */
  category?: string
  /** Grup çiplerini göster (sabit grup yoksa) */
  chips?: boolean
  autoFocus?: boolean
  /** Ekledikten sonra "Fişi aç" bağlantısı (çekmecenin dışında kullanılırken) */
  showOpen?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
}

/**
 * Teklif fişine kalem ekleme. Önce kod, sonra (isteğe bağlı) grup ve marka.
 * Enter ekler, odak kod alanında kalır: art arda hızlı giriş.
 * "Liste yapıştır": her satır bir kalem (bkz. parse.ts). Kod alanına çok satırlı
 * metin yapıştırılırsa liste kipine kendiliğinden geçer.
 */
export default function QuickAdd({ category, chips = true, autoFocus, showOpen, inputRef }: Props) {
  const { add, addMany, openCart } = useCart()
  const id = useId()
  const ownInput = useRef<HTMLInputElement>(null)
  const input = inputRef ?? ownInput
  const area = useRef<HTMLTextAreaElement>(null)
  const switched = useRef(false)

  const [mode, setMode] = useState<'one' | 'list'>('one')
  const [code, setCode] = useState('')
  const [qty, setQty] = useState('1') // yazarken boş kalabilsin; eklerken sayıya çevrilir
  const [slug, setSlug] = useState(category ?? '')
  const [brand, setBrand] = useState('')
  const [brandOpen, setBrandOpen] = useState(false)
  const [list, setList] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ text: string; at: number } | null>(null)

  const fixed = category !== undefined
  const cat = CATEGORIES.find((c) => c.slug === (fixed ? category : slug))
  const parsed = useMemo(() => (mode === 'list' ? parseLines(list) : []), [mode, list])

  useEffect(() => {
    if (autoFocus) input.current?.focus({ preventScroll: true })
  }, [autoFocus, input])

  // Kip değişince ilgili alana odaklan (ilk açılışta değil)
  useEffect(() => {
    if (!switched.current) return
    if (mode === 'list') area.current?.focus()
    else input.current?.focus()
  }, [mode, input])

  const switchMode = (m: 'one' | 'list') => {
    switched.current = true
    setError('')
    setMode(m)
  }

  const base = { category: cat?.name ?? '', brand }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (mode === 'one') {
      const c = code.trim()
      if (!c) {
        setError('Kodu ya da kısa bir tarif yazın — ölçü ve kullanım amacı yeterli.')
        input.current?.focus()
        return
      }
      const q = clampQty(Number(qty))
      add({ ...base, code: c, qty: q })
      setDone({ text: `${c} × ${q}`, at: Date.now() })
      setCode('')
      setQty('1')
      input.current?.focus()
    } else {
      if (!parsed.length) {
        setError('Her satıra bir ürün yazın; adedi satır sonuna “x10” ya da “10 adet” diye ekleyin.')
        area.current?.focus()
        return
      }
      addMany(parsed.map((p) => ({ ...base, ...p })))
      setDone({ text: `${parsed.length} kalem eklendi`, at: Date.now() })
      setList('')
      switchMode('one')
    }
    setError('')
  }

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    if (!/\r?\n/.test(text.trim()) || parseLines(text).length < 2) return
    e.preventDefault()
    setList(text.trim())
    switchMode('list')
  }

  const step = (d: number) => setQty((q) => String(clampQty(Number(q) + d)))

  return (
    <form onSubmit={submit} noValidate aria-label="Teklif fişine ürün ekle">
      {mode === 'one' ? (
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <label htmlFor={`${id}-code`} className={label}>
              ÜRÜN KODU / TARİF
            </label>
            <input
              ref={input}
              id={`${id}-code`}
              className={`${field} font-medium ${error ? bad : ok}`}
              placeholder={cat?.example ?? 'Örn. CNMG 120408'}
              value={code}
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="done"
              onPaste={onPaste}
              onChange={(e) => {
                setCode(e.target.value)
                if (error) setError('')
              }}
              aria-invalid={!!error}
              aria-describedby={`${id}-msg`}
            />
          </div>
          <div className="shrink-0">
            <label htmlFor={`${id}-qty`} className={label}>
              ADET
            </label>
            <div className="flex h-[50px] items-center rounded-lg border border-line bg-paper focus-within:border-ink">
              <button type="button" className="grid h-full w-9 place-items-center text-graphite hover:text-ink" onClick={() => step(-1)} aria-label="Adedi azalt">
                <Minus className="size-3.5" />
              </button>
              <input
                id={`${id}-qty`}
                className="w-10 bg-transparent text-center font-mono text-[15px] tabular-nums outline-none"
                inputMode="numeric"
                value={qty}
                onChange={(e) => setQty(e.target.value.replace(/\D/g, '').slice(0, 4))}
                onBlur={() => setQty(String(clampQty(Number(qty))))}
              />
              <button type="button" className="grid h-full w-9 place-items-center text-graphite hover:text-ink" onClick={() => step(1)} aria-label="Adedi arttır">
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor={`${id}-list`} className={label}>
            LİSTE — HER SATIR BİR ÜRÜN
          </label>
          <textarea
            ref={area}
            id={`${id}-list`}
            rows={5}
            className={`${field} resize-y font-mono text-[13px] leading-relaxed ${error ? bad : ok}`}
            placeholder={LIST_EXAMPLE}
            value={list}
            spellCheck={false}
            onChange={(e) => {
              setList(e.target.value)
              if (error) setError('')
            }}
            aria-invalid={!!error}
            aria-describedby={`${id}-msg`}
          />
          {parsed.length > 0 && (
            <div className="mt-2 rounded-lg bg-mist px-3 py-2.5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-muted">{parsed.length} KALEM ALGILANDI</p>
              <ul className="mt-1.5 space-y-0.5 font-mono text-[12px]">
                {parsed.slice(0, 5).map((p, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span className="truncate">{p.code}</span>
                    <span className="shrink-0 tabular-nums text-graphite">× {p.qty}</span>
                  </li>
                ))}
                {parsed.length > 5 && <li className="text-muted">+ {parsed.length - 5} kalem daha</li>}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Ürün grubu — isteğe bağlı; mesajda kodun yanında görünür */}
      {!fixed && chips && (
        <div className="mt-4">
          <p className={label} id={`${id}-cats`}>
            ÜRÜN GRUBU <span className="tracking-normal normal-case">(isteğe bağlı)</span>
          </p>
          <div
            role="group"
            aria-labelledby={`${id}-cats`}
            className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] mask-[linear-gradient(90deg,#000_88%,transparent)] [&::-webkit-scrollbar]:hidden"
          >
            {CATEGORIES.map((c) => {
              const on = slug === c.slug
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSlug(on ? '' : c.slug)}
                  className={`h-8 shrink-0 rounded-full border px-3 text-[12.5px] transition-colors ${
                    on ? 'border-ink bg-ink text-paper' : 'border-line bg-paper text-graphite hover:border-ink/40 hover:text-ink'
                  }`}
                >
                  {c.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px]">
        {brandOpen ? (
          <div className="relative min-w-0 flex-1">
            <label htmlFor={`${id}-brand`} className="sr-only">
              Marka tercihi
            </label>
            <select
              id={`${id}-brand`}
              className={`${field} ${ok} appearance-none py-2 pr-9 text-[14px]`}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              <option value="">Marka: fark etmez</option>
              {BRANDS.map((b) => (
                <option key={b.name} value={b.name}>
                  Marka: {b.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>
        ) : (
          <button type="button" onClick={() => setBrandOpen(true)} className="inline-flex items-center gap-1 text-graphite underline-offset-4 hover:text-ink hover:underline">
            <Plus className="size-3.5" /> Marka tercihi
          </button>
        )}
        <button
          type="button"
          onClick={() => switchMode(mode === 'one' ? 'list' : 'one')}
          className="inline-flex items-center gap-1.5 text-graphite underline-offset-4 hover:text-ink hover:underline"
        >
          {mode === 'one' ? (
            <>
              <ListPlus className="size-4" /> Liste yapıştır
            </>
          ) : (
            '← Tek tek ekle'
          )}
        </button>
      </div>

      <button
        type="submit"
        className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 text-[15px] font-medium text-paper transition-colors hover:bg-accent-ink active:bg-accent-ink"
      >
        <Plus className="size-4" />
        {mode === 'list' && parsed.length > 1 ? `${parsed.length} kalemi fişe ekle` : 'Fişe ekle'}
        {mode === 'one' && <kbd className="ml-1 font-mono text-[11px] text-paper/50 max-md:hidden">↵</kbd>}
      </button>

      <div id={`${id}-msg`} className="mt-2.5 min-h-5 text-[13px]" aria-live="polite">
        {/* mesaj her değişince yeniden takılır ve hafifçe yukarı süzülerek belirir (index.css .anim-fade-up) */}
          {error ? (
            <p key="err" className="anim-fade-up text-accent-ink [--anim-dur:0.35s] [--anim-y:4px]">
              {error}
            </p>
          ) : done ? (
            <p key={done.at} className="anim-fade-up [--anim-dur:0.35s] [--anim-y:4px] flex flex-wrap items-center gap-x-2 text-graphite">
              <Check className="size-4 text-accent-ink" />
              <span className="min-w-0 truncate font-mono text-[12px]">{done.text}</span>
              {showOpen && (
                <button type="button" className="font-medium text-ink underline underline-offset-2" onClick={() => openCart()}>
                  Fişi aç
                </button>
              )}
            </p>
          ) : null}

      </div>
    </form>
  )
}
