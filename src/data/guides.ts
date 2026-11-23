/**
 * Ürün grubu sayfalarının içeriği (/urunler/<grup>).
 * Teknik kontrol: 19 Kasım 2026 (Claude) — firma onayı bekliyor; değişiklikler ve gerekçeleri METIN-KONTROLU.md'de.
 * CNC Torna Aynası, Pens Tutucular, Kater Tarama Kafası: 23 Kasım 2026'da eklendi; metinleri de onay bekliyor (METIN-KONTROLU.md, 10–12).
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
      'Torna uçları: dış çap, iç çap, kanal ve diş tornalama için takma uçlar. PDF kataloglar; kodu yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Torna uçları; dış çap, iç çap, alın, kanal ve diş tornalama operasyonlarında takım tutucuya bağlanan, değiştirilebilir kesici uçlardır. Kesme köşesi aşınan uç, tutucuda döndürülerek (çift taraflı uçlarda ters çevrilerek) bir sonraki köşeyle kullanılır.',
      'Ucun şekli, boşluk açısı, toleransı, ölçüsü, kalınlığı ve köşe radyüsü ISO 1832 koduyla tanımlanır (ör. CNMG 120408); bu kısım üreticiden bağımsızdır. Talaş kırıcı geometrisi ve kalite (karbür sınıfı ve kaplama) ise üreticiye özeldir ve kodun sonuna eklenir.',
      'Doğru uç; işlenen malzeme grubuna (ISO P çelik, M paslanmaz, K döküm, N alüminyum, S süper alaşım ve titanyum, H sertleştirilmiş çelik), operasyona (kaba, orta, hassas) ve tezgâhın rijitliğine göre seçilir.',
    ],
    brands: [],
  },

  'takma-uclu-freze': {
    metaDescription:
      'Takma uçlu freze gövdeleri ve uçları: alın, omuz ve kopya frezeleme. PDF katalog; kodu yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Takma uçlu frezeler, değiştirilebilir kesici uçların bağlandığı freze gövdeleridir. Uçlar aşındığında gövde değişmez; uçlar döndürülür ya da yenilenir. Alın, omuz (90°), kopya ve yüksek ilerlemeli frezelemede yüksek talaş kaldırma için ekonomik bir çözümdür.',
      'Gövde; bağlantı tipine (saplı ya da malafaya takılan kabuk tipi), tezgâhın gücüne, işlenecek yüzeyin genişliğine, yaklaşma açısına (ör. 45°, 90°) ve diş adımına (seyrek, normal, sık) göre seçilir. Uç tipi gövdeye özeldir: siparişte gövdeyle uyumlu uç kodunu belirtmek gerekir.',
    ],
    brands: [],
  },

  kilavuz: {
    metaDescription:
      'Makine kılavuzları: kör ve boydan boya delikler için, farklı malzemelere uygun kılavuzlar. PDF kataloglar; kodu yazın, teklif fişine ekleyin. Format Teknik.',
    overview: [
      'Makine kılavuzları, delinmiş deliğe iç vida dişi açar. Kör deliklerde talaşı yukarı atan helis oluklu, boydan boya deliklerde talaşı ileri iten spiral uçlu (gun nose) kılavuzlar kullanılır. Form (yoğurma) kılavuzları ise talaş çıkarmadan dişi şekillendirir; sünek malzemelerde daha dayanıklı diş verir.',
      'Kılavuz; diş tipi ve ölçüsüne (M, MF, UNC, G…), tolerans sınıfına (ör. 6H), delik tipine ve işlenen malzemeye göre seçilir. Sap ölçüsü DIN 371 (takviyeli sap, küçük çaplar) ya da DIN 376 (diş çapından ince sap; derin dişler ve büyük çaplar) standardındadır.',
      'Diş açmadan önce doğru çapta delik delinmelidir: kesme kılavuzunda M8x1,25 için Ø6,8 mm. Form kılavuzları daha büyük delik çapı ister.',
    ],
    brands: [],
  },

  'karbur-matkap': {
    metaDescription:
      'Karbür matkaplar: soğutma kanallı ve kanalsız, farklı boy oranlarında. PDF katalog; kodu yazın, teklif fişine ekleyin, WhatsApp’tan gönderin. Format Teknik.',
    overview: [
      'Karbür matkaplar, HSS matkaplara göre çok daha yüksek kesme hızlarında, daha hassas ölçü ve daha iyi yüzeyle delik deler; seri üretimde çevrim süresini belirgin şekilde kısaltır. Bunun için rijit bağlama ve düşük salgı gerekir (ör. hidrolik ya da shrink-fit tutucu).',
      'Boy oranı (xD), delinebilecek derinliğin matkap çapına oranıdır: Ø8 3xD bir matkap yaklaşık 24 mm derinliğe kadar deler. Soğutma kanallı (iç soğutmalı) modeller soğutma sıvısını doğrudan uca ulaştırır ve özellikle 5xD ve üzeri derin deliklerde talaş tahliyesini sağlar. Bunun için tezgâhta iş milinden (ya da tutucudan) soğutma gerekir.',
    ],
    brands: [],
  },

  'karbur-freze': {
    metaDescription:
      'Karbür parmak frezeler: düz, küre ve köşe radyüslü; kaba ve hassas işleme için. PDF katalog; kodu yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Yekpare karbür parmak frezeler; kanal, cep, profil ve yüzey işlemede kullanılan tek parça kesici takımlardır. Ağız sayısı, helis açısı, uç şekli ve kaplama işlenen malzemeye göre seçilir: alüminyumda genellikle 2–3 ağız ve kaplamasız ya da DLC kaplı, çelikte 4 ve daha fazla ağız ve TiAlN / AlTiN türü kaplamalı frezeler kullanılır.',
      'Düz uçlu frezeler dik köşe ve düz taban, küre uçlu frezeler 3B yüzey ve kalıp, köşe radyüslü frezeler ise daha dayanıklı kesme kenarı ve radyüslü köşe için kullanılır.',
    ],
    brands: [],
  },

  'olcu-aletleri': {
    metaDescription:
      'Mikrometre, kumpas, komparatör ve diğer hassas ölçüm cihazları. PDF katalog; kodu yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Hassas ölçüm, talaşlı imalatta kalitenin temelidir. Mikrometre, kumpas, komparatör ve diğer ölçüm cihazları; parçanın toleransına uygun çözünürlük ve ölçüm aralığıyla seçilir. Genel kural olarak cihazın hassasiyeti, ölçülen toleransın yaklaşık onda biri olmalıdır.',
      'Dijital modeller okuma hatasını azaltır; veri çıkışlı olanlar ölçüleri doğrudan bilgisayara ya da istatistiksel proses kontrol (SPC) yazılımına aktarabilir. Atölye ortamı için toz ve soğutma sıvısına dayanıklı (ör. IP65) modeller tercih edilir.',
    ],
    brands: [],
  },

  'hss-matkap': {
    metaDescription:
      'HSS ve HSS-Co (kobaltlı) matkaplar: genel amaçlı delme ve paslanmaz çelik için. PDF kataloglar; kodu yazın, teklif fişine ekleyin. Format Teknik.',
    overview: [
      'HSS (yüksek hız çeliği) matkaplar; genel amaçlı delme, bakım-onarım ve düşük-orta adetli üretim için ekonomik ve tok takımlardır. Titreşime ve kırılmaya karbür matkaplardan daha dayanıklıdır.',
      'Kobalt alaşımlı HSS-Co matkaplar (HSS-E olarak da anılır; genellikle %5 ya da %8 kobalt) yüksek sıcaklıkta sertliğini daha iyi korur; paslanmaz çelik ve zor malzemelerde tercih edilir. Kaplamalar (ör. TiN, TiAlN) takım ömrünü uzatır.',
      'Boy ve sap tipi DIN standardıyla belirtilir: DIN 338 normal boy silindirik saplı, DIN 340 uzun, DIN 1869 ekstra uzun, DIN 345 konik (mors) saplı.',
    ],
    brands: [],
  },

  'shrink-fit-holder': {
    metaDescription:
      'Shrink-fit (ısıl sıkma) takım tutucular: BT40, SK40, HSK bağlantılar. Kodu ya da ölçüyü yazın, teklif fişine ekleyin. Format Teknik, Çorlu.',
    overview: [
      'Shrink-fit (ısıl sıkma) takım tutucular, ısıtılıp genleştirilen tutucuya takımın yerleştirilmesi ve soğutulmasıyla takımı çok yüksek sıkma kuvveti ve düşük salgıyla tutar. Takım sapının h6 toleranslı olması gerekir; en çok karbür saplı takımlarla kullanılır.',
      'Düşük salgı takım ömrünü uzatır ve yüzey kalitesini artırır; ince burun yapısı derin ve dar bölgelere erişim sağlar. Takım takıp sökmek için indüksiyonlu shrink-fit cihazı gerekir. Tutucu; tezgâh bağlantısına (BT, SK, HSK…), takım sap çapına ve gereken boya göre seçilir.',
    ],
    brands: [],
  },

  'pens-kayar-otomat': {
    metaDescription:
      'Kayar otomat (swiss-type) pensleri: ana ve karşı iş mili pensleri. PDF katalog; tezgâh modelinizi yazın, teklif fişine ekleyin. Format Teknik.',
    overview: [
      'Kayar otomat (swiss-type) tezgâhlarında malzeme ana iş milinde pensle tutulur ve iş miliyle birlikte kılavuz burç içinden ilerler. Kesme kılavuz burcun hemen önünde yapıldığı için uzun ve ince parçalar eğilmeden işlenir; parça karşı iş milinde ikinci bir pensle alınarak arka işlemesi yapılır.',
      'Pens tipi tezgâhın markasına ve modeline göre değişir (ör. Citizen, Star, Tsugami); yuvarlak, altıgen ve kare profiller için ayrı pensler vardır. Doğru pens için tezgâh modelini, malzeme çapını ve varsa pens üzerindeki tip kodunu belirtmek en hızlı yoldur.',
    ],
    brands: [],
  },

  'cnc-torna-aynasi': {
    metaDescription:
      'CNC torna aynaları: hidrolik ve üniversal aynalar, sert ve yumuşak ayaklar, flanşlar, puntalar. PDF kataloglar; teklif fişine ekleyin. Format Teknik.',
    overview: [
      'Torna aynası, iş parçasını tezgâhın iş miline bağlayan ve dönüş sırasında merkezde tutan bağlama elemanıdır. CNC tornalarda çoğunlukla arkadaki hidrolik silindirle çalışan aynalar kullanılır: sıkma kuvveti ayarlanabilir, ayaklar otomatik açılıp kapanır ve seri üretimde bağlama süresi kısalır.',
      'Ayna; ayak sayısına (2, 3 ya da 4 ayaklı), çapına, merkezinin açık ya da kapalı olmasına (çubuktan işlemede açık merkezli) ve iş mili burnuna bağlantısına (ör. A2-5, A2-6, A2-8 — doğrudan ya da flanşla) göre seçilir.',
      'Sert ayaklar dişli yüzeyle aynaya bağlanır ve tekrar tekrar kullanılır; yumuşak ayaklar ise parçanın çapına göre tornalanarak hassas ve iz bırakmayan bağlama sağlar. Teklif için ayna çapını, ayak sayısını, iş mili burun tipini ve çektirme dişi ölçüsünü (ör. M60x2) belirtin.',
    ],
    brands: [],
  },

  'pens-tutucular': {
    metaDescription:
      'Pens tutucular: BT, SK ve ISO bağlantılı ER ve OZ pens başlıkları, pensler, somunlar. PDF katalog; kodu yazın, teklif fişine ekleyin. Format Teknik.',
    overview: [
      'Pens tutucular (pens başlıkları), matkap, parmak freze ve kılavuz gibi silindirik saplı takımları frezede ve işleme merkezinde bağlamak için kullanılır. Takım yarıklı bir pensin içine yerleştirilir; somun sıkıldıkça pens konik yuvasında daralır ve sapı her yönden eşit kuvvetle kavrar.',
      'En yaygın sistem ER pensleridir (DIN 6499 / ISO 15488): her pens belirli bir çap aralığını tuttuğu için az sayıda pensle geniş bir aralık karşılanır (ör. ER32 ile 2–20 mm). Eski tezgâhlarda yaygın olan OZ (DIN 6388) pensleri de bu grupta yer alır.',
      'Tutucu; tezgâh bağlantısına (BT30 / 40 / 50, SK — DIN 69871, ISO — DIN 2080), pens tipine ve boyuna göre seçilir. Teklif için bağlantı tipini, pens ölçüsünü ve boyu belirtin (ör. BT40 ER32 100 mm); pens de isteniyorsa tutulacak sap çapını ekleyin.',
    ],
    brands: [],
  },

  'kater-tarama-kafasi': {
    metaDescription:
      'Torna katerleri, tarama (alın frezeleme) kafaları, delik büyütme kafaları ve baraları. PDF kataloglar; kodu yazın, teklif fişine ekleyin. Format Teknik.',
    overview: [
      'Kater, takma ucu tezgâha bağlayan takım gövdesidir. Torna katerleri dış çap, iç çap (bara), kanal ve diş tornalamada kullanılır; ISO 5608 kodu (ör. PCLNR 2525 M12) bağlama tipini, uç şeklini, yaklaşma açısını, yönü (sağ / sol), sap kesitini, boyu ve uç ölçüsünü tanımlar.',
      'Tarama kafaları (alın frezeleri), takma uçlarla geniş yüzeyleri düzlemek için kullanılan freze gövdeleridir. Seçimi çap, yaklaşma açısı (ör. 45°, 90°), ağız sayısı ve uç tipi belirler; gövde malafaya ya da doğrudan tutucuya bağlanır.',
      'Delik büyütme kafaları ve baraları, delinmiş bir deliği hassas çap ve yüzey kalitesine getirir; ayarlanabilir kafalarda çap ince ayarla belirlenir. Teklif için ürün kodunu ya da tezgâh bağlantısını, çapı ve uç tipini belirtin.',
    ],
    brands: [],
  },
}
