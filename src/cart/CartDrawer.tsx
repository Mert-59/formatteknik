import { Fragment, useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronDown, Mail, Send, X } from 'lucide-react'
import { useCart } from './CartContext'
import QuickAdd from './QuickAdd'
import { SlipItem, Stamp } from './Slip'
import { useModal, useScrollLock } from '../lib/scroll'
import { EASE_CURTAIN } from '../lib/motion'

const field =
  'w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-muted focus:border-ink'
const label = 'mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted'
const mono = 'font-mono text-[10px] tracking-[0.22em] text-muted'

/** WhatsApp biçimini (*kalın*) önizlemede gerçekten kalın gösterir. */
function Preview({ text }: { text: string }) {
  return (
    <pre className="whitespace-pre-wrap break-words rounded-lg bg-mist p-3.5 font-mono text-[12px] leading-relaxed text-graphite">
      {text.split(/(\*[^*\n]+\*)/g).map((part, i) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <strong key={i} className="font-semibold text-ink">
            {part.slice(1, -1)}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </pre>
  )
}

export default function CartDrawer() {
  const { items, open, setOpen, focusAdd, count, units, orderNo, sentAt, customer, setCustomer, buildMessage, sendWhatsApp, mailHref, clear } =
    useCart()
  const dialog = useRef<HTMLDivElement>(null)
  const start = useRef<HTMLDivElement>(null)
  const id = useId()
  const [infoOpen, setInfoOpen] = useState(false)
  const [preview, setPreview] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const close = useCallback(() => setOpen(false), [setOpen])

  useScrollLock(open)
  // Açılışta odak: fiş boşsa ya da "kodla sipariş" istendiyse kod alanı; değilse kapat düğmesi.
  useModal(dialog, open, close, start)
  const startAtAdd = focusAdd || items.length === 0

  useEffect(() => {
    if (!confirmClear) return
    const t = window.setTimeout(() => setConfirmClear(false), 3000)
    return () => window.clearTimeout(t)
  }, [confirmClear])

  const who = [customer.name.trim(), customer.company.trim()].filter(Boolean).join(' · ')

  return (
    <AnimatePresence>
      {open && (
        <div ref={dialog} className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Teklif fişi">
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-[min(480px,100vw)] flex-col bg-paper shadow-[-30px_0_80px_rgba(15,18,21,0.12)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: EASE_CURTAIN }}
          >
            {/* fiş başlığı */}
            <div className="relative flex items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:py-5">
              <div className="min-w-0">
                <p className={`${mono} whitespace-nowrap`}>
                  TEKLİF FİŞİ{orderNo && <span className="text-ink"> · {orderNo}</span>}
                </p>
                <p className="mt-1.5 whitespace-nowrap text-[19px] font-semibold tracking-[-0.01em]">
                  {count ? (
                    <>
                      {count} kalem <span className="font-normal text-muted">· {units} adet</span>
                    </>
                  ) : (
                    'Yeni fiş'
                  )}
                </p>
              </div>
              {/* mühür başlığın üstüne basılır; yer kaplamaz */}
              {sentAt > 0 && items.length > 0 && <Stamp at={sentAt} className="absolute right-[3.75rem] top-1/2 -translate-y-1/2 max-sm:scale-90 sm:right-20" />}
              <button
                type="button"
                onClick={close}
                className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-ink"
                aria-label="Fişi kapat"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* ekleme — her zaman en üstte: boş fişte de çıkmaz sokak yok */}
              <div ref={startAtAdd ? start : undefined} className="border-b border-line bg-mist/60 px-5 pb-3 pt-5 sm:px-6">
                <QuickAdd />
              </div>

              {items.length === 0 ? (
                <div className="px-5 py-7 sm:px-6">
                  <p className={mono}>NASIL ÇALIŞIR</p>
                  <ol className="mt-4 space-y-3 text-[14px] leading-relaxed text-graphite">
                    {[
                      'Kodu yazın, Enter’a basın — art arda ekleyin.',
                      'Elinizde liste mi var? “Liste yapıştır” ile tek seferde ekleyin.',
                      'Kodu bilmiyorsanız ölçü ve kullanım amacını yazmanız yeterli.',
                    ].map((t, i) => (
                      <li key={t} className="flex gap-3">
                        <span className="pt-[3px] font-mono text-[10px] text-muted">0{i + 1}</span>
                        {t}
                      </li>
                    ))}
                  </ol>
                  <Link to="/urunler" onClick={close} className="mt-6 inline-block text-[14px] font-medium underline underline-offset-4 hover:text-accent-ink">
                    Ürün gruplarına göz atın
                  </Link>
                </div>
              ) : (
                <>
                  <div>
                    <ul className="divide-y divide-line">
                      <AnimatePresence initial={false}>
                        {items.map((it, i) => (
                          <motion.li
                            key={it.id}
                            layout="position"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
                            className="overflow-hidden px-5 py-3.5 sm:px-6"
                          >
                            <SlipItem item={it} index={i} />
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>

                  {/* bilgiler — isteğe bağlı, ad/firma hatırlanır */}
                  <div className="border-t border-line px-5 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => setInfoOpen((o) => !o)}
                      aria-expanded={infoOpen}
                      aria-controls={`${id}-info`}
                      className="flex w-full items-center justify-between gap-3 text-left"
                    >
                      <span className="min-w-0">
                        <span className={mono}>BİLGİLERİNİZ</span>
                        <span className="mt-1 block truncate text-[14px] text-graphite">{who || 'Ad, firma ve not ekleyin (isteğe bağlı)'}</span>
                      </span>
                      <ChevronDown className={`size-4 shrink-0 text-muted transition-transform ${infoOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {infoOpen && (
                        <motion.div
                          id={`${id}-info`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE_CURTAIN }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-3 pt-4 sm:grid-cols-2">
                            <div>
                              <label htmlFor={`${id}-name`} className={label}>AD SOYAD</label>
                              <input id={`${id}-name`} className={field} autoComplete="name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                            </div>
                            <div>
                              <label htmlFor={`${id}-company`} className={label}>FİRMA</label>
                              <input id={`${id}-company`} className={field} autoComplete="organization" value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} />
                            </div>
                            <div className="sm:col-span-2">
                              <label htmlFor={`${id}-note`} className={label}>NOT</label>
                              <textarea
                                id={`${id}-note`}
                                className={`${field} min-h-18 resize-none`}
                                placeholder="Teslimat, tolerans, alternatif marka…"
                                value={customer.note}
                                onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
                              />
                            </div>
                          </div>
                          <p className="mt-2 text-[12px] text-muted">Ad ve firma bu cihazda hatırlanır.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="border-t border-line px-5 py-4 sm:px-6">
                    <button
                      type="button"
                      onClick={() => setPreview((p) => !p)}
                      aria-expanded={preview}
                      className="flex w-full items-center justify-between text-left"
                    >
                      <span className={mono}>GÖNDERİLECEK MESAJ</span>
                      <span className="flex items-center gap-1 text-[13px] text-graphite">
                        {preview ? 'Gizle' : 'Gör'}
                        <ChevronDown className={`size-4 text-muted transition-transform ${preview ? 'rotate-180' : ''}`} />
                      </span>
                    </button>
                    {preview && (
                      <div className="mt-3">
                        <Preview text={buildMessage()} />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="safe-b border-t border-line px-5 pt-4 sm:px-6 sm:pt-5">
                {sentAt > 0 ? (
                  <div>
                    <p className="text-[14px] leading-relaxed text-graphite">
                      Mesajınız WhatsApp’ta hazırlandı. Gönderdiyseniz yeni bir fişe başlayabilirsiniz; fiş, siz temizleyene kadar burada kalır.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={clear}
                        className="h-12 rounded-full bg-ink text-[14px] font-medium text-paper transition-colors hover:bg-accent-ink"
                      >
                        Yeni fiş başlat
                      </button>
                      <button
                        type="button"
                        onClick={sendWhatsApp}
                        className="h-12 rounded-full border border-ink/15 text-[14px] font-medium transition-colors hover:border-ink"
                      >
                        Tekrar gönder
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={sendWhatsApp}
                      className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-ink px-5 text-[15px] font-medium text-paper transition-colors hover:bg-whatsapp"
                    >
                      <Send className="size-4" />
                      WhatsApp ile gönder
                    </button>
                    <div className="mt-3 flex items-center justify-between gap-3 text-[13px]">
                      <a href={mailHref()} className="inline-flex items-center gap-1.5 text-graphite underline-offset-4 hover:text-ink hover:underline">
                        <Mail className="size-4" /> E-posta ile gönder
                      </a>
                      <button
                        type="button"
                        onClick={() => (confirmClear ? (clear(), setConfirmClear(false)) : setConfirmClear(true))}
                        className={`shrink-0 underline-offset-4 hover:underline ${confirmClear ? 'font-medium text-accent-ink' : 'text-muted hover:text-ink'}`}
                      >
                        {confirmClear ? 'Emin misiniz? Temizle' : 'Fişi temizle'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
