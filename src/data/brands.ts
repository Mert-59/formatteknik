/**
 * Markalarımız.
 *
 * LOGO EKLEMEK İÇİN: logo dosyasını (tercihen SVG, yoksa şeffaf zeminli PNG; boşlukları kırpılmış)
 * `public/brands/` klasörüne koyun ve ilgili satıra yazın:
 *   logo:  '/brands/dosya-adi.svg'
 *   ratio: genişlik / yükseklik (ör. 300×100 px → 3). Logolar bu orana göre eşit görsel
 *          ağırlıkta boyutlanır: kare amblemler küçülür, uzun yazılar uzar.
 *   caption: true → yalnızca amblem olan logolarda marka adı altına küçük yazılır.
 * Logo yoksa marka adı tipografik olarak gösterilir.
 */
export type Brand = { name: string; logo?: string; ratio?: number; caption?: boolean }

export const BRANDS: Brand[] = [
  { name: 'Mitsubishi', logo: '/brands/mitsubishi.png', ratio: 278 / 240, caption: true },
  { name: 'OSG', logo: '/brands/osg.png', ratio: 301 / 300 },
  { name: 'Mitutoyo', logo: '/brands/mitutoyo.svg', ratio: 171.158 / 42.974 },
  { name: 'Morrisflex', logo: '/brands/morrisflex.png', ratio: 184 / 32 },
  { name: 'Karnasch', logo: '/brands/karnasch.png', ratio: 310 / 49 },
  { name: 'Carmon', logo: '/brands/carmon.png', ratio: 155 / 45 },
  { name: 'TEMAK', logo: '/brands/temak.png', ratio: 326 / 104 },
  { name: 'SANOWA', logo: '/brands/sanowa.svg', ratio: 496 / 156.44 },
  { name: 'STARTOOL', logo: '/brands/startool.png', ratio: 250 / 23 },
  { name: 'Format', logo: '/brands/format.png', ratio: 576 / 162 },
]
