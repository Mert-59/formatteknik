# Ürün grubu metinleri — teknik kontrol

19 Kasım 2026. Dokuz grup sayfasının "Genel bakış" metinleri teknik olarak kontrol edildi ve düzeltilmiş hâlleri
**sitede uygulandı** (`src/data/guides.ts`). Aşağıda her grup için neyin değiştiği ve neden değiştiği var.

**Sizden beklenen:** Her grubu okuyup kutucuğu işaretleyin. Katılmadığınız ya da firmanızın uygulamasına uymayan bir
ifade varsa yanına not düşün; o cümleyi değiştiririm ya da kaldırırım. ⚠️ işaretli ifadeler genel sektör bilgisidir, sizin
tedarik ettiğiniz ürünlerle örtüştüğünü özellikle teyit edin.

Arama sonuçlarında görünen açıklamalar (metaDescription) doğruydu, değiştirilmedi.

---

## 1. Torna Uçları
- [ ] Onaylandı

| Değişiklik | Gerekçe |
|---|---|
| "Köşesi aşınan uç döndürülerek…" → "tutucuda döndürülerek **(çift taraflı uçlarda ters çevrilerek)**…" | CNMG, WNMG gibi negatif uçlar iki yüzlüdür; köşe sayısının yarısı arka yüzdedir. |
| "Şekil ve ölçüler ISO 1832 koduna göre **tüm üreticilerde aynıdır**" → kodun hangi kısmının standart olduğu açıkça yazıldı (şekil, boşluk açısı, tolerans, ölçü, kalınlık, köşe radyüsü) | Eski cümle fazla kesindi: kodun yalnızca ilk kısmı standarttır; talaş kırıcı ve kalite her üreticide farklıdır ve kodun sonuna eklenir. |
| Yeni: malzeme grupları **ISO P / M / K / N / S / H** | Uç seçimi önce malzeme grubuna göre yapılır; kataloglar da bu gruplarla düzenlenir. |

## 2. Takma Uçlu Freze
- [ ] Onaylandı

| Değişiklik | Gerekçe |
|---|---|
| Kullanım alanlarına **yüksek ilerlemeli frezeleme** eklendi | Takma uçlu gövdelerin önemli bir kullanım alanı. |
| Seçim ölçütlerine **bağlantı tipi (saplı / malafaya takılan kabuk tipi)** ve **diş adımı (seyrek, normal, sık)** eklendi | Gövde seçiminde ilk sorulan iki bilgi; eskiden yoktu. |
| Kısa açıklamada "köşe frezeleme" → "**omuz** frezeleme" (`catalog.ts`) | Sayfa metniyle aynı terim kullanılsın diye. |

## 3. Kılavuz
- [ ] Onaylandı

| Değişiklik | Gerekçe |
|---|---|
| "talaşı ileri iten **kanallı (gun nose)**" → "**spiral uçlu (gun nose)**" | Terim hatası: "gun nose" düz oluklu, ucu spiral taşlanmış kılavuzdur; "kanallı" her kılavuz için geçerli. |
| Yeni: **form (yoğurma) kılavuzları** | Talaşsız diş açan önemli bir tür hiç geçmiyordu. |
| Seçim ölçütlerine örnekler eklendi: diş tipi (M, MF, UNC, G…), tolerans (6H) | Müşterinin teklif fişine ne yazacağını kolaylaştırır. |
| Yeni: **DIN 371 / DIN 376** sap standartları | Format kılavuz kataloğunun başlığı "DIN 371 / 376"; sayfada açıklaması yoktu. |
| Yeni: **diş dibi delik çapı** (M8x1,25 → Ø6,8 mm; form kılavuzunda daha büyük) | En sık sorulan soru; yanlış delik çapı kılavuz kırılmasının başlıca nedeni. |

## 4. Karbür Matkap
- [ ] Onaylandı

| Değişiklik | Gerekçe |
|---|---|
| Yeni: **rijit bağlama ve düşük salgı** gereksinimi (hidrolik / shrink-fit tutucu) | Karbür matkabın kırılmaması için temel şart; eskiden yazmıyordu. |
| Yeni: **boy oranı (xD)** açıklaması ve örnek (Ø8 3xD ≈ 24 mm) | Kısa açıklamada "farklı boy oranları" geçiyor ama ne olduğu anlatılmıyordu. |
| İç soğutma: "özellikle **5xD ve üzeri** derin deliklerde"; "iş milinden **(ya da tutucudan)** soğutma" | Daha kesin ifade; tutucudan soğutma da bir seçenek. |

## 5. Karbür Freze
- [ ] Onaylandı

| Değişiklik | Gerekçe |
|---|---|
| "Tek parça" → "**Yekpare** karbür" | Sektörde kullanılan terim (Mitsubishi kataloğunun başlığında da "Yekpare"). |
| ⚠️ Yeni: malzemeye göre örnek — **alüminyumda 2–3 ağız, kaplamasız ya da DLC; çelikte 4+ ağız, TiAlN / AlTiN** | Genel uygulama; tedarik ettiğiniz serilerle örtüştüğünü teyit edin. |
| "radyuslu" / "radyüslü" yazımı **radyüslü** olarak eşitlendi (`catalog.ts`) | Tutarlılık. |

## 6. Ölçü Aletleri
- [ ] Onaylandı

