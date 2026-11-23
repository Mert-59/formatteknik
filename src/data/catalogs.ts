/**
 * PDF kataloglar — ürün grubu sayfalarında ve /kataloglar sayfasında gösterilir.
 *
 * Kaynak: eski sitedeki (formatteknik.com.tr/tr/urunler) kataloglar, 8 Kasım 2026.
 * 18 Kasım 2026 güncellemesi (proje klasöründeki Kataloglar/ — sıkıştırılmamış asıllar, git'e girmez):
 * Carmon (Multi Purpose Taps 2024–2025) ve Format HSS (yeni baskı) değişti, Mitsubishi diş uçları (MMT) eklendi.
 * Klasördeki Mitsubishi ×4, Mitutoyo ve Format kılavuz sitedekilerle aynı içerikte (sayfa sayfa karşılaştırıldı).
 * 23 Kasım 2026: Boomerang Carbide (Karbür Freze), ASIMETO (Ölçü Aletleri) eklendi; Pens Kayar Otomat'ta Gisstec yerine Schlenker;
 * yeni gruplar CNC Torna Aynası (AUTOGRIP, TUMA), Pens Tutucular (Kraft), Kater Tarama Kafası (Teknik, AKKO, SMOXH).
 * Sıkıştırma ancak belirgin kazanç varsa uygulandı; Schlenker, TUMA, Teknik ve SMOXH asıllarıyla duruyor
 * (Teknik'te Ghostscript bir yazı tipini hatalı çizdiği için sıkıştırılmadı).
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
    { id: 'mitsubishi-dis-uclari', title: 'MMT Vida Açma Serisi — Diş Tornalama Uçları', brand: 'Mitsubishi Materials', pages: 48, lang: 'Türkçe' },
  ],
  'takma-uclu-freze': [
    { id: 'mitsubishi-takma-uclu-freze', title: 'Takma Uçlu Frezeleme Takımları', brand: 'Mitsubishi Materials', pages: 386, lang: 'Türkçe' },
  ],
  kilavuz: [
    { id: 'format-kilavuz', title: 'Makine Kılavuzları — DIN 371 / 376', brand: 'Format', pages: 33, lang: 'Türkçe' },
    { id: 'sanowa-kilavuz-eco', title: 'Kılavuz Kampanya Kataloğu 2025 (Eco)', brand: 'SANOWA', pages: 8, lang: 'İngilizce' },
    { id: 'carmon-kilavuz', title: 'Çok Amaçlı Kılavuzlar — Katalog 2024–2025', brand: 'Carmon', pages: 20, lang: 'İtalyanca / İngilizce' },
  ],
  'karbur-matkap': [
    { id: 'mitsubishi-karbur-matkap', title: 'Delme Takımları Genel Kataloğu 2025–2027', brand: 'Mitsubishi Materials', pages: 259, lang: 'Türkçe' },
  ],
  'karbur-freze': [
    { id: 'mitsubishi-frezeleme', title: 'MS Plus Yekpare Karbür Parmak Frezeler', brand: 'Mitsubishi Materials', pages: 96, lang: 'Türkçe' },
    { id: 'boomerang-karbur-freze', title: 'Karbür Parmak Frezeler ve Matkaplar — 2026 Katalog', brand: 'Boomerang Carbide', pages: 164, lang: 'Türkçe' },
  ],
  'olcu-aletleri': [
    { id: 'mitutoyo-olcu-aletleri', title: 'Genel Katalog 2019', brand: 'Mitutoyo', pages: 631, lang: 'Fransızca' },
    { id: 'asimeto-olcu-aletleri', title: 'Hassas Ölçü Aletleri', brand: 'ASIMETO', pages: 85, lang: 'Türkçe' },
  ],
  'hss-matkap': [
    { id: 'format-hss-matkap', title: 'Taşlanmış HSS Matkaplar — DIN 338', brand: 'Format', pages: 13, lang: 'Türkçe' },
    { id: 'izar-hss-matkap', title: 'Taşlanmış Ekstra Uzun Matkap — DIN 1869', brand: 'IZAR', pages: 1, lang: 'Türkçe', note: 'Tek sayfalık ürün föyü' },
  ],
  'pens-kayar-otomat': [
    { id: 'schlenker-kayar-otomat', title: 'Pensler ve Kılavuz Burçları', brand: 'Schlenker', pages: 136, lang: 'İngilizce' },
  ],
  'cnc-torna-aynasi': [
    { id: 'autogrip-hidrolik-ayna', title: 'Hidrolik Aynalar', brand: 'AUTOGRIP', pages: 6, lang: 'Türkçe', note: 'Ürün föyü' },
    { id: 'tuma-torna-aynasi', title: 'Hidrolik ve Üniversal Aynalar, Puntalar', brand: 'TUMA', pages: 48, lang: 'Türkçe / İngilizce' },
  ],
  'pens-tutucular': [
    { id: 'kraft-pens-tutucular', title: 'Pens Başlıkları ve Pensler', brand: 'Kraft Werkzeuge', pages: 52, lang: 'Türkçe' },
  ],
  'kater-tarama-kafasi': [
    { id: 'teknik-genel-katalog', title: 'Genel Katalog 2026 — Kater, Tarama ve Delik Büyütme', brand: 'Teknik Cutting Tools', pages: 194, lang: 'Türkçe / İngilizce' },
    { id: 'akko-takim-katalogu', title: 'Takım Kataloğu 2026', brand: 'AKKO', pages: 510, lang: 'Türkçe / İngilizce / Almanca' },
    { id: 'smoxh-genel-katalog', title: 'Genel Ürün Kataloğu 2026', brand: 'SMOXH', pages: 542, lang: 'İngilizce' },
  ],
}

/** Bu boyutun (MB) üstündeki PDF'lerin kartında "Wi-Fi önerilir" notu çıkar: telefonda mobil veriyle açılmasın. */
export const LARGE_PDF_MB = 40

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
