/**
 * Ürün kodundan / tariften ürün grubu tahmini (teklif fişi).
 *
 *   guessCategory('CNMG 120408')         → 'torna-uclari'
 *   guessCategory('M8x1.25')             → 'kilavuz'
 *   guessCategory('Ø8,5 5xD')            → 'karbur-matkap'
 *   guessCategory('0–25 mm mikrometre')  → 'olcu-aletleri'
 *   guessCategory('BT40 ER32')           → 'pens-tutucular'
 *   guessCategory('PCLNR 2525 M12')      → 'kater-tarama-kafasi'
 *   guessCategory('Ø10 matkap')          → null   (karbür mü HSS mi belli değil: tahmin yok)
 *
 * Sıra önemli: önce açık kelimeler (kullanıcı ne yazdıysa o), sonra kod kalıpları.
 * Emin olunmayan durumda null döner — yanlış grup, boş gruptan kötüdür.
 * Grup, fişte ve WhatsApp mesajında yalnızca kodun yanında bilgi olarak görünür; müşteri chip'e dokunup değiştirebilir.
 * Yeni kural eklerken scripts/test-guess.mjs içindeki örneklere de ekleyin (`npm run test:guess`).
 */

/** Türkçe harfleri sadeleştirir: "KILAVUZ", "kılavuz", "kilavuz" aynı okunur. */
function plain(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/i̇/g, 'i') // "İ" bazı yollarla i + birleşik nokta olarak gelir
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[×✕]/g, 'x')
    .replace(/\s+/g, ' ')
}

/** "Ø63", "ø 10", "D12", "çap 8" → 63, 10, 12, 8 (yoksa null) */
function diameter(t: string): number | null {
  const m = t.match(/(?:ø|⌀|\bd|\bcap)\s?(\d+(?:[.,]\d+)?)/)
  return m ? Number(m[1].replace(',', '.')) : null
}

type Rule = [RegExp, string]

/** 1) Açık kelimeler — sadeleştirilmiş küçük harf metinde */
const WORDS: Rule[] = [
  // "torna aynası", "torna kateri" torna kelimesinden önce okunur
  [/\bayna|chuck|sert ayak|yumusak ayak/, 'cnc-torna-aynasi'],
  [/kater|tarama (kafa|basli)|delik buyutme|boring|\bbara\b/, 'kater-tarama-kafasi'],
  [/tornala|\btorna\b|kanal (ucu|bicagi)|dis (ucu|tornalama)/, 'torna-uclari'],
  [/kilavuz|klavuz|dis acma|\btap\b/, 'kilavuz'],
  [/mikrometre|kumpas|komparator|mihengir|mastar|pasametre|mitutoyo|olcu (aleti|saati)|derinlik olcer/, 'olcu-aletleri'],
  // ER / OZ pens başlığı: "BT40 ER32" shrink-fit'teki BT40'tan, "ER25 pens" kayar otomat pensinden önce okunur
  [/pens (tutucu|basli|kafa)|\ber ?(8|11|16|20|25|32|40|50)\b|\boz ?(16|20|25|32)\b/, 'pens-tutucular'],
  [/shrink|isil sikma|\bbt ?(30|40|50)\b|\bhsk\b|\bsk ?(40|50)\b|takim tutucu|holder/, 'shrink-fit-holder'],
  [/\bpens|kayar|swiss|is mili/, 'pens-kayar-otomat'],
  [/takma uclu freze|alin frez|freze govde|kose frez|kopya frez|tablali frez|yuzey frez/, 'takma-uclu-freze'],
  [/parmak frez|karbur frez|kure frez|end ?mill|radyuslu frez|\d ?agiz|agizli|torus/, 'karbur-freze'],
  [/karbur matkap|\bvhm\b/, 'karbur-matkap'],
  [/\bhss|kobalt|\bdin ?(338|340|345|1897)\b|konik sapli matkap/, 'hss-matkap'],
]

/** 2) Kod kalıpları — büyük harf, özgün metinde */
const CODES: Rule[] = [
  // torna kateri (ISO 5608): PCLNR 2525 M12, SVJBR2020K16; iç çap barası: S20R-PCLNR09, A16R-SCLCR09
  [/\b[A-Z]{4}[RLN]\s?\d{4}\s?[A-Z]\s?\d{2}\b|\b[ACES]\d{2}[A-Z]-?[A-Z]{4}[RL]\s?\d{2}/, 'kater-tarama-kafasi'],
  // frezeleme ucu (ISO): APMT 1135, SEKT 1204, RPMT 1204, ODMT 0605, LNMU 0303, XOMX 0904
  [/\b(AP[MK][TX]|SE[EKM][NT]|SPKN|RP[MH][TW]|RD[MH][TW]|OD[MH]T|ONMU|LNMU|XOMX|AD[MK]T|JDMT|JOMT|R390)\s?-?\d{2}/, 'takma-uclu-freze'],
  // tornalama ucu (ISO): CNMG 120408, DCMT 11T304, VBMT 160404, TNMG 1604, CCGT 09T3
  [/\b[CDKRSTVW][A-Z][GMU][A-Z]\s?-?\d{2}(?:T\d|\d{2})/, 'torna-uclari'],
  // diş tornalama / kanal: 16ER 1.5 ISO, 22IR, MMT16ER, MGMN 300
  [/\b\d{2}(ER|IR|EL|IL)\b|\bMMT|\bMGMN/, 'torna-uclari'],
  // diş ölçüsü: M8x1.25, M10 x 1,5, UNC 1/4, G 1/8, NPT
  [/\bM\d{1,2}(?:[.,]\d+)?\s?X\s?\d(?:[.,]\d+)?\b|\b(UNC|UNF|UNEF|NPTF?|BSPP?|BSPT)\b|\bG\s?\d\/\d/, 'kilavuz'],
  // Mitsubishi karbür matkap kodları: MVE0850X05S080, MWE, MWS, MPS1
  [/\bM(VE|WE|WS|VS|PS1)\d/, 'karbur-matkap'],
]

export function guessCategory(text: string): string | null {
  const raw = text.trim()
  if (raw.length < 2) return null
  const t = plain(raw)

  for (const [re, slug] of WORDS) if (re.test(t)) return slug

  // "freze" tek başına: büyük çaplar takma uçlu gövdedir, küçükler parmak freze
  if (/frez/.test(t)) {
    const d = diameter(t)
    return d !== null && d >= 32 ? 'takma-uclu-freze' : 'karbur-freze'
  }

  const up = raw.toLocaleUpperCase('en-US').replace(/×/g, 'X')
  for (const [re, slug] of CODES) if (re.test(up)) return slug

  // boy oranı (5xD, 3 x D) karbür matkap yazımıdır; "matkap" tek başına karbür/HSS ayırt etmez
  if (/\b\d{1,2} ?x ?d\b/.test(t)) return 'karbur-matkap'
  // yalın "M8", "M12 kılavuz" yazmadan: tek başına diş ölçüsü (M3–M64)
  if (/^m([3-9]|[1-5]\d|6[0-4])$/.test(t)) return 'kilavuz'
  return null
}
