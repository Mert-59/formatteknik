/**
 * Ürün grubu sayfalarının içeriği (/urunler/<grup>) — TASLAK, gözden geçirilecek.
 *
 * Her grup için:
 *  - metaDescription: arama sonuçlarında ve paylaşım önizlemesinde görünen açıklama (~150 karakter)
 *  - overview:        "Genel bakış" paragrafları
 *  - anatomy:         örnek bir kodun/ölçünün parça parça açıklaması ("Kod nasıl okunur?" / "Fişe nasıl yazılır?")
 *  - specs:           "Teklif isterken belirtin" listesi
 *  - tips:            "Seçim ipuçları"
 *  - brands:          bu grupta tedarik edilen markalar — BOŞ LİSTE = bölüm gösterilmez.
 *                     Marka adları src/data/brands.ts'deki adlarla aynı yazılmalı (ör. 'Mitsubishi', 'OSG').
 *
 * Grup adı, kısa açıklama ve çizim src/data/catalog.ts'te; bu dosya yalnızca sayfa içeriğidir.
 */

export type Segment = {
  /** Kodun parçası, ör. 'C' ya da 'Ø8,5' */
  code: string
  /** Parçanın adı, ör. 'Uç şekli' */
  label: string
  /** Açıklaması */
  meaning: string
}

export type Guide = {
  metaDescription: string
  overview: string[]
  anatomy: { heading: string; segments: Segment[]; note?: string }
  specs: { label: string; hint: string }[]
  tips: string[]
  brands: string[]
}

