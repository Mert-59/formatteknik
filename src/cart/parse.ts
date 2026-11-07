/**
 * "Liste yapıştır" ayrıştırıcısı: her satır bir kalem.
 *
 * Tanınan adet yazımları (satır sonunda ya da başında):
 *   CNMG 120408 x10      CNMG 120408 × 10     CNMG 120408 *10
 *   M8 kılavuz 5 adet    M8 kılavuz 5 ad.     M8 kılavuz 5 pcs
 *   10 x CNMG 120408     10 adet CNMG 120408
 *   CNMG 120408<TAB>10   (Excel'den kopyalanan sütunlar)
 *   CNMG 120408; 10
 * Adet bulunamazsa 1 sayılır. Kod içindeki "M8x1.25" gibi yazımlar bozulmaz
 * (adet için "x"ten önce boşluk gerekir).
 */
export type ParsedLine = { code: string; qty: number }

const MAX_QTY = 9999
const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.round(n) || 1))

const BULLET = /^\s*(?:[-–•*·]|\d{1,3}[).])\s+/
const TAIL_X = /\s[x×*]\s*(\d{1,4})\s*$/i
const TAIL_UNIT = /\s(\d{1,4})\s*(?:adet|ad\.?|pcs|pc|pk|tk)\s*$/i
const HEAD = /^(\d{1,4})\s*(?:[x×*]|adet|ad\.?|pcs)\s+/i
const SEP = /\s*[;|]\s*(\d{1,4})\s*$/

function parseOne(raw: string): ParsedLine | null {
  // Excel / tablo: sekmeyle ayrılmış hücreler. Yalnızca sayı olan son hücre adettir.
  if (raw.includes('\t')) {
    const cells = raw.split('\t').map((c) => c.trim()).filter(Boolean)
    if (!cells.length) return null
    let qty = 1
    const qi = cells.map((c) => /^\d{1,4}$/.test(c)).lastIndexOf(true)
    if (qi !== -1 && cells.length > 1) {
      qty = clamp(Number(cells[qi]))
      cells.splice(qi, 1)
    }
    const code = cells.join(' ').trim()
    return code ? { code, qty } : null
  }

  let line = raw.replace(BULLET, '').trim()
  if (!line) return null
  let qty = 1
  for (const re of [TAIL_X, TAIL_UNIT, SEP]) {
    const m = line.match(re)
    if (m) {
      qty = clamp(Number(m[1]))
      line = line.slice(0, m.index).trim()
      break
    }
  }
  if (qty === 1) {
    const m = line.match(HEAD)
    if (m) {
      qty = clamp(Number(m[1]))
      line = line.slice(m[0].length).trim()
    }
  }
  line = line.replace(/[\s,;:–-]+$/, '').trim()
  return line ? { code: line, qty } : null
}

export function parseLines(text: string): ParsedLine[] {
  return text
    .split(/\r?\n/)
    .map(parseOne)
    .filter((x): x is ParsedLine => x !== null)
}
