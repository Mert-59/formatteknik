import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ReceiptText, RotateCcw } from 'lucide-react'
import { useCart } from '../cart/CartContext'
import { parseLines } from '../cart/parse'
import { guessCategory } from '../cart/guess'
import { CATEGORIES } from '../data/catalog'

/**
 * Anasayfa açılışında doğrudan kod alanı: kodu yazıp Enter → kalem teklif fişine eklenir ve fiş açılır
 * (odak fişteki kod alanında; müşteri sıradaki kodla devam eder). Boşken Enter fişi açar.
 *  - "CNMG 120408 x10" → adet 10 (parse.ts); grup koddan tahmin edilir (guess.ts).
 *  - Dönen müşteri: açık fişte kalem varsa "Açık fişiniz · Fişi aç", yoksa son gönderilen fiş "Tekrarla".
 *    Bu bilgiler cihazda saklanır; ön-render HTML'inde yoktur, sayfa açıldıktan hemen sonra belirir.
 *
 * Masaüstünde (≥1024 px) blok "Güvenilir" satırının yanındaki boşluğa oturur: orada yalnızca kod alanı var
 * (etiket ekran okuyucuya, yardım satırı ve fiş kartı gizli — açık fiş başlıktaki sayaçta, son fişler fiş çekmecesinde).
 */
export default function HeroCode() {
  const { add, openCart, count, orderNo, history, repeat } = useCart()
  const id = useId()
  const [code, setCode] = useState('')
  const last = history[0]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const line = parseLines(code)[0]
    if (line) {
      const slug = guessCategory(line.code)
      add({ code: line.code, qty: line.qty, category: CATEGORIES.find((c) => c.slug === slug)?.name ?? '' })
      setCode('')
    }
    openCart({ focus: true })
  }

  return (
    <div>
      <form onSubmit={submit} aria-label="Teklif fişine ürün kodu ekle" className="mt-6">
        <label htmlFor={`${id}-code`} className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted lg:sr-only">
          KODLA TEKLİF İSTEYİN
        </label>
        {/* odak çerçevesi kutunun kendisinde (yuvarlak); içteki alanın köşeli çerçevesi kapalı */}
        <div className="flex h-14 items-center rounded-full lg:h-12 border border-ink/20 bg-paper pl-5 pr-1.5 transition-colors focus-within:border-ink focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
          <input
            id={`${id}-code`}
            className="min-w-0 flex-1 bg-transparent text-[16px] font-medium outline-none pill-field placeholder:font-normal placeholder:text-muted/80"
            placeholder="Ör. CNMG 120408 x10"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
          />
          <button
            type="submit"
            aria-label={code.trim() ? 'Teklif fişine ekle' : 'Teklif fişini aç'}
            className="group grid size-11 shrink-0 place-items-center rounded-full bg-ink lg:size-9 text-paper transition-colors hover:bg-accent-ink"
          >
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[13px] lg:hidden">
        <span className="text-muted">Enter’a basın, fişinize eklensin.</span>
        <Link to="/urunler" className="tap inline-flex items-center gap-1 font-medium text-graphite underline-offset-4 hover:text-ink hover:underline">
          Ürün grupları <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* dönen müşteri — yalnızca bu cihazda kayıt varsa */}
      {count > 0 ? (
        <Return
          icon={<ReceiptText className="size-4" strokeWidth={1.6} />}
          label="AÇIK FİŞİNİZ"
          no={orderNo}
          detail={`${count} kalem`}
          action="Fişi aç"
          onAction={() => openCart()}
        />
      ) : last ? (
        <Return
          icon={<RotateCcw className="size-4" strokeWidth={1.6} />}
          label="SON FİŞİNİZ"
          no={last.no}
          detail={`${last.items.length} kalem · ${last.items.map((it) => it.code).join(', ')}`}
          action="Tekrarla"
          actionLabel={`${last.no} fişindeki kalemleri yeni fişe ekle`}
          onAction={() => {
            repeat(last)
            openCart()
          }}
        />
      ) : null}
    </div>
  )
}

function Return({
  icon,
  label,
  no,
  detail,
  action,
  actionLabel,
  onAction,
}: {
  icon: ReactNode
  label: string
  no: string
  detail: string
  action: string
  actionLabel?: string
  onAction: () => void
}) {
  return (
    <div className="anim-fade-up mt-4 flex items-center gap-3 rounded-2xl lg:hidden border border-line bg-paper/90 py-2.5 pl-3.5 pr-2.5 [--anim-dur:0.5s] [--anim-y:8px]">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist text-ink">{icon}</span>
      <p className="min-w-0 flex-1 leading-tight">
        <span className="block font-mono text-[10px] tracking-[0.18em] text-muted">{label}</span>
        <span className="mt-1 block truncate text-[13px] text-graphite">
          <span className="font-mono text-[12px] font-medium text-ink">{no}</span> · {detail}
        </span>
      </p>
      <button
        type="button"
        onClick={onAction}
        aria-label={actionLabel}
        className="inline-flex h-9 shrink-0 items-center rounded-full border border-ink/15 px-3.5 text-[13px] font-medium transition-colors hover:border-ink"
      >
        {action}
      </button>
    </div>
  )
}
