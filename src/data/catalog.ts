/**
 * Ürün grupları — eski sitedeki 9 kategori + 23 Kasım 2026'da eklenen 3 grup (CNC Torna Aynası, Pens Tutucular, Kater Tarama Kafası).
 * `drawing`: components/ToolDrawing.tsx içindeki teknik çizimin anahtarı.
 */
export type Category = {
  slug: string
  name: string
  short: string
  description: string
  example: string // ürün kodu alanı için örnek
  drawing: DrawingKey
}

export type DrawingKey =
  | 'insert' | 'facemill' | 'tap' | 'carbideDrill' | 'endmill'
  | 'micrometer' | 'hssDrill' | 'shrink' | 'collet'
  | 'chuck' | 'colletChuck' | 'faceHead'

export const CATEGORIES: Category[] = [
  {
    slug: 'torna-uclari',
    name: 'Torna Uçları',
    short: 'Tornalama için değiştirilebilir kesici uçlar.',
    description: 'Dış çap, iç çap, kanal ve diş tornalama operasyonları için farklı geometri ve kalitede takma uçlar.',
    example: 'Örn. CNMG 120408',
    drawing: 'insert',
  },
  {
    slug: 'takma-uclu-freze',
    name: 'Takma Uçlu Freze',
    short: 'Alın, omuz ve kopya frezeleme gövdeleri.',
    description: 'Değiştirilebilir uç kullanan freze gövdeleri ve bu gövdelere uygun kesici uçlar.',
    example: 'Örn. Ø63 alın frezesi',
    drawing: 'facemill',
  },
  {
    slug: 'kilavuz',
    name: 'Kılavuz',
    short: 'Makine ve el kılavuzları, diş açma.',
    description: 'Kör ve boydan boya delikler için farklı malzemelere uygun makine kılavuzları.',
    example: 'Örn. M8x1.25 makine kılavuzu',
    drawing: 'tap',
  },
  {
    slug: 'karbur-matkap',
    name: 'Karbür Matkap',
    short: 'Yüksek hızlı, hassas delik delme.',
    description: 'Soğutma kanallı ve kanalsız, farklı boy oranlarında karbür matkaplar.',
    example: 'Örn. Ø8,5 5xD',
    drawing: 'carbideDrill',
  },
  {
    slug: 'karbur-freze',
    name: 'Karbür Freze',
    short: 'Parmak frezeler ve özel geometriler.',
    description: 'Kaba ve hassas işleme için düz, küre ve köşe radyüslü karbür parmak frezeler.',
    example: 'Örn. Ø10 4 ağız',
    drawing: 'endmill',
  },
  {
    slug: 'olcu-aletleri',
    name: 'Ölçü Aletleri',
    short: 'Mikrometre, kumpas ve hassas ölçüm.',
    description: 'Mikrometre, kumpas, komparatör ve diğer hassas ölçüm cihazları.',
    example: 'Örn. 0–25 mm dijital mikrometre',
    drawing: 'micrometer',
  },
  {
    slug: 'hss-matkap',
    name: 'HSS Matkap',
    short: 'Genel amaçlı yüksek hız çeliği matkaplar.',
    description: 'Silindirik ve konik saplı, farklı kaplamalara sahip HSS matkaplar.',
    example: 'Örn. Ø6 HSS-Co',
    drawing: 'hssDrill',
  },
  {
    slug: 'shrink-fit-holder',
    name: 'Shrink-Fit Holder',
    short: 'Isıl sıkma takım tutucular.',
    description: 'Yüksek eş merkezlilik ve rijitlik sağlayan ısıl sıkma (shrink-fit) takım tutucular.',
    example: 'Örn. BT40 Ø12',
    drawing: 'shrink',
  },
  {
    slug: 'pens-kayar-otomat',
    name: 'Pens Kayar Otomat',
    short: 'Kayar otomat tezgâhları için pensler.',
    description: 'Kayar otomat (swiss-type) tezgâhlar için ana ve karşı iş mili pensleri.',
    example: 'Örn. Ø12 ana iş mili pensi',
    drawing: 'collet',
  },
  {
    slug: 'cnc-torna-aynasi',
    name: 'CNC Torna Aynası',
    short: 'Hidrolik ve üniversal torna aynaları.',
    description: 'CNC torna tezgâhları için hidrolik ve üniversal aynalar, sert ve yumuşak ayaklar, flanşlar ve puntalar.',
    example: 'Örn. 210 mm 3 ayaklı hidrolik ayna',
    drawing: 'chuck',
  },
  {
    slug: 'pens-tutucular',
    name: 'Pens Tutucular',
    short: 'ER pens başlıkları ve pensler.',
    description: 'BT, SK ve ISO bağlantılı ER ve OZ pens başlıkları, pensler ve somunlar.',
    example: 'Örn. BT40 ER32',
    drawing: 'colletChuck',
  },
  {
    slug: 'kater-tarama-kafasi',
    name: 'Kater Tarama Kafası',
    short: 'Torna katerleri ve tarama kafaları.',
    description: 'Torna katerleri, tarama (alın frezeleme) kafaları, delik büyütme kafaları ve baraları.',
    example: 'Örn. PCLNR 2525 M12',
    drawing: 'faceHead',
  },
]
