# Yapılacaklar

Son güncelleme: 19 Kasım 2026

## Sizden beklenen içerik

- [x] **Carmon logosu.** 19 Kasım 2026: eklendi (arka planı temizlendi → `public/brands/carmon.png`). Elimizdeki dosya küçük (170 px); daha büyük ya da SVG sürüm gelirse değiştirilebilir.
- [x] **Format logosu.** 19 Kasım 2026: eklendi (`public/brands/format.png`, şeffaf, 576 px — gönderilen JPG'den daha net olduğu için bu kullanıldı).
- [x] **Star Tool logosu.** 19 Kasım 2026: mevcut dosya (250×23 piksel) olduğu gibi kalıyor.
- [x] **Paylaşım görseli.** `public/og-image.png` (1200×630) hazırlandı ve `index.html`'e eklendi. Kendi görselinizi kullanmak isterseniz aynı adla değiştirmeniz yeterli.
- [x] **Çalışma saatleri.** `src/config/site.ts` → `hours` dolduruldu (`Hafta içi 09.00-18.00`).
- [ ] **Teklife dönüş süresi.** `src/config/site.ts` → `replyTime` (ör. `'aynı iş günü içinde'`). Boşken fiş gönderildikten sonra "en kısa sürede dönüş yapacağız" yazar; doldurulunca bu süre yazılır ve İletişim sayfasında da görünür.

### Kurumsal sayfa bilgileri — `src/data/company.ts`

Boş bırakılan alan sitede **hiç gösterilmez**; doldurdukça ilgili bölüm kendiliğinden belirir. Bölüm numaraları da kendiliğinden sıralanır.

- [ ] **Fotoğraflar** (depo, ofis, ekip) → dosyaları `public/kurumsal/` klasörüne koyun, `photos` listesine ekleyin:
      `{ src: '/kurumsal/depo.jpg', alt: 'Çorlu deposunda kesici uç rafları', caption: 'Depomuz' }`
      Yatay, en az 1600 piksel genişlikte fotoğraf önerilir. 3 ya da daha fazla fotoğrafta ilki büyük gösterilir.
- [ ] **Referans firmalar** (yalnızca izin alınanlar) → `references` listesine:
      `{ name: 'Firma Adı', sector: 'Otomotiv' }` — logo varsa `logo: '/kurumsal/referanslar/firma.svg'` ekleyin.

- [x] **Kuruluş yılı:** 2024 (`foundedYear`, 19 Kasım 2026) — Kurumsal sayfasının üst satırında "KURULUŞ 2024".
- [x] **Fotoğraflar:** 19 Kasım 2026 itibarıyla fotoğraf yok; bölüm gizli kalıyor.

Not: `deliveryTime` ve `deliveryArea` (teslimat) alanları Kurumsal sayfasındaki rakamlar şeridinde
gösteriliyordu; şerit 8 Kasım 2026'da kaldırıldı. Bu alanlar şu an sitede **hiçbir yerde görünmez** — doldurmak isterseniz nerede
gösterileceğine birlikte karar verelim.
Sektör açıklamaları da `src/data/company.ts` içinde (`SECTORS`); dilediğiniz gibi düzenleyebilirsiniz.

Logo dosyalarını proje klasörüne bırakmanız yeterli. Arka planı temizlenip `public/brands/` klasörüne işlenmeleri ve `src/data/brands.ts` dosyasına eklenmeleri gerekiyor.

### Ürün grubu sayfaları — `src/data/guides.ts`

Dokuz grubun sayfası (`/urunler/torna-uclari` vb.) **taslak** metinlerle yayında. Teknik doğruluğu sizin gözden geçirmeniz gerekiyor;
her grup için sayfa açıklaması ve "Genel bakış" metni aynı dosyada.

- [ ] Torna Uçları
- [ ] Takma Uçlu Freze
- [ ] Kılavuz
- [ ] Karbür Matkap
- [ ] Karbür Freze
- [ ] Ölçü Aletleri
- [ ] HSS Matkap
- [ ] Shrink-Fit Holder
- [ ] Pens Kayar Otomat
- [ ] **Marka–grup eşleşmesi.** Her grubun `brands` listesine o grupta tedarik edilen markaları yazın, ör. `brands: ['Mitsubishi', 'OSG']`.
      Adlar `src/data/brands.ts`'teki gibi yazılmalı; logosu olan marka logosuyla görünür. Liste boşken "Markalar" bölümü gösterilmez.

### PDF kataloglar — `src/data/catalogs.ts`

Eski siteden 11 katalog alındı (8 Kasım 2026); büyükler ekran için sıkıştırıldı. Kontrol edilmesi gerekenler:

- [x] **Mitutoyo kataloğu Fransızca (2019 baskısı, içinde 2019 euro fiyatları var)** — 8 Kasım 2026: olduğu gibi kalması kararlaştırıldı.
      İleride güncel baskı gelirse `public/kataloglar/mitutoyo-olcu-aletleri.pdf` dosyasını değiştirip `catalogs.ts`'te sayfa / dil bilgisini güncelleyin.
- [ ] **Shrink-Fit Holder grubunun kataloğu yok.** Eski sitede de "MTS Katalog" sayfası boştu. PDF gelirse ekleyin.
- [ ] **IZAR "kataloğu" tek sayfalık bir ürün föyü** (TEMAK kataloğunun 150. sayfası). Tam katalog varsa değiştirin.
- [ ] Katalog başlıklarını gözden geçirin (PDF kapaklarından çıkarıldı).
- [x] **18 Kasım 2026 güncellemesi** (kaynak: proje klasöründeki `Kataloglar/`): Carmon yeni katalog (Multi Purpose Taps 2024–2025, 20 sayfa),
      Format HSS yeni baskı (13 sayfa; karbür matkap sayfaları çıkmış, paslanmaz kılavuz sayfası eklenmiş),
      Mitsubishi MMT diş tornalama uçları eklendi (Torna Uçları grubu). Klasördeki diğer 6 PDF sitedekilerle aynı içerikte.
- [x] **Carmon kataloğunda Euro liste fiyatları var** (Mitutoyo'daki gibi) — 18 Kasım 2026: olduğu gibi kalması kararlaştırıldı.
- [x] **Yeni klasörde olmayan 3 katalog** — SANOWA (Eco kampanya 2025), IZAR (ürün föyü), Gisstec (kayar otomat pensleri):
      18 Kasım 2026: eski hâlleriyle kalması kararlaştırıldı.

Yeni katalog eklemek için `catalogs.ts` dosyasının başındaki açıklamaya bakın.

## Geliştirme listesi — 18 Kasım 2026 site incelemesi

Sitenin 8 sayfası masaüstü ve telefonda incelendi. Teknik denetim temiz (konsol hatası, kırık görsel, adsız düğme, yatay kayma yok).
Öncelik sırası en altta. **(siz)** = sizden bilgi/içerik gerekiyor; diğerleri sitede yapılabilir.

### Tüm sayfalar
- [x] **1. Kataloglar üst menüye (ve mobil menüye) eklensin.** Şu an yalnızca altbilgide ve ürünler sayfasında bağlantı olarak var.
- [x] **2. Altbilgi telefonda sıkıştırılsın.** ~1,5 ekran; iletişim bilgisi, sayfa listesi, "Girişi izle" ve büyük yazı her sayfada tekrarlanıyor.
- [x] **3. Telefonda dokunma alanları büyütülsün.** Altbilgi bağlantıları 16 px, metin içi bağlantılar 20 px yüksek; en az 24 px olmalı.
- [x] **4. Telefonda hızlı iletişim:** 19 Kasım 2026 — sağ altta "Ara | WhatsApp" hapı (`src/components/QuickContact.tsx`). fişte kalem yokken ekranda sabit WhatsApp / Ara düğmesi yok.

### Anasayfa
- [x] **5. Telefonda açılış ekranının alt üçte biri boş.** 19 Kasım 2026 — anasayfada kod alanı + "Son fişiniz / Açık fişiniz" (`src/components/HeroCode.tsx`). Doğrudan kod yazma alanı; dönen müşteriye "Son fişiniz: FT-… · Tekrarla".
- [ ] **6. Güven unsurları (siz):** fotoğraf, kuruluş yılı, teslimat bilgisi, referanslar (bkz. "Kurumsal sayfa bilgileri").
- [x] **7. Kataloglar anasayfada hiç geçmiyor.** 19 Kasım 2026 — katalog şeridi (sayılar `catalogs.ts`'ten). "12 katalog · 2.217 sayfa" gibi kısa bir şerit.
- [x] **8. Dil tutarlılığı:** "Kodla sipariş verin", "Üç adımda sipariş" — süreç bir teklif talebi; "teklif" demek beklentiyi doğru kurar.
- [x] **9. Marka duvarı:** 19 Kasım 2026 — Carmon ve Format logoları eklendi; Star Tool olduğu gibi kalıyor.

### Ürünlerimiz ve ürün grubu sayfaları
- [x] **10. Otomatik grup tahmini:** 19 Kasım 2026 — `src/cart/guess.ts`, örnek tablosu `npm run test:guess`. `CNMG 120408` yazılınca "Torna Uçları", `M8x1.25` yazılınca "Kılavuz" kendiliğinden seçilsin.
- [ ] **11. Grup sayfalarında "Markalar" bölümü görünmüyor (siz):** marka–grup eşleşmesi boş; genel bakış metinleri taslak.
- [x] **12. Telefonda teklif formu ikinci ekranda:** büyük teknik çizim formun önünde; çizim küçültülsün.

### Kataloglar
- [ ] **13. 40 MB'ı aşan PDF'ler telefonda mobil veriyle açılıyor:** "Wi-Fi önerilir" notu; Faz 1'de "çevrimdışı kaydet".
- [ ] **14. Büyük kataloglara içindekiler:** bölümlere doğrudan giden bağlantılar (ör. "Diş tornalama → s. 412"); bölümler elle çıkarılmalı.

### Kurumsal ve İletişim
- [x] **15. Telefonda kartlar çok yüksek:** İletişim'de 5 kart haritadan önce ~2,5 ekran; Kurumsal'daki sektör kartları çok boş. Sıkı liste.
- [ ] ~~**16. "Şu an açık / kapalı" göstergesi**~~ — 19 Kasım 2026: gerek görülmedi.
- [ ] **17. Teklife dönüş süresi (siz):** `src/config/site.ts` → `replyTime` hâlâ boş.

### Yasal ve teknik
- [ ] **18. Ticaret unvanı, MERSİS ve KVKK aydınlatma metni (siz) — hukuki risk.** Eski site başlığında unvan "Format Kesici Takım Ltd. Şti."; bilgilerin sitede bulunması gerekebilir.
- [x] **19. Yazı tipleri siteye gömülsün:** şu an Google'dan geliyor. Ziyaretçi IP'si Google'a gitmez (KVKK), site hızlanır, uygulama çevrimdışıyken garanti.
- [ ] **20. Ölçüm:** çerezsiz bir analitik aracıyla gönderilen fiş, indirilen katalog sayıları.

### Önerilen sıra
1. Unvan, MERSİS, KVKK metni (18)
2. ~~Hızlı düzeltmeler: 1, 2, 3, 8, 12, 15, 19~~ — 19 Kasım 2026 tamamlandı (16 çıkarıldı)
3. ~~Otomatik grup tahmini (10), anasayfada kod alanı / son fişiniz (5)~~ — 19 Kasım 2026 tamamlandı (4 ve 7 ile birlikte)
4. Güven içeriği ve marka eşleşmesi (6, 9, 11, 17)
5. Faz 1: katalogları çevrimdışı kaydet, büyük kataloglara içindekiler (13, 14)

## Yayına almadan önce

- [ ] **Firma bilgilerini son kez kontrol edin.** Telefon, WhatsApp numarası, e-posta ve adres `src/config/site.ts` dosyasında.
- [ ] **Gerçek telefonda deneme siparişi verin.** Fişe birkaç kalem ekleyip WhatsApp ile gönderin. Mesaj doğru numaraya, düzgün biçimde gitmeli.
- [ ] **Barındırma hizmetini seçin.** Vercel, Netlify ve cPanel (Apache) için ayarlar hazır, yönlendirmeler de üçünde çalışır (`README.md` → "Yayına alma").
      cPanel'de `dist/` içindeki gizli `.htaccess` dosyası mutlaka yüklenmeli; yoksa eski site adresleri 404 verir.
- [ ] **DNS:** hem `formatteknik.com.tr` hem `www.formatteknik.com.tr` yeni sunucuyu göstermeli. Sitenin tek adresi `https://www.formatteknik.com.tr`; diğeri buraya yönlenir.
- [ ] **`npm run build` çalıştırın.** Oluşan `dist/` klasörü yayına alınacak klasördür.
- [ ] **Yayından önce:** `npm run preview` açıkken `npm run check:redirects` — eski 38 adresin hepsi ✓ olmalı.
- [ ] **Uygulama (ana ekrana ekleme) — gerçek telefonlarda** (yayından sonra, https adresinde; bilgisayardan taklit edilemez):
  - Android / Chrome: menüde "Uygulamayı yükle" çıkmalı; simge Format Teknik logosu olmalı; açılınca adres çubuğu olmamalı.
  - iPhone / Safari: Paylaş → "Ana Ekrana Ekle"; simge ve ad "Format Teknik" olmalı.
  - Uygulamayı bir kez açtıktan sonra uçak modunda tekrar açın: sayfalar ve teklif fişi çalışmalı (PDF'ler internet ister).

## Yayın günü

- [ ] **Yayından hemen sonra:** `npm run check:redirects -- https://www.formatteknik.com.tr` — eski adresler ve `www` / `https` yönlendirmesi yayındaki sitede denenir. ✗ çıkarsa eski siteye dönmeden önce birlikte bakalım.
- [ ] **Google Search Console** (search.google.com/search-console; site sahibinin Google hesabıyla):
  1. `https://www.formatteknik.com.tr` mülkü yoksa ekleyin ve doğrulayın (alan adı mülkü — DNS TXT kaydıyla — en kapsamlısıdır).
  2. **Site haritaları** → eski `/tr/sitemap.xml` kaydı varsa kaldırın, `sitemap.xml` ekleyin.
  3. **URL denetimi** → anasayfa ve `/urunler` için "Dizine eklenmesini iste".
  4. İlk 4 hafta, haftada bir **Sayfalar** raporunda "Bulunamadı (404)" listesine bakın. Orada eski bir adres görünürse
     `vercel.json` → `redirects`'e bir satır eklenir; derleme `.htaccess`'i kendiliğinden günceller.
- [ ] **Google İşletme Profili** varsa: web sitesi adresini `https://www.formatteknik.com.tr` olarak güncelleyin.
- [ ] **Yüklemeden önce eski sitenin tam yedeğini alın** (cPanel → Yedekleme ya da barındırıcınızın paneli): bir sorun çıkarsa dakikalar içinde geri dönülebilsin.
