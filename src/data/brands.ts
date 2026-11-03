/**
 * Markalarımız.
 *
 * LOGO EKLEMEK İÇİN: logo dosyasını (tercihen SVG, yoksa şeffaf PNG)
 * `public/brands/` klasörüne koyun ve ilgili satıra `logo: '/brands/dosya-adi.svg'` yazın.
 * Logo yoksa marka adı tipografik olarak gösterilir.
 */
export type Brand = { name: string; logo?: string }

export const BRANDS: Brand[] = [
  { name: 'Mitsubishi' },
  { name: 'OSG' },
  { name: 'Mitutoyo' },
  { name: 'Morrisflex' },
  { name: 'Karnasch' },
  { name: 'Carmon' },
  { name: 'TEMAK' },
  { name: 'SANOWA' },
  { name: 'STARTOOL' },
  { name: 'Format' },
]
