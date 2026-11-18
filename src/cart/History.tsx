import { useEffect, useId, useState } from 'react'
import { Check, ChevronDown, RotateCcw } from 'lucide-react'
import { useCart, type PastSlip } from './CartContext'
import { stampTime } from './slipUtils'

const mono = 'font-mono text-[10px] tracking-[0.22em] text-muted'

/**
 * Son fişler: gönderildiği onaylanan fişler (en fazla 20, yalnızca bu cihazda — bkz. CartContext).
 * "Tekrarla" fişin kalemlerini açık fişe ekler; aynı kalem varsa adedi artar.
 * Geçmiş yoksa hiçbir şey çizilmez.
 *
 * `collapsible`: başlığa basınca açılır (dolu fişin altında yer kaplamasın diye).
 */
export default function RecentSlips({ limit = 3, collapsible = false, className = '' }: { limit?: number; collapsible?: boolean; className?: string }) {
  const { history, repeat, clearHistory } = useCart()
  const id = useId()
  const [expanded, setExpanded] = useState(!collapsible)
  const [showAll, setShowAll] = useState(false)
  const [detail, setDetail] = useState('')
  const [repeated, setRepeated] = useState('')
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    if (!repeated) return
    const t = window.setTimeout(() => setRepeated(''), 2500)
    return () => window.clearTimeout(t)
  }, [repeated])
  useEffect(() => {
    if (!confirmClear) return
    const t = window.setTimeout(() => setConfirmClear(false), 3000)
    return () => window.clearTimeout(t)
  }, [confirmClear])

  if (!history.length) return null
  const list = showAll ? history : history.slice(0, limit)

  const onRepeat = (slip: PastSlip) => {
    repeat(slip)
    setRepeated(slip.no)
  }

  return (
    <section className={className} aria-label="Son fişleriniz">
      {collapsible ? (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-controls={`${id}-list`}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <span className={mono}>
            SON FİŞLERİNİZ <span className="text-ink">({history.length})</span>
          </span>
          <span className="flex items-center gap-1 text-[13px] text-graphite">
            {expanded ? 'Gizle' : 'Gör'}
            <ChevronDown className={`size-4 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </span>
        </button>
      ) : (
        <p className={mono}>SON FİŞLERİNİZ</p>
      )}

      {expanded && (
        <div id={`${id}-list`}>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-paper">
            {list.map((s) => {
              const units = s.items.reduce((n, it) => n + it.qty, 0)
              const open = detail === s.no
              return (
                <li key={s.no} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setDetail(open ? '' : s.no)}
                      aria-expanded={open}
                      className="group min-w-0 flex-1 text-left"
                    >
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-mono text-[12px] font-medium text-ink">{s.no}</span>
                        {s.sentAt > 0 && <span className="font-mono text-[11px] text-muted">{stampTime(s.sentAt)}</span>}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-[13px] text-graphite">
                        <span className="min-w-0 truncate">
                          {s.items.length} kalem · {units} adet — {s.items.map((it) => it.code).join(', ')}
                        </span>
                        <ChevronDown className={`size-3.5 shrink-0 text-muted transition-transform group-hover:text-ink ${open ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {repeated === s.no ? (
                      <span className="inline-flex h-9 shrink-0 items-center gap-1 px-1 text-[13px] font-medium text-accent-ink" aria-live="polite">
                        <Check className="size-4" /> Eklendi
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onRepeat(s)}
                        aria-label={`${s.no} fişindeki kalemleri fişe ekle`}
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-ink/15 px-3.5 text-[13px] font-medium transition-colors hover:border-ink"
                      >
                        <RotateCcw className="size-3.5" /> Tekrarla
                      </button>
                    )}
                  </div>
                  {open && (
                    <ul className="anim-fade-up mt-2.5 space-y-1 rounded-lg bg-mist px-3 py-2.5 font-mono text-[12px] [--anim-dur:0.3s] [--anim-y:4px]">
                      {s.items.map((it, i) => (
                        <li key={i} className="flex justify-between gap-3">
                          <span className="min-w-0 break-words">{it.code}</span>
                          <span className="shrink-0 tabular-nums text-graphite">× {it.qty}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[12px]">
            {history.length > limit ? (
              <button type="button" onClick={() => setShowAll((a) => !a)} className="font-medium text-graphite underline-offset-4 hover:text-ink hover:underline">
                {showAll ? 'Daha az göster' : `Tümünü göster (${history.length})`}
              </button>
            ) : (
              <span className="text-muted">Yalnızca bu cihazda saklanır.</span>
            )}
            <button
              type="button"
              onClick={() => (confirmClear ? (clearHistory(), setConfirmClear(false)) : setConfirmClear(true))}
              className={`underline-offset-4 hover:underline ${confirmClear ? 'font-medium text-accent-ink' : 'text-muted hover:text-ink'}`}
            >
              {confirmClear ? 'Emin misiniz? Sil' : 'Geçmişi sil'}
            </button>
          </div>
          {history.length > limit && <p className="mt-1 text-[12px] text-muted">Yalnızca bu cihazda saklanır.</p>}
        </div>
      )}
    </section>
  )
}
