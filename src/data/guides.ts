/**
 * Ürün grubu sayfalarının içeriği (/urunler/<grup>) — TASLAK, gözden geçirilecek.
 *
 * Her grup için:
 *  - metaDescription: arama sonuçlarında ve paylaşım önizlemesinde görünen açıklama (~150 karakter)
 *  - overview:        "Genel bakış" paragrafları
 *  - brands:          bu grupta tedarik edilen markalar — BOŞ LİSTE = bölüm gösterilmez.
 *                     Marka adları src/data/brands.ts'deki adlarla aynı yazılmalı (ör. 'Mitsubishi', 'OSG').
 *
 * Grup adı, kısa açıklama ve çizim src/data/catalog.ts'te; PDF kataloglar src/data/catalogs.ts'te.
 * (Kod rehberi, "fişe yazarken belirtin" ve seçim ipuçları bölümleri 8 Kasım 2026'da kaldırıldı.)
 */

export type Guide = {
  metaDescription: string
  overview: string[]
  brands: string[]
}

export const GUIDES: Record<string, Guide> = {
  'torna-uclari': {
    metaDescription:
      'Torna uçları: dış çap, iç çap, kanal ve diş tornalama için takma uçlar. PDF katalog; kodu yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Torna uçları; dış çap, iç çap, alın, kanal ve diş tornalama operasyonlarında takım tutucuya bağlanan, değiştirilebilir kesici uçlardır. Köşesi aşınan uç döndürülerek yeni bir kesme köşesiyle kullanılmaya devam eder.',
      'Doğru uç; işlenen malzemeye, operasyona (kaba, orta, hassas) ve tezgâhın rijitliğine göre seçilir. Şekil ve ölçüler ISO 1832 standardındaki koda göre tüm üreticilerde aynıdır; talaş kırıcı geometrisi ve kalite (kaplama) ise üreticiye özeldir.',
    ],
    brands: [],
  },

  'takma-uclu-freze': {
    metaDescription:
      'Takma uçlu freze gövdeleri ve uçları: alın, omuz ve kopya frezeleme. PDF katalog; kodu yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Takma uçlu frezeler, değiştirilebilir kesici uçların bağlandığı freze gövdeleridir. Uçlar aşındığında gövde değişmez; uçlar döndürülür ya da yenilenir. Geniş yüzeylerin alın frezelemesi, omuz (90°) ve kopya frezeleme için ekonomik bir çözümdür.',
      'Gövde; tezgâhın gücüne ve bağlantısına, işlenecek yüzeyin genişliğine ve istenen yaklaşma açısına göre seçilir. Uç tipi gövdeye özeldir: gövdeyle uyumlu uç kodunu belirtmek gerekir.',
    ],
    brands: [],
  },

  kilavuz: {
    metaDescription:
      'Makine kılavuzları: kör ve boydan boya delikler için, farklı malzemelere uygun kılavuzlar. PDF kataloglar; kodu yazın, teklif fişine ekleyin. Format Teknik.',
    overview: [
      'Makine kılavuzları, delinmiş deliğe iç vida dişi açar. Kör delikte talaşı yukarı atan helis oluklu, boydan boya delikte talaşı ileri iten kanallı (gun nose) kılavuzlar kullanılır.',
      'Kılavuz; diş tipi ve ölçüsüne, tolerans sınıfına, delik tipine ve işlenen malzemeye göre seçilir.',
    ],
    brands: [],
  },

  'karbur-matkap': {
    metaDescription:
      'Karbür matkaplar: soğutma kanallı ve kanalsız, farklı boy oranlarında. PDF katalog; kodu yazın, teklif fişine ekleyin, WhatsApp’tan gönderin. Format Teknik.',
    overview: [
      'Karbür matkaplar, HSS matkaplara göre çok daha yüksek kesme hızlarında, daha hassas ölçü ve daha iyi yüzeyle delik deler; seri üretimde çevrim süresini belirgin şekilde kısaltır.',
      'Soğutma kanallı (iç soğutmalı) modeller soğutma sıvısını doğrudan uca ulaştırır ve derin deliklerde talaş tahliyesini kolaylaştırır. Bunun için tezgâhta iş milinden soğutma gerekir.',
    ],
    brands: [],
  },

  'karbur-freze': {
    metaDescription:
      'Karbür parmak frezeler: düz, küre ve köşe radyüslü; kaba ve hassas işleme için. PDF katalog; kodu yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Karbür parmak frezeler; kanal, cep, profil ve yüzey işlemede kullanılan tek parça kesici takımlardır. Ağız sayısı, helis açısı, uç şekli ve kaplama işlenen malzemeye göre seçilir.',
      'Düz uçlu frezeler dik köşe ve düz taban, küre uçlu frezeler 3B yüzey ve kalıp, köşe radyüslü frezeler ise daha dayanıklı kenar ve radyüslü köşe için kullanılır.',
    ],
    brands: [],
  },

  'olcu-aletleri': {
    metaDescription:
      'Mikrometre, kumpas, komparatör ve diğer hassas ölçüm cihazları. PDF katalog; kodu yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Hassas ölçüm, talaşlı imalatta kalitenin temelidir. Mikrometre, kumpas, komparatör ve diğer ölçüm cihazları; parçanın toleransına uygun çözünürlük ve ölçüm aralığıyla seçilir.',
      'Dijital modeller okuma hatasını azaltır; veri çıkışlı olanlar ölçüleri doğrudan bilgisayara ya da istatistiksel proses kontrol (SPC) yazılımına aktarabilir.',
    ],
    brands: [],
  },

  'hss-matkap': {
    metaDescription:
      'HSS ve HSS-Co (kobaltlı) matkaplar: genel amaçlı delme ve paslanmaz çelik için. PDF kataloglar; kodu yazın, teklif fişine ekleyin. Format Teknik.',
    overview: [
      'HSS (yüksek hız çeliği) matkaplar; genel amaçlı delme, bakım-onarım ve düşük-orta adetli üretim için ekonomik ve tok takımlardır. Titreşime ve kırılmaya karbür matkaplardan daha dayanıklıdır.',
      'Kobalt alaşımlı HSS-Co (HSS-E) matkaplar ısıya daha dayanıklıdır; paslanmaz çelik ve zor malzemelerde tercih edilir.',
    ],
    brands: [],
  },

  'shrink-fit-holder': {
    metaDescription:
      'Shrink-fit (ısıl sıkma) takım tutucular: BT40, SK40, HSK bağlantılar. Kodu ya da ölçüyü yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Shrink-fit (ısıl sıkma) takım tutucular, ısıtılıp genleştirilen tutucuya takımın yerleştirilmesi ve soğutulmasıyla takımı çok yüksek sıkma kuvveti ve düşük salgıyla tutar.',
      'Düşük salgı takım ömrünü uzatır ve yüzey kalitesini artırır; ince burun yapısı derin ve dar bölgelere erişim sağlar. Takım takıp sökmek için indüksiyonlu shrink-fit cihazı gerekir.',
    ],
    brands: [],
  },

  'pens-kayar-otomat': {
    metaDescription:
      'Kayar otomat (swiss-type) pensleri: ana ve karşı iş mili pensleri. PDF katalog; tezgâh modelinizi yazın, teklif fişine ekleyin. Format Teknik.',
    overview: [
      'Kayar otomat (swiss-type) tezgâhlarında malzeme ana iş milinde pensle tutulur ve kılavuz burç içinden ilerler; parça karşı iş milinde ikinci bir pensle alınarak arka işlemesi yapılır.',
      'Pens tipi tezgâhın markasına ve modeline göre değişir. Doğru pens için tezgâh modelini ve varsa pens üzerindeki tip kodunu belirtmek en hızlı yoldur.',
    ],
    brands: [],
  },
}
