import { useCallback, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Mail, Minus, Plus, Send, Trash2, X } from 'lucide-react'
import { useCart } from './CartContext'
import { SITE, whatsappUrl } from '../config/site'
import { useModal, useScrollLock } from '../lib/scroll'
import { EASE_CURTAIN } from '../lib/motion'

const field =
  'w-full rounded-lg border border-line bg-paper px-3.5 py-2.5 text-[14px] outline-none transition-colors placeholder:text-muted focus:border-ink'
const label = 'mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-muted'

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, clear, buildMessage, count } = useCart()
  const [customer, setCustomer] = useState({ name: '', company: '', note: '' })
  const dialog = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLElement>(null)
  const id = useId()
  const close = useCallback(() => setOpen(false), [setOpen])

  useScrollLock(open)
  useModal(dialog, open, close, panel)

  const sendWhatsApp = () => {
    window.open(whatsappUrl(buildMessage(customer)), '_blank', 'noopener')
  }
  // WhatsApp kullanmayan (ör. masaüstündeki satın alma birimi) için aynı mesaj e-postayla
  const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent('Web sitesi sipariş / teklif talebi')}&body=${encodeURIComponent(buildMessage(customer))}`

  return (
    <AnimatePresence>
      {open && (
        <div ref={dialog} className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Sipariş sepeti">
          <motion.div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            ref={panel}
            className="absolute inset-y-0 right-0 flex w-[min(460px,100vw)] flex-col bg-paper shadow-[-30px_0_80px_rgba(15,18,21,0.12)]"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.55, ease: EASE_CURTAIN }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 sm:py-5">
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] text-muted">SEPET SİPARİŞİ</p>
                <p className="mt-1 text-[18px] font-semibold">
                  {count} <span className="font-normal text-muted">ürün</span>
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-ink"
                aria-label="Sepeti kapat"
              >
                <X className="size-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="mb-6 grid size-16 place-items-center rounded-full border border-dashed border-ink/25 font-mono text-[11px] text-muted">
                  0
                </div>
                <p className="text-[18px] font-semibold">Sepetiniz boş</p>
                <p className="mt-2 max-w-xs text-[14px] text-muted">
                  Ürün grubunu seçin, ürün kodunu ve adedi yazıp sepete ekleyin. Sonra sepeti WhatsApp ya da e-posta ile bize gönderin.
                </p>
                <Link
                  to="/urunler"
                  onClick={close}
                  className="mt-6 rounded-full bg-ink px-5 py-3 text-[14px] font-medium text-paper transition-colors hover:bg-graphite"
                >
                  Ürünlere göz atın
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto overscroll-contain">
                  <ul className="divide-y divide-line">
                    <AnimatePresence initial={false}>
                      {items.map((it, i) => (
                        <motion.li
                          key={it.id}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 24, height: 0 }}
                          className="flex gap-3 px-5 py-4 sm:gap-4 sm:px-6"
                        >
                          <span className="pt-0.5 font-mono text-[10px] text-muted">{String(i + 1).padStart(2, '0')}</span>
                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">{it.category}</p>
                            <p className="mt-1 break-words text-[15px] font-semibold">{it.code}</p>
                            {it.brand && <p className="mt-0.5 text-[13px] text-muted">{it.brand}</p>}
                            {it.note && <p className="mt-0.5 text-[13px] text-muted italic">{it.note}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center rounded-full border border-line">
                              <button
                                type="button"
                                className="grid size-10 place-items-center disabled:opacity-30 sm:size-8"
                                onClick={() => setQty(it.id, it.qty - 1)}
                                disabled={it.qty <= 1}
                                aria-label={`${it.code} adedini azalt`}
                              >
                                <Minus className="size-3.5" />
                              </button>
                              <span className="min-w-8 text-center font-mono text-[13px] tabular-nums" aria-label={`Adet ${it.qty}`}>
                                {it.qty}
                              </span>
                              <button type="button" className="grid size-10 place-items-center sm:size-8" onClick={() => setQty(it.id, it.qty + 1)} aria-label={`${it.code} adedini arttır`}>
                                <Plus className="size-3.5" />
                              </button>
                            </div>
                            <button type="button" onClick={() => remove(it.id)} className="flex items-center gap-1 text-[12px] text-muted hover:text-accent-ink">
                              <Trash2 className="size-3.5" /> Kaldır
                            </button>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <fieldset className="space-y-3 border-t border-line px-5 py-5 sm:px-6">
                    <legend className="float-left mb-1 w-full font-mono text-[10px] tracking-[0.22em] text-muted">BİLGİLERİNİZ (İSTEĞE BAĞLI)</legend>
                    <div className="clear-both">
                      <label htmlFor={`${id}-name`} className={label}>AD SOYAD</label>
                      <input id={`${id}-name`} className={field} autoComplete="name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor={`${id}-company`} className={label}>FİRMA</label>
                      <input id={`${id}-company`} className={field} autoComplete="organization" value={customer.company} onChange={(e) => setCustomer({ ...customer, company: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor={`${id}-note`} className={label}>NOT</label>
                      <textarea
                        id={`${id}-note`}
                        className={`${field} min-h-20 resize-none`}
                        placeholder="Teslimat, tolerans, alternatif marka…"
                        value={customer.note}
                        onChange={(e) => setCustomer({ ...customer, note: e.target.value })}
                      />
                    </div>
                  </fieldset>
                </div>

                <div className="safe-b border-t border-line px-5 pt-4 sm:px-6 sm:pt-5">
                  <button
                    type="button"
                    onClick={sendWhatsApp}
                    className="flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-5 py-4 text-[15px] font-medium text-paper transition-colors hover:bg-whatsapp"
                  >
                    <Send className="size-4" />
                    WhatsApp ile gönder
                  </button>
                  <a
                    href={mailHref}
                    className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-full border border-ink/15 px-5 py-3.5 text-[14px] font-medium transition-colors hover:border-ink"
                  >
                    <Mail className="size-4" />
                    E-posta ile gönder
                  </a>
                  <div className="mt-3 flex items-center justify-between gap-3 text-[12px] text-muted">
                    <span>Mesajı göndermeden önce düzenleyebilirsiniz.</span>
                    <button type="button" onClick={clear} className="shrink-0 underline-offset-2 hover:text-ink hover:underline">
                      Temizle
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
