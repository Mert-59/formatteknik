/**
 * Amblem üretici: firma logosundan (Formatlogo.pdf, Illustrator vektörü) yazısız amblemi çıkarır →
 * src/components/emblem-paths.ts. Logo değişirse yeniden çalıştırın:
 *
 *   node scripts/emblem.mjs ../Formatlogo.pdf
 *
 * Logodaki dişlinin ortası yazı bandı için açıktır; döndürülebilsin diye dişli, logodaki ölçülerle TAM çark olarak
 * yeniden kurulur (16 oyuk, 22,5° aralık, biri tepede). İş mili, parmak freze ve soğutma hortumu logodaki yollardır.
 * Küçük boyut düzeltmesi ("mark"): dişli bandı ile iç halka tek kalın banda birleşir, oyuklar %40 büyür,
 * takım grubu çemberin içini dikey dolduracak kadar (×1,25) büyür; hortum çizilmez (küçükte saat ibresi gibi okunuyordu).
 *
 * Yalnızca bu logonun kullandığı PDF işleçleri desteklenir (m l c v y h re f f* S n q Q cm k).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'
import { fileURLToPath } from 'node:url'

const pdfPath = process.argv[2]
if (!pdfPath) throw new Error('Kullanım: node scripts/emblem.mjs <Formatlogo.pdf>')
const out = fileURLToPath(new URL('../src/components/emblem-paths.ts', import.meta.url))

/* ---------------------------------------------------- 1) PDF içerik akışı → yollar */
const buf = readFileSync(pdfPath)
const raw = buf.toString('latin1')
let content = ''
for (const m of raw.matchAll(/<<([^]*?)>>\s*stream\r?\n/g)) {
  const start = m.index + m[0].length
  const data = buf.subarray(start, raw.indexOf('endstream', start))
  if (!/FlateDecode/.test(m[1]) || /ASCII85/.test(m[1])) continue
  let txt
  try {
    txt = inflateSync(data).toString('latin1')
  } catch {
    continue
  }
  // çizim işleçleri en çok olan akış sayfa içeriğidir
  if ((txt.match(/ c\r?\n/g) ?? []).length > (content.match(/ c\r?\n/g) ?? []).length) content = txt
}
if (!content) throw new Error('PDF içinde çizim akışı bulunamadı')

