/** Firma bilgileri — tek yerden yönetilir. (Kaynak: mevcut formatteknik.com.tr) */
export const SITE = {
  name: 'Format Teknik',
  city: 'Çorlu / Tekirdağ',
  address: 'Çobançeşme Mah. Bülent Ecevit Bulvarı, Arka İnşaat B Blok No: 207 D, Çorlu / Tekirdağ',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Çobançeşme Mah. Bülent Ecevit Bulvarı No: 207 D Çorlu Tekirdağ'),
  phoneDisplay: '+90 544 601 85 38',
  phoneHref: 'tel:+905446018538',
  /** WhatsApp numarası: ülke kodu ile, boşluksuz, + olmadan */
  whatsapp: '905446018538',
  email: 'info@formatteknik.com.tr',
} as const

export const NAV = [
  { to: '/', label: 'Anasayfa' },
  { to: '/urunler', label: 'Ürünlerimiz' },
  { to: '/kurumsal', label: 'Kurumsal' },
  { to: '/iletisim', label: 'İletişim' },
] as const

export const whatsappUrl = (text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
