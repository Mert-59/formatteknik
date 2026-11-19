import { ArrowRight } from 'lucide-react'
import { useCart } from './CartContext'
import { usePresence } from '../lib/presence'
import { useIntro } from '../lib/introState'
import { useTyping } from '../lib/typing'

/**
 * Telefonda fiş her sayfada bir dokunuş uzakta: fişte kalem varsa altta ince bir çubuk.
 * Masaüstünde başlıktaki düğme ve ürünler sayfasındaki yan panel bu işi görür.
 */
export default function CartBar() {
  const { count, units, open, orderNo, sentAt, openedAt, openCart } = useCart()
  const { phase } = useIntro()
  const typing = useTyping()
  const show = count > 0 && !open && !typing && phase === 'done'
  const bar = usePresence(show, 600) // alttan kayarak gelir, inerken animasyon bitince kalkar

  return (
    <>
      {/* çubuk sayfa sonunu örtmesin */}
      {count > 0 && <div aria-hidden className="h-20 lg:hidden" />}
      {bar.mounted && (
          <div
            data-state={bar.state}
            className="safe-x safe-b fixed inset-x-0 bottom-0 z-20 pt-3 transition-transform duration-600 ease-out-expo data-[state=closed]:translate-y-[120%] lg:hidden"
          >
            <button
              type="button"
              onClick={() => openCart()}
              className="flex h-14 w-full items-center justify-between gap-3 rounded-full bg-ink pl-5 pr-2 text-paper shadow-[0_12px_40px_rgba(15,18,21,0.25)]"
            >
              <span className="min-w-0 text-left">
                <span className="block truncate whitespace-nowrap font-mono text-[9.5px] tracking-[0.14em] text-paper/55">
                  {sentAt ? 'GÖNDERİLDİ' : openedAt ? 'ONAYINIZ BEKLENİYOR' : 'TEKLİF FİŞİ'} · {orderNo}
                </span>
                <span className="block text-[14px] font-medium">
                  {count} kalem <span className="text-paper/60">· {units} adet</span>
                </span>
              </span>
              <span className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-paper px-4 text-[13px] font-medium text-ink">
                {sentAt ? 'Fişi gör' : openedAt ? 'Onayla' : 'Gönder'} <ArrowRight className="size-4" />
              </span>
            </button>
          </div>
        )}
    </>
  )
}