const H = 841.89 // sayfa yüksekliği (y ekseni çevrilir)
const mul = (a, b) => [a[0] * b[0] + a[1] * b[2], a[0] * b[1] + a[1] * b[3], a[2] * b[0] + a[3] * b[2], a[2] * b[1] + a[3] * b[3], a[4] * b[0] + a[5] * b[2] + b[4], a[4] * b[1] + a[5] * b[3] + b[5]]
const cmyk = (c, m, y, k) => [c, m, y].map((v) => Math.round(255 * (1 - v) * (1 - k)).toString(16).padStart(2, '0')).join('')
let ctm = [1, 0, 0, 1, 0, 0]
let color = ''
let ops = []
let d = []
let cur = [0, 0]
let start = [0, 0]
const stack = []
const shapes = [] // { color, pts: [[x,y]...] (mutlak), cmds }
const P = (x, y) => [ctm[0] * x + ctm[2] * y + ctm[4], H - (ctm[1] * x + ctm[3] * y + ctm[5])]
for (const t of content.match(/\/[^\s/[\]()<>]+|[-+]?\d*\.?\d+|[A-Za-z*'"]+/g)) {
  if (/^[-+]?\d*\.?\d+$/.test(t)) {
    ops.push(+t)
    continue
  }
  const a = ops
  ops = []
  if (t === 'q') stack.push([ctm, color])
  else if (t === 'Q') [ctm, color] = stack.pop()
  else if (t === 'cm') ctm = mul(a.slice(-6), ctm)
  else if (t === 'k') color = cmyk(...a.slice(-4))
  else if (t === 'm') d.push(['M', P(...(cur = start = a.slice(-2)))])
  else if (t === 'l') d.push(['L', P(...(cur = a.slice(-2)))])
  else if (t === 'c') d.push(['C', P(a[0], a[1]), P(a[2], a[3]), P(...(cur = a.slice(4, 6)))])
  else if (t === 'v') d.push(['C', P(...cur), P(a[0], a[1]), P(...(cur = a.slice(2, 4)))])
  else if (t === 'y') d.push(['C', P(a[0], a[1]), P(a[2], a[3]), P(...(cur = a.slice(2, 4)))])
  else if (t === 'h') {
    d.push(['Z'])
    cur = start
  } else if (t === 're') {
    const [x, y, w, h] = a.slice(-4)
    d.push(['M', P(x, y)], ['L', P(x + w, y)], ['L', P(x + w, y + h)], ['L', P(x, y + h)], ['Z'])
  } else if (t === 'f' || t === 'f*' || t === 'F') {
    shapes.push({ color, d })
    d = []
  } else if (t === 'n' || t === 'S') d = []
}

/* ---------------------------------------------------- 2) gri parçalar: dişli, iş mili, freze, hortum */
const GRAY = '465758' // logodaki gri (CMYK 57/47/46/36)
const gray = shapes.filter((s) => s.color === GRAY)
if (gray.length !== 7) throw new Error(`Beklenen 7 gri parça, bulunan ${gray.length} — logo değişmiş olabilir, betiği gözden geçirin`)
/** sınır kutusu: eğriler örneklenir (kontrol noktaları eğrinin dışında kalabilir) */
const bbox = (s) => {
  const p = []
  let last = [0, 0]
  for (const [c, ...q] of s.d) {
    if (c === 'C') {
      for (let i = 1; i <= 12; i++) {
        const u = i / 12
        const v = 1 - u
        const w = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u]
        const pts = [last, ...q]
        p.push([0, 1].map((j) => pts.reduce((n, pt, k) => n + w[k] * pt[j], 0)))
      }
    } else p.push(...q)
    if (q.length) last = q.at(-1)
  }
  const xs = p.map((q) => q[0])
  const ys = p.map((q) => q[1])
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
}
const boxes = gray.map(bbox)
// dişli: en YÜKSEK parça (genişlikte yazı bandı çizgileriyle eşit); iş mili: içerideki en geniş;
// freze: iş milinin altında, ortada; hortum: merkezin solunda
const gearI = boxes.reduce((b, x, i) => (x[3] - x[1] > boxes[b][3] - boxes[b][1] ? i : b), 0)
const [gx0, gy0, gx1, gy1] = boxes[gearI]
const cx = (gx0 + gx1) / 2
const cy = (gy0 + gy1) / 2
const Rpdf = (gy1 - gy0) / 2 // dikey yükseklikten: dişli yolu yatayda yazı bandının kanatlarını da içerir
const inner = boxes.map((b, i) => ({ b, i })).filter(({ b, i }) => i !== gearI && b[2] - b[0] < Rpdf)
const spindle = inner.reduce((a, x) => (x.b[2] - x.b[0] > a.b[2] - a.b[0] ? x : a))
const tool = inner.find((x) => x !== spindle && Math.abs((x.b[0] + x.b[2]) / 2 - cx) < 5 && x.b[1] >= spindle.b[3] - 2)
const hose = inner.find((x) => x !== spindle && x !== tool && x.b[2] < cx)
if (!tool || !hose) throw new Error('freze ya da hortum bulunamadı')

/* ---------------------------------------------------- 3) amblem koordinatları: merkez (0,0), dış yarıçap 48 */
const R = 48
const K = R / Rpdf
const f = (n) => +n.toFixed(2)
const tx = (s) =>
  s.d
    .map(([c, ...pts]) => c + pts.map(([x, y]) => `${f((x - cx) * K)} ${f((y - cy) * K)}`).join(' '))
    .join('')
const pt = (r, t) => `${f(r * Math.sin(t))} ${f(-r * Math.cos(t))}`
const circle = (r) => `M0 ${f(-r)}A${f(r)} ${f(r)} 0 1 0 0 ${f(r)}A${f(r)} ${f(r)} 0 1 0 0 ${f(-r)}Z`
// logodaki ölçüler (PDF birimi): oyuk derinliği 13,5; iç halkanın iç yarıçapı 158,3
const N = 16
const rn = 13.5 * K * 1.4
const ri = 158.3 * K
const a = 2 * Math.asin(rn / (2 * R))
let gear = `M${pt(R, a)}`
for (let k = 1; k <= N; k++) {
  const t = (k * 2 * Math.PI) / N
  gear += `A${f(R)} ${f(R)} 0 0 1 ${pt(R, t - a)}A${f(rn)} ${f(rn)} 0 0 0 ${pt(R, t + a)}`
}
gear += 'Z' + circle(ri)
const top = f((spindle.b[1] - cy) * K) // iş milinin tepesi: büyütme bu noktadan (halkaya asılı kalır)

writeFileSync(
  out,
  `// OTOMATİK ÜRETİLDİ — elle düzenlemeyin: node scripts/emblem.mjs ../Formatlogo.pdf
// Firma logosundan yazısız amblem (viewBox -50 -50 100 100, merkez 0,0). Ayrıntılar scripts/emblem.mjs başında.

/** Tam dişli çark (16 oyuk) — evenodd ile bant */
export const GEAR = '${gear}'
/** İş mili ve tutucu */
export const SPINDLE = '${tx(gray[spindle.i])}'
/** Parmak freze (kesici takım) */
export const TOOL = '${tx(gray[tool.i])}'
/** Soğutma hortumu (yalnızca büyük boyutlu kullanımda) */
export const HOSE = '${tx(gray[hose.i])}'
/** Takım grubunun büyütme noktası (iş milinin tepesi) ve küçük boyut büyütme oranı */
export const TOOL_TOP = ${top}
export const TOOL_SCALE = 1.25
`,
)
console.log(`✓ amblem → src/components/emblem-paths.ts (merkez ${f(cx)}, ${f(cy)}; R ${f(Rpdf)} pdf birimi)`)