export const GUIDES: Record<string, Guide> = {
  'torna-uclari': {
    metaDescription:
      'Torna uçları: CNMG 120408 gibi ISO kodları nasıl okunur, seçerken nelere dikkat edilir? Kodu yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Torna uçları; dış çap, iç çap, alın, kanal ve diş tornalama operasyonlarında takım tutucuya bağlanan, değiştirilebilir kesici uçlardır. Köşesi aşınan uç döndürülerek yeni bir kesme köşesiyle kullanılmaya devam eder.',
      'Doğru uç; işlenen malzemeye, operasyona (kaba, orta, hassas) ve tezgâhın rijitliğine göre seçilir. Şekil ve ölçüler ISO 1832 standardındaki koda göre tüm üreticilerde aynıdır; talaş kırıcı geometrisi ve kalite (kaplama) ise üreticiye özeldir.',
    ],
    anatomy: {
      heading: 'CNMG 120408 kodu nasıl okunur? (ISO 1832)',
      segments: [
        { code: 'C', label: 'Uç şekli', meaning: '80° eşkenar dörtgen (rombik) uç' },
        { code: 'N', label: 'Boşluk açısı', meaning: '0° — negatif uç; iki yüzü de kullanılabilir' },
        { code: 'M', label: 'Tolerans sınıfı', meaning: 'Orta tolerans; preslenmiş (taşlanmamış) uçlarda en yaygın sınıf' },
        { code: 'G', label: 'Bağlama / talaş kırıcı', meaning: 'Delikli, iki yüzünde talaş kırıcı bulunan uç' },
        { code: '12', label: 'Kesme kenarı', meaning: 'Kesme kenarı yaklaşık 12,9 mm (iç daire Ø12,7 mm)' },
        { code: '04', label: 'Kalınlık', meaning: 'Uç kalınlığı 4,76 mm' },
        { code: '08', label: 'Köşe radyüsü', meaning: 'Köşe radyüsü 0,8 mm' },
      ],
      note: 'Koddan sonra gelen harfler (ör. MP, VP15TF) üreticinin talaş kırıcı ve kalite/kaplama kodudur. En doğrusu, elinizdeki ucun kutusundaki kodun tamamını yazmaktır.',
    },
    specs: [
      { label: 'ISO kodu', hint: 'Ör. CNMG 120408 — kutudaki kodun tamamı en iyisidir' },
      { label: 'Talaş kırıcı ve kalite', hint: 'Biliyorsanız üretici kodu (ör. MP VP15TF); bilmiyorsanız işlenen malzemeyi yazın' },
      { label: 'İşlenen malzeme', hint: 'Çelik, paslanmaz, döküm, alüminyum, süper alaşım ya da sertleştirilmiş çelik' },
      { label: 'Operasyon', hint: 'Kaba, orta ya da hassas (finiş) tornalama' },
      { label: 'Adet', hint: 'Uçlar çoğunlukla 10’lu kutularda satılır' },
    ],
    tips: [
      'Malzeme grupları ISO renk koduyla gösterilir: P (mavi) çelik, M (sarı) paslanmaz, K (kırmızı) dökme demir, N (yeşil) alüminyum ve demir dışı metaller, S (turuncu) süper alaşım ve titanyum, H (gri) sertleştirilmiş çelik.',
      'Büyük köşe radyüsü kenarı güçlendirir ve aynı ilerlemede daha iyi yüzey verir, ama titreşime daha yatkındır; ince ve narin parçalarda küçük radyüs tercih edilir.',
      'Negatif uçlar (CNMG gibi) çift taraflı ve ekonomiktir. Pozitif boşluk açılı uçlar (CCMT gibi) daha düşük kesme kuvveti ister; ince işler, iç çap ve küçük tezgâhlar için uygundur.',
      'Aynı ölçüde hassas, orta ve kaba işleme için farklı talaş kırıcılar bulunur; üreticiler bunlara farklı adlar verir.',
    ],
    brands: [],
  },

  'takma-uclu-freze': {
    metaDescription:
      'Takma uçlu freze gövdeleri: alın, omuz ve kopya frezeleme. Çap, uç sayısı, yaklaşma açısı ve bağlamaya göre seçim; teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Takma uçlu frezeler, değiştirilebilir kesici uçların bağlandığı freze gövdeleridir. Uçlar aşındığında gövde değişmez; uçlar döndürülür ya da yenilenir. Geniş yüzeylerin alın frezelemesi, omuz (90°) ve kopya frezeleme için ekonomik bir çözümdür.',
      'Gövde; tezgâhın gücüne ve bağlantısına, işlenecek yüzeyin genişliğine ve istenen yaklaşma açısına göre seçilir. Uç tipi gövdeye özeldir: gövdeyle uyumlu uç kodunu belirtmek gerekir.',
    ],
    anatomy: {
      heading: 'Fişe nasıl yazılır?',
      segments: [
        { code: 'Ø63', label: 'Freze çapı', meaning: '63 mm çaplı gövde' },
        { code: 'Z5', label: 'Uç sayısı', meaning: 'Gövdede 5 kesici uç' },
        { code: '45°', label: 'Yaklaşma açısı', meaning: '45° alın frezesi; 90° ise omuz frezesi' },
        { code: 'Ø22', label: 'Bağlama', meaning: 'Ø22 mm delikli (malafa) bağlantı; küçük çaplarda saplı gövde' },
      ],
      note: 'Gövde ve uç ayrı kalemlerdir. Uç da istiyorsanız gövdeye uygun uç kodunu ayrı bir satır olarak ekleyin.',
    },
    specs: [
      { label: 'Freze çapı', hint: 'Ör. Ø50, Ø63, Ø80' },
      { label: 'Tip / yaklaşma açısı', hint: 'Alın (45°), omuz (90°) ya da yuvarlak uçlu (kopya)' },
      { label: 'Bağlama', hint: 'Delik çapı (ör. Ø22, Ø27) ya da sap tipi' },
      { label: 'Uç tipi', hint: 'Gövdeye uygun uç kodu; bilmiyorsanız gövde koduyla birlikte sorun' },
      { label: 'İşlenen malzeme', hint: 'Çelik, döküm, paslanmaz, alüminyum…' },
    ],
    tips: [
      '45° yaklaşma açılı alın frezeleri talaşı inceltir; yüksek ilerlemeyle verimli alın işlemesi sağlar.',
      '90° omuz frezeleri dik duvar ve basamak işler; tek gövdeyle hem alın hem omuz işlenebilir.',
      'Yuvarlak uçlu (kopya) frezelerin kenarı güçlüdür; kalıp ve zor malzemelerde kaba işlemeye uygundur.',
      'Seyrek dişli gövde daha az güç ister ve titreşime daha dayanıklıdır; sık dişli gövde rijit tezgâhlarda daha verimlidir.',
    ],
    brands: [],
  },

  kilavuz: {
    metaDescription:
      'Makine kılavuzları: M8 × 1,25 gibi diş ölçüleri nasıl okunur, kör ve boydan boya delik için hangi kılavuz seçilir? Teklif fişine ekleyin. Format Teknik.',
    overview: [
      'Makine kılavuzları, delinmiş deliğe iç vida dişi açar. Kör delikte talaşı yukarı atan helis oluklu, boydan boya delikte talaşı ileri iten kanallı (gun nose) kılavuzlar kullanılır.',
      'Kılavuz; diş tipi ve ölçüsüne, tolerans sınıfına, delik tipine ve işlenen malzemeye göre seçilir.',
    ],
    anatomy: {
      heading: 'M8 × 1,25 – 6H nasıl okunur?',
      segments: [
        { code: 'M', label: 'Diş tipi', meaning: 'Metrik ISO diş (60° diş açısı)' },
        { code: '8', label: 'Anma çapı', meaning: '8 mm' },
        { code: '× 1,25', label: 'Hatve', meaning: 'Diş adımı 1,25 mm; M8’in normal hatvesi. İnce diş ise ör. M8 × 1' },
        { code: '6H', label: 'Tolerans', meaning: 'İç diş için standart tolerans sınıfı' },
      ],
      note: 'Kılavuz matkabı çapı ≈ anma çapı − hatve: M8 × 1,25 için Ø6,8 mm. Diğer diş tipleri: G (BSP boru dişi), UNC/UNF (inç), Tr (trapez).',
    },
    specs: [
      { label: 'Diş tipi ve ölçüsü', hint: 'Ör. M8, M8 × 1, G 1/4, 1/4-20 UNC' },
      { label: 'Delik tipi', hint: 'Kör delik ya da boydan boya' },
      { label: 'Tolerans', hint: 'Standart 6H; farklı bir sınıf gerekiyorsa belirtin' },
      { label: 'İşlenen malzeme', hint: 'Çelik, paslanmaz, döküm, alüminyum…' },
      { label: 'Kılavuz tipi', hint: 'Makine ya da el kılavuzu; gerekiyorsa form (ezme) kılavuzu' },
    ],
    tips: [
      'Kör delikte helis oluklu, boydan boya delikte kanallı (gun nose) kılavuz talaş sıkışmasını önler.',
      'Form (ezme) kılavuzları talaş çıkarmaz; alüminyum ve yumuşak çeliklerde daha dayanıklı diş verir. Ön delik çapı kesme kılavuzundan farklıdır.',
      'Paslanmaz ve zor malzemelerde kobaltlı (HSS-E) ya da toz metal (HSS-PM) ve kaplamalı kılavuz tercih edilir.',
    ],
    brands: [],
  },

  'karbur-matkap': {
    metaDescription:
      'Karbür matkaplar: Ø8,5 5xD gibi ölçüler nasıl yazılır, iç soğutmalı matkap ne zaman gerekir? Teklif fişine ekleyin, WhatsApp’tan gönderin. Format Teknik.',
    overview: [
      'Karbür matkaplar, HSS matkaplara göre çok daha yüksek kesme hızlarında, daha hassas ölçü ve daha iyi yüzeyle delik deler; seri üretimde çevrim süresini belirgin şekilde kısaltır.',
      'Soğutma kanallı (iç soğutmalı) modeller soğutma sıvısını doğrudan uca ulaştırır ve derin deliklerde talaş tahliyesini kolaylaştırır. Bunun için tezgâhta iş milinden soğutma gerekir.',
    ],
    anatomy: {
      heading: 'Fişe nasıl yazılır?',
      segments: [
        { code: 'Ø8,5', label: 'Delik çapı', meaning: '8,5 mm (M10 kılavuz delik çapı)' },
        { code: '5xD', label: 'Delme derinliği', meaning: 'Çapın 5 katına kadar (≈42 mm). Yaygın seriler: 3xD, 5xD, 8xD' },
        { code: 'İç soğutmalı', label: 'Soğutma', meaning: 'Sıvı matkabın içinden uca gelir; tezgâhta iş milinden soğutma gerekir' },
      ],
      note: 'Sap tipi (düz ya da yanı yassı) ve kaplama tercihiniz varsa ayrıca belirtin.',
    },
    specs: [
      { label: 'Çap', hint: 'Ör. Ø8,5 — 0,1 mm hassasiyetle' },
      { label: 'Boy oranı', hint: '3xD, 5xD, 8xD… ya da delme derinliği (mm)' },
      { label: 'Soğutma', hint: 'İç soğutmalı ya da soğutmasız' },
      { label: 'İşlenen malzeme', hint: 'Çelik, paslanmaz, döküm, alüminyum…' },
      { label: 'Sap tipi', hint: 'Düz ya da yanı yassı' },
    ],
    tips: [
      'Kısa matkap daha rijittir: deliğin gerektirdiğinden uzun matkap seçmeyin.',
      '8xD ve üzeri derinliklerde önce kısa bir pilot delik delmek, matkabın sapmasını ve kırılmasını önler.',
      'Karbür matkaplar salgıya hassastır; hidrolik ya da shrink-fit tutucu takım ömrünü uzatır.',
    ],
    brands: [],
  },

  'karbur-freze': {
    metaDescription:
      'Karbür parmak frezeler: çap, ağız sayısı, uç şekli ve boylar nasıl yazılır? Malzemeye göre freze seçimi; teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Karbür parmak frezeler; kanal, cep, profil ve yüzey işlemede kullanılan tek parça kesici takımlardır. Ağız sayısı, helis açısı, uç şekli ve kaplama işlenen malzemeye göre seçilir.',
      'Düz uçlu frezeler dik köşe ve düz taban, küre uçlu frezeler 3B yüzey ve kalıp, köşe radyüslü frezeler ise daha dayanıklı kenar ve radyüslü köşe için kullanılır.',
    ],
    anatomy: {
      heading: 'Fişe nasıl yazılır?',
      segments: [
        { code: 'Ø10', label: 'Kesme çapı', meaning: '10 mm' },
        { code: 'Z4', label: 'Ağız sayısı', meaning: '4 ağız (çelik için yaygın)' },
        { code: 'R0,5', label: 'Uç şekli', meaning: '0,5 mm köşe radyüslü. Düz uç: R0; küre uç: R5 (çapın yarısı)' },
        { code: '22 / 75', label: 'Boylar', meaning: '22 mm kesme boyu / 75 mm toplam boy' },
      ],
    },
    specs: [
      { label: 'Çap', hint: 'Ör. Ø10' },
      { label: 'Ağız sayısı', hint: 'Ör. Z2, Z3, Z4' },
      { label: 'Uç şekli', hint: 'Düz, köşe radyüslü (ör. R0,5) ya da küre' },
      { label: 'Boylar', hint: 'Kesme boyu ve toplam boy (biliyorsanız)' },
      { label: 'İşlenen malzeme', hint: 'Çelik, paslanmaz, alüminyum, sertleştirilmiş çelik…' },
    ],
    tips: [
      'Alüminyumda geniş talaş boşluğu için 2–3 ağızlı, parlak (kaplamasız ya da DLC kaplı) frezeler; çelikte 4 ve üzeri ağızlı, AlTiN türü kaplamalı frezeler tercih edilir.',
      'Gereğinden uzun kesme boyu rijitliği düşürür; derin cepler için boyunlu freze daha iyi sonuç verir.',
      'Değişken helisli frezeler titreşimi azaltır; ince duvarlarda ve uzun takım çıkışlarında fark yaratır.',
    ],
    brands: [],
  },

  'olcu-aletleri': {
    metaDescription:
      'Mikrometre, kumpas, komparatör: ölçüm aralığı ve çözünürlüğe göre ölçü aleti seçimi, kalibrasyon. Teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Hassas ölçüm, talaşlı imalatta kalitenin temelidir. Mikrometre, kumpas, komparatör ve diğer ölçüm cihazları; parçanın toleransına uygun çözünürlük ve ölçüm aralığıyla seçilir.',
      'Dijital modeller okuma hatasını azaltır; veri çıkışlı olanlar ölçüleri doğrudan bilgisayara ya da istatistiksel proses kontrol (SPC) yazılımına aktarabilir.',
    ],
    anatomy: {
      heading: 'Fişe nasıl yazılır?',
      segments: [
        { code: '0–25 mm', label: 'Ölçüm aralığı', meaning: 'Mikrometreler 25 mm’lik aralıklarla gelir: 0–25, 25–50, 50–75…' },
        { code: '0,001 mm', label: 'Çözünürlük', meaning: 'Okunabilen en küçük değer (kumpasta genellikle 0,01 mm)' },
        { code: 'Dijital', label: 'Gösterge', meaning: 'Dijital, analog (tamburlu) ya da kadranlı' },
        { code: 'Mikrometre', label: 'Alet tipi', meaning: 'Dış çap, iç çap, derinlik, diş mikrometresi…' },
      ],
    },
    specs: [
      { label: 'Alet tipi', hint: 'Mikrometre, kumpas, komparatör, mastar…' },
      { label: 'Ölçüm aralığı', hint: 'Ör. 0–25 mm, 0–150 mm' },
      { label: 'Çözünürlük', hint: 'Ör. 0,01 mm ya da 0,001 mm' },
      { label: 'Gösterge', hint: 'Dijital ya da analog' },
      { label: 'Ek gereksinim', hint: 'Veri çıkışı, kalibrasyon sertifikası' },
    ],
    tips: [
      'Genel kural: ölçüm aletinin çözünürlüğü, ölçülen toleransın yaklaşık onda biri kadar olmalıdır.',
      'Kalite sistemi için kalibrasyon sertifikalı ürün isteyin ve periyodik kalibrasyonu planlayın.',
      'Ölçmeden önce aleti ve parçayı aynı sıcaklığa getirin; sıfır ayarını kontrol edin.',
    ],
    brands: [],
  },

  'hss-matkap': {
    metaDescription:
      'HSS ve HSS-Co (kobaltlı) matkaplar: çap, malzeme ve DIN standardına göre seçim, paslanmazda delme ipuçları. Teklif fişine ekleyin. Format Teknik.',
    overview: [
      'HSS (yüksek hız çeliği) matkaplar; genel amaçlı delme, bakım-onarım ve düşük-orta adetli üretim için ekonomik ve tok takımlardır. Titreşime ve kırılmaya karbür matkaplardan daha dayanıklıdır.',
      'Kobalt alaşımlı HSS-Co (HSS-E) matkaplar ısıya daha dayanıklıdır; paslanmaz çelik ve zor malzemelerde tercih edilir.',
    ],
    anatomy: {
      heading: 'Fişe nasıl yazılır?',
      segments: [
        { code: 'Ø6', label: 'Çap', meaning: '6 mm' },
        { code: 'HSS-Co', label: 'Malzeme', meaning: '%5 kobaltlı yüksek hız çeliği (HSS-E); genel işler için HSS' },
        { code: 'DIN 338', label: 'Boy / standart', meaning: 'Normal seri, silindirik saplı. Uzun seri: DIN 340; konik saplı: DIN 345' },
      ],
      note: 'Kaplama (TiN, TiAlN) ve uç açısı (118° ya da 135° çapraz bilemeli) tercihiniz varsa belirtin.',
    },
    specs: [
      { label: 'Çap', hint: 'Ör. Ø6' },
      { label: 'Malzeme', hint: 'HSS ya da HSS-Co' },
      { label: 'Boy / standart', hint: 'DIN 338, DIN 340, DIN 345 — ya da “kısa / uzun”' },
      { label: 'Kaplama', hint: 'Kaplamasız, TiN, TiAlN…' },
      { label: 'Adet / set', hint: 'Tek tek ya da set' },
    ],
    tips: [
      '135° çapraz bilemeli uçlar kendini merkezler; punta deliği olmadan kaymadan deler.',
      'Paslanmaz çelikte düşük devir, yüksek ilerleme ve bol soğutma kullanın; matkabı delikte boşta döndürmekten kaçının (yüzey sertleşir).',
      'Seri delik işlerinde karbür matkap toplam maliyeti düşürebilir; adetiniz yüksekse birlikte değerlendirelim.',
    ],
    brands: [],
  },

  'shrink-fit-holder': {
    metaDescription:
      'Shrink-fit (ısıl sıkma) takım tutucular: BT40, SK40, HSK bağlantı, sıkma çapı ve boy seçimi. Teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Shrink-fit (ısıl sıkma) takım tutucular, ısıtılıp genleştirilen tutucuya takımın yerleştirilmesi ve soğutulmasıyla takımı çok yüksek sıkma kuvveti ve düşük salgıyla tutar.',
      'Düşük salgı takım ömrünü uzatır ve yüzey kalitesini artırır; ince burun yapısı derin ve dar bölgelere erişim sağlar. Takım takıp sökmek için indüksiyonlu shrink-fit cihazı gerekir.',
    ],
    anatomy: {
      heading: 'Fişe nasıl yazılır?',
      segments: [
        { code: 'BT40', label: 'Tezgâh bağlantısı', meaning: 'İş mili konisi: BT40, SK40 (DIN 69871), HSK-A63, CAT40…' },
        { code: 'Ø12', label: 'Sıkma çapı', meaning: 'Takım sap çapı 12 mm' },
        { code: '90', label: 'Boy', meaning: 'Tutucunun burun boyu (A ölçüsü), mm' },
      ],
      note: 'Bağlama cıvatası (pull stud) tipi tezgâha göre değişir; gerekiyorsa belirtin.',
    },
    specs: [
      { label: 'Tezgâh bağlantısı', hint: 'BT40, SK40, HSK-A63, CAT40…' },
      { label: 'Sıkma çapı', hint: 'Ör. Ø6, Ø8, Ø10, Ø12' },
      { label: 'Boy', hint: 'A ölçüsü (mm); gerekiyorsa burun çapı' },
      { label: 'Balans', hint: 'Yüksek devirde çalışacaksa balans sınıfı ve devir' },
      { label: 'Pull stud', hint: 'Tezgâhınıza uygun bağlama cıvatası tipi' },
    ],
    tips: [
      'Takım sapının h6 toleranslı olması gerekir; en iyi sonuç karbür saplı takımlarla alınır.',
      'Yüksek devirde çalışacaksanız balanslı (ör. G2.5) tutucu isteyin.',
      'Uzun ve ince tutucular erişimi artırır ama rijitliği azaltır; işin gerektirdiği en kısa boyu seçin.',
    ],
    brands: [],
  },

  'pens-kayar-otomat': {
    metaDescription:
      'Kayar otomat (swiss-type) pensleri: ana ve karşı iş mili pensi, ağız ölçüsü ve şekli. Tezgâh modelinizi yazın, teklif fişine ekleyin. Format Teknik.',
    overview: [
      'Kayar otomat (swiss-type) tezgâhlarında malzeme ana iş milinde pensle tutulur ve kılavuz burç içinden ilerler; parça karşı iş milinde ikinci bir pensle alınarak arka işlemesi yapılır.',
      'Pens tipi tezgâhın markasına ve modeline göre değişir. Doğru pens için tezgâh modelini ve varsa pens üzerindeki tip kodunu belirtmek en hızlı yoldur.',
    ],
    anatomy: {
      heading: 'Fişe nasıl yazılır?',
      segments: [
        { code: 'Ana iş mili', label: 'Konum', meaning: 'Ana ya da karşı iş mili; kılavuz burç ayrı bir kalemdir' },
        { code: 'Ø12', label: 'Ağız ölçüsü', meaning: 'Tutulacak malzemenin çapı (altıgen ve karede anahtar ağzı), mm' },
        { code: 'Yuvarlak', label: 'Ağız şekli', meaning: 'Yuvarlak, altıgen ya da kare; düz ya da tırtıllı yüzey' },
      ],
      note: 'Tezgâh marka ve modelini (ör. Citizen, Star, Tsugami ve model adı) ve varsa pens üzerindeki tip kodunu ekleyin.',
    },
    specs: [
      { label: 'Tezgâh', hint: 'Marka ve model' },
      { label: 'Konum', hint: 'Ana ya da karşı iş mili' },
      { label: 'Ağız ölçüsü ve şekli', hint: 'Ör. Ø12 yuvarlak, 10 mm altıgen' },
      { label: 'Yüzey', hint: 'Düz ya da tırtıllı' },
      { label: 'Pens tip kodu', hint: 'Biliyorsanız pens üzerindeki kod' },
    ],
    tips: [
      'Malzeme çapına tam uyan ölçüde pens kullanın; çap toleransı dışındaki çubuk pensi ve parçayı zorlar.',
      'Tırtıllı ağız daha güçlü tutar ama yüzeyde iz bırakabilir; hassas yüzeylerde düz ağız tercih edin.',
      'Pens ve kılavuz burç birlikte aşınır; ölçü ve yüzey sorunlarında ikisini birlikte kontrol edin.',
    ],
    brands: [],
  },
}
