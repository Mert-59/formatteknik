/** Haritada aranan adres (yol tarifi bağlantısı ve gömülü harita aynı noktayı göstersin) */
const MAP_QUERY = 'Çobançeşme Mah. Bülent Ecevit Bulvarı No: 207 D Çorlu Tekirdağ'

/** Firma bilgileri — tek yerden yönetilir. (Kaynak: mevcut formatteknik.com.tr) */
export const SITE = {
  name: 'Format Teknik',
  /** Yayın adresi (sonda / yok) — canonical, sitemap ve index.html ile aynı olmalı */
  url: 'https://formatteknik.com.tr',
  city: 'Çorlu / Tekirdağ',
  address: 'Çobançeşme Mah. Bülent Ecevit Bulvarı, Arka İnşaat B Blok No: 207 D, Çorlu / Tekirdağ',
  /** "Yol tarifi al" — Google Haritalar'da açılır */
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(MAP_QUERY),
  /**
   * İletişim sayfasındaki gömülü harita (API anahtarı gerekmez). Ziyaretçi "Haritayı göster"e basınca yüklenir.
   * Google İşletme profiliniz varsa: Google Haritalar'da işletmenizi açın → Paylaş → "Harita yerleştir" →
   * çıkan kodun içindeki src="…" adresini buraya yapıştırın; işaret tam yerinizi ve firma adını gösterir.
   */
  mapsEmbedUrl: ('https://www.google.com/maps?q=' + encodeURIComponent(MAP_QUERY) + '&hl=tr&z=16&output=embed') as string,
  phoneDisplay: '+90 544 601 85 38',
  phoneHref: 'tel:+905446018538',
  /** WhatsApp numarası: ülke kodu ile, boşluksuz, + olmadan */
  whatsapp: '905446018538',
  email: 'info@formatteknik.com.tr',
  /** Instagram — mobil menüde, altbilgide ve İletişim sayfasında görünür */
  instagram: 'https://www.instagram.com/formatteknik/',
  instagramHandle: '@formatteknik',
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

/** Ürün grubu sayfasının adresi, ör. /urunler/torna-uclari */
export const categoryPath = (slug: string) => `/urunler/${slug}`

export const whatsappUrl =(text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`

/**
 * "Fotoğrafla sor": WhatsApp'ı hazır metinle açar; fotoğrafı müşteri sohbete kendisi ekler
 * (wa.me bağlantıları dosya taşıyamaz). Fişte kalem varsa fiş numarası da yazılır.
 */
export const photoWhatsappUrl = (orderNo?: string) =>
  whatsappUrl(`Merhaba ${SITE.name}, kodunu bilmediğim bir takım için fotoğraf gönderiyorum.${orderNo ? ` (Fiş ${orderNo})` : ''}`)
