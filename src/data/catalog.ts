/**
 * Ürün grupları — mevcut sitedeki 9 kategori.
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
]
