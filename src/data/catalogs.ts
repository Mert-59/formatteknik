/**
 * PDF kataloglar — ürün grubu sayfalarında ve /kataloglar sayfasında gösterilir.
 *
 * Kaynak: eski sitedeki (formatteknik.com.tr/tr/urunler) kataloglar, 8 Kasım 2026.
 * Büyük dosyalar ekran okuması için Ghostscript ile sıkıştırıldı (/ebook, görseller 150 dpi);
 * metin ve çizimler vektörel kaldı.
 *
 * KATALOG EKLEMEK İÇİN:
 *  1. PDF'i public/kataloglar/ klasörüne koyun (kısa, Türkçe karaktersiz ad: marka-konu.pdf)
 *  2. Kapak görseli: public/kataloglar/kapak/<aynı-ad>.jpg (ilk sayfa, ~500 px genişlik)
 *  3. Aşağıda ilgili grubun listesine bir satır ekleyin; `pages` dosyanın gerçek sayfa sayısı olmalı.
 *     Dosya boyutu elle yazılmaz: derlemede dosyadan okunur (vite.config.ts → catalogSizes).
 *  `npm run build`, listedeki bir kataloğun PDF'i ya da kapağı yoksa hata verir (scripts/prerender.mjs) —
 *  sitede kırık katalog bağlantısı yayına çıkmaz.
 * Bir grubun listesi boşsa (ya da grup hiç yoksa) o grupta katalog bölümü gösterilmez.
 */

import sizes from 'virtual:catalog-sizes'

export type Catalog = {
  /** public/kataloglar/ altındaki dosya adı (uzantısız), ör. 'mitsubishi-tornalama' — PDF ve kapak bu adla bulunur */
  id: string
  title: string
  brand: string
  pages: number
  /** Katalog dili, ör. 'Türkçe', 'İngilizce / İtalyanca' */
  lang: string
  /** İsteğe bağlı kısa not (ör. "Tek sayfalık ürün föyü") */
  note?: string
}

export const CATALOGS: Record<string, Catalog[]> = {
  'torna-uclari': [
    { id: 'mitsubishi-tornalama', title: 'Tornalama Takımları', brand: 'Mitsubishi Materials', pages: 656, lang: 'Türkçe' },
  ],
  'takma-uclu-freze': [
    { id: 'mitsubishi-takma-uclu-freze', title: 'Takma Uçlu Frezeleme Takımları', brand: 'Mitsubishi Materials', pages: 386, lang: 'Türkçe' },
  ],
  kilavuz: [
    { id: 'format-kilavuz', title: 'Makine Kılavuzları — DIN 371 / 376', brand: 'Format', pages: 33, lang: 'Türkçe' },
    { id: 'sanowa-kilavuz-eco', title: 'Kılavuz Kampanya Kataloğu 2025 (Eco)', brand: 'SANOWA', pages: 8, lang: 'İngilizce' },
    { id: 'carmon-kilavuz', title: 'Synchro Kılavuzlar — Yeni Ürünler 2024', brand: 'Carmon', pages: 12, lang: 'İtalyanca / İngilizce' },
  ],
  'karbur-matkap': [
    { id: 'mitsubishi-karbur-matkap', title: 'Delme Takımları Genel Kataloğu 2025–2027', brand: 'Mitsubishi Materials', pages: 259, lang: 'Türkçe' },
  ],
  'karbur-freze': [
    { id: 'mitsubishi-frezeleme', title: 'MS Plus Yekpare Karbür Parmak Frezeler', brand: 'Mitsubishi Materials', pages: 96, lang: 'Türkçe' },
  ],
  'olcu-aletleri': [
    { id: 'mitutoyo-olcu-aletleri', title: 'Genel Katalog 2019', brand: 'Mitutoyo', pages: 631, lang: 'Fransızca' },
  ],
  'hss-matkap': [
    { id: 'format-hss-matkap', title: 'Taşlanmış HSS Matkaplar — DIN 338', brand: 'Format', pages: 15, lang: 'Türkçe' },
    { id: 'izar-hss-matkap', title: 'Taşlanmış Ekstra Uzun Matkap — DIN 1869', brand: 'IZAR', pages: 1, lang: 'Türkçe', note: 'Tek sayfalık ürün föyü' },
  ],
  'pens-kayar-otomat': [
    { id: 'pens-kayar-otomat', title: 'Kayar Otomat Bağlama Takımları', brand: 'Gisstec', pages: 66, lang: 'Almanca / İngilizce' },
  ],
}

/** Gerçek dosya boyutu (MB) — derlemede public/kataloglar/'dan okunur; dosya yoksa 0 (derleme zaten hata verir) */
export const catalogSizeMB = (c: Catalog) => (sizes[c.id] ?? 0) / 1048576

export const catalogPdf = (c: Catalog) => `/kataloglar/${c.id}.pdf`
export const catalogCover = (c: Catalog) => `/kataloglar/kapak/${c.id}.jpg`
/** İndirilen dosyanın adı: "Format Teknik - Mitsubishi Materials - Tornalama Takımları.pdf" */
export const catalogFileName = (c: Catalog) => `Format Teknik - ${c.brand} - ${c.title.replace(/[—/]/g, '-')}.pdf`
/** 0.6 → "614 KB", 24.3 → "24,3 MB" */
export function formatSize(mb: number) {
  if (mb < 1) return `${Math.max(1, Math.round(mb * 1024)).toLocaleString('tr-TR')} KB`
  return `${mb.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MB`
}

/** Tüm kataloglar (sayfa sayısı ve toplam için) */
export const ALL_CATALOGS = Object.values(CATALOGS).flat()
