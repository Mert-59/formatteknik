/**
 * Ürün grubu tahmininin örnek tablosu (src/cart/guess.ts). Çalıştırma: npm run test:guess
 * Node 22.18+ TypeScript dosyasını doğrudan çalıştırır (tip silme).
 * Kural değişince buraya örnek ekleyin; null = "tahmin etme" (belirsiz yazım).
 */
import { guessCategory } from '../src/cart/guess.ts'

const CASES = [
  // torna uçları
  ['CNMG 120408', 'torna-uclari'],
  ['cnmg120408-ma', 'torna-uclari'],
  ['DCMT 11T304', 'torna-uclari'],
  ['VBMT160404 VP15TF', 'torna-uclari'],
  ['TNMG 1604', 'torna-uclari'],
  ['WNMG 080408', 'torna-uclari'],
  ['CCGT 09T302', 'torna-uclari'],
  ['MMT16ER150ISO', 'torna-uclari'],
  ['16ER 1.5 ISO', 'torna-uclari'],
  ['kanal ucu 3 mm', 'torna-uclari'],
  ['diş tornalama ucu', 'torna-uclari'],
  // takma uçlu freze
  ['APMT 1135', 'takma-uclu-freze'],
  ['SEKT 1204 AFTN', 'takma-uclu-freze'],
  ['RPMT 1204', 'takma-uclu-freze'],
  ['Ø63 alın frezesi', 'takma-uclu-freze'],
  ['Ø80 freze', 'takma-uclu-freze'],
  // kılavuz
  ['M8x1.25', 'kilavuz'],
  ['M10 x 1,5', 'kilavuz'],
  ['M8×1.25 makine kılavuzu', 'kilavuz'],
  ['M12', 'kilavuz'],
  ['KILAVUZ M6', 'kilavuz'],
  ['1/4 UNC', 'kilavuz'],
  ['G 1/8', 'kilavuz'],
  ['HSS kılavuz M5', 'kilavuz'],
  // karbür matkap
  ['Ø8,5 5xD', 'karbur-matkap'],
  ['8.5 3 x D', 'karbur-matkap'],
  ['MVE0850X05S080', 'karbur-matkap'],
  ['karbür matkap Ø6', 'karbur-matkap'],
  // karbür freze
  ['Ø10 4 ağız', 'karbur-freze'],
  ['parmak freze Ø6', 'karbur-freze'],
  ['Ø12 freze', 'karbur-freze'],
  ['küre freze R3', 'karbur-freze'],
  // ölçü aletleri
  ['0–25 mm dijital mikrometre', 'olcu-aletleri'],
  ['150 mm kumpas', 'olcu-aletleri'],
  ['Mitutoyo komparatör', 'olcu-aletleri'],
  ['MİKROMETRE 0-25', 'olcu-aletleri'],
  ['DİŞ AÇMA M6', 'kilavuz'],
  // HSS matkap
  ['Ø6 HSS-Co', 'hss-matkap'],
  ['HSS-E matkap 4,2', 'hss-matkap'],
  ['DIN 338 Ø5', 'hss-matkap'],
  // shrink-fit
  ['BT40 Ø12', 'shrink-fit-holder'],
  ['HSK63 shrink', 'shrink-fit-holder'],
  ['shrink fit tutucu', 'shrink-fit-holder'],
  // pens
  ['Ø12 ana iş mili pensi', 'pens-kayar-otomat'],
  ['pens 6 mm', 'pens-kayar-otomat'],
  // belirsiz → tahmin yok
  ['Ø10 matkap', null],
  ['12345', null],
  ['', null],
  ['x', null],
  ['M', null],
  ['MS2SSD0600', null],
  ['vida', null],
]

let fail = 0
for (const [input, want] of CASES) {
  const got = guessCategory(input)
  if (got !== want) {
    fail++
    console.log(`✗ ${JSON.stringify(input).padEnd(30)} beklenen ${want}, gelen ${got}`)
  }
}
console.log(fail ? `\n${fail} / ${CASES.length} örnek hatalı` : `✓ ${CASES.length} örneğin hepsi doğru`)
process.exit(fail ? 1 : 0)
