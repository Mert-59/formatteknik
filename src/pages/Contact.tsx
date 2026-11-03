import type { ReactNode } from 'react'
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import PageHero from '../components/PageHero'
import { SITE, whatsappUrl } from '../config/site'
import { useCart } from '../cart/CartContext'

function Card({ icon, label, children, href, cta, external }: { icon: ReactNode; label: string; children: ReactNode; href: string; cta: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex flex-col justify-between gap-10 bg-paper p-6 transition-colors duration-500 hover:bg-mist md:p-8"
    >
      <div className="flex items-center justify-between">
        <span className="grid size-11 place-items-center rounded-full border border-line text-ink">{icon}</span>
        <ArrowUpRight className="size-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>
      <div>
        <p className="font-mono text-[10px] tracking-[0.22em] text-muted">{label}</p>
        <div className="mt-3 text-[18px] font-semibold leading-snug md:text-[20px]">{children}</div>
        <p className="mt-4 text-[13px] text-muted group-hover:text-ink">{cta}</p>
      </div>
    </a>
  )
}

export default function Contact() {
  const { setOpen, count } = useCart()
  return (
    <>
      <PageHero
        label="İLETİŞİM"
        title={<>Bize ulaşın<span className="text-accent">.</span></>}
        text="Teklif, sipariş ya da doğru takımı seçmek için bize telefonla, WhatsApp’tan veya e-postayla ulaşabilirsiniz."
      />

      <section className="mx-auto max-w-[1440px] px-5 pb-16 md:px-10">
        <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          <Card icon={<Phone className="size-4" />} label="TELEFON" href={SITE.phoneHref} cta="Hemen arayın">
            {SITE.phoneDisplay}
          </Card>
          <Card icon={<MessageCircle className="size-4" />} label="WHATSAPP" href={whatsappUrl(`Merhaba ${SITE.name}, bilgi almak istiyorum.`)} cta="Mesaj gönderin" external>
            {SITE.phoneDisplay}
          </Card>
          <Card icon={<Mail className="size-4" />} label="E-POSTA" href={`mailto:${SITE.email}`} cta="E-posta yazın">
            <span className="break-all">{SITE.email}</span>
          </Card>
          <Card icon={<MapPin className="size-4" />} label="ADRES" href={SITE.mapsUrl} cta="Yol tarifi alın" external>
            <span className="text-[15px] font-medium md:text-[16px]">{SITE.address}</span>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-ink p-8 text-paper md:flex-row md:items-center md:p-12">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-paper/60">SEPET SİPARİŞİ</p>
            <p className="mt-3 max-w-xl font-wide text-[clamp(24px,2.6vw,36px)] font-semibold leading-tight tracking-[-0.02em]">
              Birden fazla ürün mü arıyorsunuz? Sepet oluşturup tek mesajla gönderin.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="shrink-0 rounded-full bg-paper px-6 py-4 text-[15px] font-medium text-ink transition-colors hover:bg-accent hover:text-white"
          >
            Sepeti aç {count > 0 && `(${count})`}
          </button>
        </div>
      </section>
    </>
  )
}