| Değişiklik | Gerekçe |
|---|---|
| Yeni: **10:1 kuralı** (cihaz hassasiyeti ≈ toleransın onda biri) | Cihaz seçiminin temel kuralı; "toleransa uygun çözünürlük" cümlesini somutlaştırır. |
| ⚠️ Yeni: **toz ve soğutma sıvısına dayanıklı (IP65)** modeller | Mitutoyo'nun bu sınıfta modelleri var; tedarik ettiğinizi teyit edin. |

## 7. HSS Matkap
- [ ] Onaylandı

| Değişiklik | Gerekçe |
|---|---|
| "HSS-Co (HSS-E)" → "HSS-Co (**HSS-E olarak da anılır; genellikle %5 ya da %8 kobalt**)" | Eski metin ikisini tek bir tür gibi gösteriyordu; kobalt oranı belirtildi. |
| "ısıya daha dayanıklıdır" → "**yüksek sıcaklıkta sertliğini daha iyi korur**" | Teknik olarak doğru ifade. |
| Yeni: **kaplamalar** (TiN, TiAlN) | Ürün açıklamasında "farklı kaplamalar" geçiyordu. |
| Yeni: **DIN 338 / 340 / 1869 / 345** boy ve sap standartları | Kataloglarınızın başlıkları DIN 338 ve DIN 1869; müşteri bu numaralarla arar. |

## 8. Shrink-Fit Holder
- [ ] Onaylandı

| Değişiklik | Gerekçe |
|---|---|
| Yeni: takım sapı **h6 toleranslı** olmalı; en çok karbür saplı takımlarla kullanılır | Shrink-fit'in temel şartı; yanlış takımla kullanılmasın. |
| Yeni: tutucu seçimi — **tezgâh bağlantısı (BT, SK, HSK…), sap çapı, boy** | Teklif fişinde "BT40 Ø12" gibi yazılmasını kolaylaştırır (örnek kod alanıyla aynı). |

## 9. Pens Kayar Otomat
- [ ] Onaylandı

| Değişiklik | Gerekçe |
|---|---|
| Malzemenin **iş miliyle birlikte** ilerlediği ve **kesmenin kılavuz burcun önünde** yapıldığı eklendi | Kayar otomatın asıl farkı (uzun, ince parçaların eğilmeden işlenmesi) anlatılmıyordu. |
| ⚠️ Yeni: tezgâh markası örnekleri (**Citizen, Star, Tsugami**) | Türkiye'de yaygın kayar otomat markaları; tedarik ettiğiniz pens tipleriyle örtüştüğünü teyit edin. |
| Yeni: **yuvarlak, altıgen, kare profil** pensleri; belirtilecekler listesine **malzeme çapı** | Doğru pens için gereken bilgi eksikti. |

---

## Yeni gruplar (23 Kasım 2026)

Bu üç grubun "Genel bakış" metinleri sıfırdan yazıldı (eklenen katalogların içeriğine ve genel sektör bilgisine dayanarak).
Okuyup işaretleyin; firmanızın kullandığı terimlerle örtüşmeyen ifadeyi not edin.

## 10. CNC Torna Aynası
- [x] Onaylandı (23 Kasım 2026)

| İçerik | Not |
|---|---|
| Hidrolik ayna tanımı ve CNC'de neden tercih edildiği | Genel bilgi. |
| Seçim ölçütleri: ayak sayısı, çap, açık / kapalı merkez, iş mili burnu (**A2-5, A2-6, A2-8**) | AUTOGRIP föyündeki adaptör tipleriyle (A5, A6, A8) uyumlu. |
| Sert / yumuşak ayak farkı; teklifte belirtilecekler (çap, ayak sayısı, burun tipi, **çektirme dişi**, ör. M60x2) | ⚠️ "Çektirme dişi" ifadesi AUTOGRIP föyündeki terimdir; sizin kullandığınız terimle aynı mı, teyit edin. |

## 11. Pens Tutucular
- [x] Onaylandı (23 Kasım 2026)

| İçerik | Not |
|---|---|
| Pens tutucunun çalışma şekli (somun → pens → konik yuva) | Genel bilgi. |
| **ER (DIN 6499 / ISO 15488)** ve **OZ (DIN 6388)** pensleri; ER32 ile 2–20 mm örneği | Kraft kataloğundaki standart ve kapasitelerle aynı. |
| Bağlantı tipleri **BT30/40/50, SK (DIN 69871), ISO (DIN 2080)**; teklif örneği "BT40 ER32 100 mm" | Katalogdaki kod yapısı: BT40.ER32.100. |

## 12. Kater Tarama Kafası
- [x] Onaylandı (23 Kasım 2026)

| İçerik | Not |
|---|---|
| Kater = takma uçlu takım gövdesi; **ISO 5608** kodu örneği (PCLNR 2525 M12) | Teknik, AKKO ve SMOXH kataloglarının hepsinde bu kod yapısı var. |
| Tarama kafaları (alın frezeleri) ve seçim ölçütleri | ⚠️ "Tarama kafası" ile "Takma Uçlu Freze" grubu kısmen örtüşür; iki grubun ayrımı size uygun mu, teyit edin. |
| Delik büyütme kafaları ve baraları | Teknik ve AKKO kataloglarında yer alıyor. |

---

Onayladıktan sonra `src/data/guides.ts` başındaki "firma onayı bekliyor" notu kaldırılır ve bu dosya silinebilir.
