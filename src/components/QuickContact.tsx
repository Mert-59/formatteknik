import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageCircle, Phone } from 'lucide-react'
import { SITE, whatsappUrl } from '../config/site'
import { useCart } from '../cart/CartContext'
import { useTyping } from '../lib/typing'
import { useIntro } from '../lib/introState'
import { usePresence } from '../lib/presence'

/**
 * Telefonda hızlı iletişim: sağ altta "Ara | WhatsApp" hapı (fiş boşken; fişte kalem varsa yerini CartBar alır).
 * Kalabalık yapmasın diye gizlendiği durumlar:
 *  - ilk ekran kaydırılmadan (açılış ekranı kendi düğmeleriyle)  - İletişim sayfasında
 *  - altbilgi görünürken (telefon ve e-posta orada)               - bir alana yazarken (klavye açık)
 *  - fiş çekmecesi ya da giriş animasyonu açıkken
 */
export default function QuickContact() {
  const { count, open } = useCart()
  const { phase } = useIntro()
  const { pathname } = useLocation()
  const typing = useTyping()
  const [scrolled, setScrolled] = useState(false)
  const [footer, setFooter] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    const el = document.querySelector('footer')
    if (!el) return
    const io = new IntersectionObserver(([e]) => setFooter(e.isIntersecting), { rootMargin: '0px 0px -10% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [pathname])

  const show = count === 0 && !open && !typing && phase === 'done' && scrolled && !footer && pathname !== '/iletisim'
  const pill = usePresence(show, 500)
  if (!pill.mounted) return null

  return (
    <nav
      aria-label="Hızlı iletişim"
      data-state={pill.state}
      className="fixed bottom-0 right-0 z-20 pb-[max(1rem,env(safe-area-inset-bottom))] pr-[max(1rem,env(safe-area-inset-right))] transition-[translate,opacity] duration-500 ease-out-expo data-[state=closed]:translate-y-[140%] data-[state=closed]:opacity-0 lg:hidden"
    >
      <div className="flex h-12 items-center overflow-hidden rounded-full bg-ink text-[13px] font-medium text-paper shadow-[0_12px_40px_rgba(15,18,21,0.25)]">
        <a href={SITE.phoneHref} className="flex h-full items-center gap-2 pl-4 pr-3.5 transition-colors active:bg-white/10" aria-label={`Ara: ${SITE.phoneDisplay}`}>
          <Phone className="size-4" /> Ara
        </a>
        <span aria-hidden className="h-5 w-px bg-paper/25" />
        <a
          href={whatsappUrl(`Merhaba ${SITE.name}, bilgi almak istiyorum.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-full items-center gap-2 pl-3.5 pr-4 transition-colors active:bg-whatsapp"
          aria-label="WhatsApp ile yazın (yeni sekmede açılır)"
        >
          <MessageCircle className="size-4" /> WhatsApp
        </a>
      </div>
    </nav>
  )
}
