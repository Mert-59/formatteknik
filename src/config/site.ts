/** Firma bilgileri — tek yerden yönetilir. (Kaynak: mevcut formatteknik.com.tr) */
export const SITE = {
  name: 'Format Teknik',
  /** Yayın adresi (sonda / yok) — canonical, sitemap ve index.html ile aynı olmalı */
  url: 'https://formatteknik.com.tr',
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
  /**
   * Çalışma saatleri — boş bırakılırsa sitede gösterilmez.
   * Örn. 'Hafta içi 08:30–18:00 · Cumartesi 09:00–13:00'
   */
  hours: 'Hafta içi 09.00-18.00' as string,
  /**
   * Teklif fişine ortalama dönüş süresi — boş bırakılırsa gösterilmez.
   * Fiş gönderildikten sonra "… dönüş yapıyoruz" cümlesinde kullanılır. Örn. 'aynı iş günü içinde'
   */
  replyTime: '' as string,
} as const

export const NAV = [
  { to: '/', label: 'Anasayfa' },
  { to: '/urunler', label: 'Ürünlerimiz' },
  { to: '/kurumsal', label: 'Kurumsal' },
  { to: '/iletisim', label: 'İletişim' },
] as const

export const whatsappUrl = (text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`
