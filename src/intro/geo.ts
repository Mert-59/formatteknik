import * as THREE from 'three'
import raw from './data/tr-provinces.json'

/**
 * İl verisi: n = il adı, p = poligonlar → halkalar (ilk halka dış sınır) → [boylam, enlem]
 * Kaynak: cihadturhan/tr-geojson (81 il), 4 ondalığa yuvarlanmış, doğudan batıya sıralı.
 */
export type Province = { n: string; p: number[][][][] }
export const PROVINCES = raw as Province[]

export const TARGET_PROVINCE = 'Tekirdağ'

/**
 * Tekirdağ poligonunun içine sığan en büyük 4.2:1 dikdörtgen (harita düzleminde).
 * Izgara + ikili arama ile hesaplandı; yazı plakası buraya, %90 boyutla yerleşir.
 */
export const PLATE = { x: -7.8392, y: 2.7105, angleDeg: 16, maxWidth: 1.2843 }

const DEG = Math.PI / 180
const LON0 = 35.25 // Türkiye'nin boylam merkezi
const LAT0 = 39.0 // Türkiye'nin enlem merkezi
const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * DEG) / 2)) / DEG
const MERC0 = merc(LAT0)

/** Boylam/enlem → harita düzlemi (x: doğu, y: kuzey). 1 birim ≈ 1 boylam derecesi (Mercator). */
export function project(lon: number, lat: number): [number, number] {
  return [lon - LON0, merc(lat) - MERC0]
}

export function unproject(x: number, y: number): [number, number] {
  const lat = (2 * Math.atan(Math.exp((y + MERC0) * DEG)) - Math.PI / 2) / DEG
  return [x + LON0, lat]
}

/** 39° enlemde 1 harita birimi ≈ 86 km */
export const KM_PER_UNIT = 111.32 * Math.cos(LAT0 * DEG)

export function provinceShapes(pr: Province): THREE.Shape[] {
  const toV = (ring: number[][]) => ring.map(([lon, lat]) => new THREE.Vector2(...project(lon, lat)))
  return pr.p.map(([outer, ...holes]) => {
    const shape = new THREE.Shape(toV(outer))
    for (const h of holes) shape.holes.push(new THREE.Path(toV(h)))
    return shape
  })
}

/** Tüm halkaları LineSegments için (x, y, z) çiftlerine çevirir; z yerel yüksekliktir. */
export function ringSegments(pr: Province, z: number, out: number[] = []): number[] {
  for (const poly of pr.p) {
    for (const ring of poly) {
      for (let i = 0; i < ring.length; i++) {
        const [ax, ay] = project(ring[i][0], ring[i][1])
        const b = ring[(i + 1) % ring.length]
        const [bx, by] = project(b[0], b[1])
        out.push(ax, ay, z, bx, by, z)
      }
    }
  }
  return out
}

/* ---------- Nokta hangi ilde? (HUD'daki canlı "KONUM" göstergesi) ---------- */

type Indexed = { name: string; box: [number, number, number, number]; rings: number[][][] }

const INDEX: Indexed[] = PROVINCES.map((pr) => {
  const rings = pr.p.map((poly) => poly[0])
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const r of rings)
    for (const [x, y] of r) {
      if (x < x0) x0 = x
      if (y < y0) y0 = y
      if (x > x1) x1 = x
      if (y > y1) y1 = y
    }
  return { name: pr.n, box: [x0, y0, x1, y1], rings }
})

function inRing(x: number, y: number, ring: number[][]) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

export function provinceAt(lon: number, lat: number): string | null {
  for (const p of INDEX) {
    const [x0, y0, x1, y1] = p.box
    if (lon < x0 || lon > x1 || lat < y0 || lat > y1) continue
    for (const r of p.rings) if (inRing(lon, lat, r)) return p.name
  }
  return null
}

export function placeName(lon: number, lat: number): string {
  const p = provinceAt(lon, lat)
  if (p) return p
  if (lon > 26.5 && lon < 29.9 && lat > 40.3 && lat < 41.05) return 'Marmara Denizi'
  return '—'
}
