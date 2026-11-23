# Yapılacaklar

Son güncelleme: 23 Kasım 2026

## 23 Kasım 2026 — kataloglar ve yeni ürün grupları

- Karbür Freze: **Boomerang Carbide** 2026 kataloğu (164 s., 62 → 10 MB sıkıştırıldı).
- Pens Kayar Otomat: Gisstec kataloğu **kaldırıldı**, yerine **Schlenker** (136 s., İngilizce). Eski sitenin Gisstec PDF adresi artık Schlenker kataloğuna yönlenir.
- Ölçü Aletleri: **ASIMETO** kataloğu (85 s.).
- Yeni gruplar (sayfaları, site haritası ve menüdeki listeler kendiliğinden oluştu): **CNC Torna Aynası** (AUTOGRIP föyü, TUMA),
  **Pens Tutucular** (Kraft Werkzeuge), **Kater Tarama Kafası** (Teknik Cutting Tools, AKKO, SMOXH). Ürün grubu sayısı 9 → 12, katalog 12 → 20.
- Kod tahmini yeni gruplar için genişletildi ("BT40 ER32" → Pens Tutucular, "PCLNR 2525 M12" ve "kater" → Kater Tarama Kafası, "ayna" → CNC Torna Aynası).
- **(siz)** Yeni üç grubun metinleri onay bekliyor: `METIN-KONTROLU.md` 10–12.
- Not: Teknik (46 MB) ve AKKO (45 MB) katalogları da 40 MB'ı aşıyor (bkz. madde 13). Teknik kataloğu sıkıştırılamadı:
  Ghostscript bu dosyadaki bir yazı tipini hatalı çiziyor, sıkıştırma rakamları bozabilirdi.

## Kalan işler — öncelik sırasıyla

**(siz)** = sizden bilgi, içerik ya da karar gerekiyor; diğerleri sitede yapılabilir. Numaralar aşağıdaki geliştirme listesindeki maddelerdir.

1. **GitHub'a gönderme.** `main` dalı GitHub'dakinden ileride (logo çalışması, hızlı düzeltmeler ve bu dosya). `git push origin main`.
   GitHub deposu bir barındırıcıya bağlıysa gönderim yayına çıkar.
2. **(siz) Ticaret unvanı, MERSİS, KVKK aydınlatma metni (18)** — hukuki risk ve en büyük güven eksiği.
3. **(siz) Grup sayfası metinlerinin onayı** — `METIN-KONTROLU.md`'deki dokuz grubu okuyup işaretleyin.
4. **Teklif gönderiminde sürtünme (21, 22, 23).** E-postayla gönderme seçeneği; masaüstü başlığında telefon numarası;
   Ürünlerimiz'de grup başlığının davranışı; telefonda fiş açılınca klavyenin ekranı kapatması.
5. **(siz) Güven içeriği (6)** — depo/ofis fotoğrafları, izinli referans firmalar, teslimat bilgisi.
6. **Kataloglar (13, 14)** — büyük PDF'ler için "Wi-Fi önerilir" notu ve çevrimdışı kaydetme; büyük kataloglara içindekiler.
7. **Okunabilirlik (24)** — önemli bilgilerin 12 px altında kalan yazıları.
8. **Ölçüm (20)** — çerezsiz analitik.
9. **Küçük temizlikler (25, 26)** — Mitsubishi kataloglarının 2. kısmı; kullanılmayan logo dosyaları.
10. **Yayına alma** — aşağıdaki "Yayına almadan önce" ve "Yayın günü" listeleri.

## 19 Kasım 2026 oturumunda yapılanlar (özet)

- 18 Kasım incelemesinin 2. sıra işleri: menüde Kataloglar, telefonda altbilgi / dokunma alanları / grup sayfası formu / sıkı kartlar,
  "teklif" dili, yazı tipleri sitenin kendi dosyaları (1, 2, 3, 8, 12, 15, 19).
- Teklif hızı: koddan ürün grubu tahmini (10), anasayfada kod alanı ve "Son fişiniz / Açık fişiniz" (5), telefonda "Ara | WhatsApp" (4),
  anasayfada katalog şeridi (7). Kurumsal sayfasında "KURULUŞ 2024".
- Grup sayfası metinleri teknik kontrolden geçirildi; teklife dönüş süresi "aynı iş günü içerisinde"; `formatteknik.com` → `.com.tr` yönlendirmesi.
- Logo: başlıkta kaydırdıkça dönen dişli amblem (`scripts/emblem.mjs` logodan üretir); "GÖNDERİLDİ" mührü logolu firma kaşesi
  (fiş çekmecesi, Ürünlerimiz paneli, yazdırılan fiş). Kumpasın içine logo denendi, kaldırıldı.
- Kullanıcı deneyimi incelemesi (iki senaryo: telefondan fiyat isteyen satın almacı, masaüstünden tedarikçi araştıran mühendis).
  Bulgulardan iki hızlı düzeltme yapıldı: kod alanına yazılan adet ("x20", "5 adet") her formda okunuyor; 3D giriş cihazdaki
  yalnızca ilk anasayfa açılışında oynuyor. Kalan bulgular 21–24.

## Sizden beklenen içerik

- [x] **Carmon logosu.** 19 Kasım 2026: eklendi (arka planı temizlendi → `public/brands/carmon.png`). Elimizdeki dosya küçük (170 px); daha büyük ya da SVG sürüm gelirse değiştirilebilir.
- [x] **Format logosu.** 19 Kasım 2026: eklendi (`public/brands/format.png`, şeffaf, 576 px — gönderilen JPG'den daha net olduğu için bu kullanıldı).
- [x] **Star Tool logosu.** 19 Kasım 2026: mevcut dosya (250×23 piksel) olduğu gibi kalıyor.
- [x] **Paylaşım görseli.** `public/og-image.png` (1200×630) hazırlandı ve `index.html`'e eklendi. Kendi görselinizi kullanmak isterseniz aynı adla değiştirmeniz yeterli.
- [x] **Çalışma saatleri.** `src/config/site.ts` → `hours` dolduruldu (`Hafta içi 09.00-18.00`).
- [x] **Teklife dönüş süresi.** 19 Kasım 2026: `aynı iş günü içerisinde` (`src/config/site.ts` → `replyTime`) — fiş gönderildikten sonra ve İletişim sayfasında görünür.

### Kurumsal sayfa bilgileri — `src/data/company.ts`

Boş bırakılan alan sitede **hiç gösterilmez**; doldurdukça ilgili bölüm kendiliğinden belirir. Bölüm numaraları da kendiliğinden sıralanır.

- [x] **Kuruluş yılı:** 2024 (`foundedYear`, 19 Kasım 2026) — Kurumsal sayfasının üst satırında "KURULUŞ 2024".
- [ ] **Fotoğraflar** (depo, ofis, ekip) — 19 Kasım 2026 itibarıyla yok, bölüm gizli. Gelirse dosyaları `public/kurumsal/` klasörüne koyun, `photos` listesine ekleyin:
      `{ src: '/kurumsal/depo.jpg', alt: 'Çorlu deposunda kesici uç rafları', caption: 'Depomuz' }`
      Yatay, en az 1600 piksel genişlikte fotoğraf önerilir. 3 ya da daha fazla fotoğrafta ilki büyük gösterilir.
- [ ] **Referans firmalar** (yalnızca izin alınanlar) → `references` listesine:
      `{ name: 'Firma Adı', sector: 'Otomotiv' }` — logo varsa `logo: '/kurumsal/referanslar/firma.svg'` ekleyin.

Not: `deliveryTime` ve `deliveryArea` (teslimat) alanları Kurumsal sayfasındaki rakamlar şeridinde
gösteriliyordu; şerit 8 Kasım 2026'da kaldırıldı. Bu alanlar şu an sitede **hiçbir yerde görünmez** — doldurmak isterseniz nerede
gösterileceğine birlikte karar verelim.
Sektör açıklamaları da `src/data/company.ts` içinde (`SECTORS`); dilediğiniz gibi düzenleyebilirsiniz.

Logo dosyalarını proje klasörüne bırakmanız yeterli. Arka planı temizlenip `public/brands/` klasörüne işlenmeleri ve `src/data/brands.ts` dosyasına eklenmeleri gerekiyor.

### Ürün grubu sayfaları — `src/data/guides.ts`

- [ ] **Metinlerin onayı (siz).** 19 Kasım 2026: dokuz grubun "Genel bakış" metinleri teknik olarak kontrol edildi ve düzeltilmiş
      hâlleri sitede. Neyin neden değiştiği **`METIN-KONTROLU.md`** dosyasında; her grubu okuyup işaretleyin, itiraz ettiğiniz
      cümleye not düşün. Onaydan sonra `guides.ts` başındaki "firma onayı bekliyor" notu kaldırılır, `METIN-KONTROLU.md` silinebilir.
- [ ] **Marka–grup eşleşmesi** (19 Kasım 2026: şimdilik önemli değil, ertelendi). Her grubun `brands` listesine o grupta tedarik edilen markaları yazın, ör. `brands: ['Mitsubishi', 'OSG']`.
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
      18 Kasım 2026: eski hâlleriyle kalması kararlaştırıldı. 23 Kasım 2026: Gisstec kaldırıldı, yerine Schlenker.

Yeni katalog eklemek için `catalogs.ts` dosyasının başındaki açıklamaya bakın.

## Geliştirme listesi

18 Kasım 2026 site incelemesi (1–20) ve 19 Kasım 2026 kullanıcı deneyimi incelemesi (21–26).
**(siz)** = sizden bilgi/içerik gerekiyor; diğerleri sitede yapılabilir.

### Tüm sayfalar
- [x] **1. Kataloglar üst menüde ve mobil menüde.** 19 Kasım 2026.
- [x] **2. Altbilgi telefonda sıkıştırıldı** (~865 → ~630 px). 19 Kasım 2026.
- [x] **3. Telefonda dokunma alanları ≥ 24 px** (`.tap` sınıfı, `index.css`). 19 Kasım 2026.
- [x] **4. Telefonda hızlı iletişim:** sağ altta "Ara | WhatsApp" (`src/components/QuickContact.tsx`). 19 Kasım 2026.

### Anasayfa
- [x] **5. Açılış ekranında kod alanı ve "Son fişiniz / Açık fişiniz"** (`src/components/HeroCode.tsx`). 19 Kasım 2026.
- [ ] **6. Güven unsurları (siz):** fotoğraf, teslimat bilgisi, referanslar (bkz. "Kurumsal sayfa bilgileri"). Kuruluş yılı eklendi.
- [x] **7. Katalog şeridi** ("12 katalog · 2.217 sayfa", sayılar `catalogs.ts`'ten). 19 Kasım 2026.
- [x] **8. Dil tutarlılığı:** "sipariş" yerine "teklif". 19 Kasım 2026.
- [x] **9. Marka duvarı:** Carmon ve Format logoları eklendi; Star Tool olduğu gibi. 19 Kasım 2026.

### Ürünlerimiz ve ürün grubu sayfaları
- [x] **10. Otomatik grup tahmini** (`src/cart/guess.ts`, örnek tablosu `npm run test:guess`). 19 Kasım 2026.
- [ ] **11. Grup sayfalarında "Markalar" bölümü (siz):** marka–grup eşleşmesi boş (ertelendi).
- [x] **12. Telefonda teklif formu ilk ekranda** (çizim alçak şeride döndü). 19 Kasım 2026.

### Kataloglar
- [ ] **13. 40 MB'ı aşan PDF'ler telefonda mobil veriyle açılıyor:** "Wi-Fi önerilir" notu; Faz 1'de "çevrimdışı kaydet".
      19 Kasım incelemesi: Android'de "Görüntüle" çoğu zaman 42–62 MB'lık dosyanın tamamını indiriyor.
- [ ] **14. Büyük kataloglara içindekiler:** bölümlere doğrudan giden bağlantılar (ör. "Diş tornalama → s. 412"); bölümler elle çıkarılmalı.

### Kurumsal ve İletişim
- [x] **15. Telefonda sıkı listeler** (İletişim kartları, Kurumsal sektör/ürün kartları). 19 Kasım 2026.
- [ ] ~~**16. "Şu an açık / kapalı" göstergesi**~~ — 19 Kasım 2026: gerek görülmedi.
- [x] **17. Teklife dönüş süresi:** "aynı iş günü içerisinde". 19 Kasım 2026.

### Yasal ve teknik
- [ ] **18. Ticaret unvanı, MERSİS ve KVKK aydınlatma metni (siz) — hukuki risk.** Eski site başlığında unvan "Format Kesici Takım Ltd. Şti.".
      Gerekenler: tam unvan, MERSİS no, ticaret sicil no, vergi dairesi / no (varsa KEP adresi). Altbilgiye ve ayrı bir KVKK sayfasına işlenir;
      KVKK metninin taslağı hazırlanabilir, yayından önce bir hukukçu kontrol etmeli. 19 Kasım incelemesi: siteye ilk gelen satın almacı
      için en büyük güven eksiği ("Güvenilir Çözüm Ortağı" iddiasını destekleyen firma bilgisi yok).
- [x] **19. Yazı tipleri sitenin kendi dosyaları** (`src/fonts.css`; Google Fonts kaldırıldı). 19 Kasım 2026.
- [ ] **20. Ölçüm:** çerezsiz bir analitik aracıyla gönderilen fiş, indirilen katalog sayıları.

### 19 Kasım 2026 kullanıcı deneyimi incelemesi — kalan bulgular
- [x] **Adet yazımı:** grup sayfalarında "x20" metinde kalıyor, kalem 1 adet ekleniyordu ("x20 × 1"). Düzeltildi — her form okur.
- [x] **Giriş her açılışta ~9 sn:** dönen müşteri ve ana ekrandaki uygulama her seferinde bekliyordu. Düzeltildi — yalnızca ilk ziyarette.
- [ ] **21. Masaüstünde gönderimin tek yolu WhatsApp.** Ofis bilgisayarında WhatsApp Web açık değilse ya da şirket ağı engelliyorsa
      yalnızca "Kopyala" ve "Yazdır / PDF" kalıyor. Fişe "E-postayla gönder" (mailto, aynı mesaj) eklensin; masaüstü başlığına telefon numarası.
- [ ] **22. Ürünlerimiz'de grup başlığı:** anasayfada aynı görünümdeki kart grup sayfasına gider, Ürünlerimiz'de yerinde form açar;
      grup sayfası bağlantısı formun altında küçük kalıyor. Başlık grup sayfasına gitsin, "+" formu açsın.
- [ ] **23. Telefonda fiş açılınca klavye:** anasayfadaki kod alanından eklenince fiş kod kutusuna odaklı açılıyor; klavye eklenen kalemi
      ve "WhatsApp ile gönder"i kapatıyor. Kalem eklenerek açılınca odak kutuya verilmesin (boş fiş açılırken verilsin).
- [ ] **24. Küçük yazılar:** telefonda metin öğelerinin ~üçte biri 12 px altında. Dekoratif etiketler sorun değil; form etiketleri
      ("ÜRÜN KODU / TARİF", "ADET"), katalog boyutları ("42,6 MB") ve fiş numarası en az 12 px olsun (45 yaş üstü kullanıcılar).
- [ ] **25. Mitsubishi kataloglarının 2. kısmı:** Tornalama (sitede 42,6 MB) ve Takma Uçlu Freze (31,8 MB) yeni asıllardan
      (`Kataloglar/`) yeniden sıkıştırılmadı; diğerleri 18 Kasım'da yenilendi. İçerik aynı, yalnızca kalite/boyut farkı olabilir.
- [ ] **26. Kullanılmayan logo dosyaları:** `public/brands/carmon.jpg` ve `format.jpg` (yerlerinde `carmon.png` ve `format.png` kullanılıyor)
      yayına küçük gereksiz dosyalar olarak gidiyor; silinebilir.

## Yayına almadan önce

- [ ] **Firma bilgilerini son kez kontrol edin.** Telefon, WhatsApp numarası, e-posta ve adres `src/config/site.ts` dosyasında.
- [ ] **Gerçek telefonda deneme siparişi verin.** Fişe birkaç kalem ekleyip WhatsApp ile gönderin. Mesaj doğru numaraya, düzgün biçimde gitmeli.
      "Gönderdim" deyince fişe logolu kaşe basılmalı; "Yazdır / PDF" çıktısında da kaşe görünmeli.
- [ ] **Barındırma hizmetini seçin.** Vercel, Netlify ve cPanel (Apache) için ayarlar hazır, yönlendirmeler de üçünde çalışır (`README.md` → "Yayına alma").
      cPanel'de `dist/` içindeki gizli `.htaccess` dosyası mutlaka yüklenmeli; yoksa eski site adresleri 404 verir.
- [ ] **DNS:** hem `formatteknik.com.tr` hem `www.formatteknik.com.tr` yeni sunucuyu göstermeli. Sitenin tek adresi `https://www.formatteknik.com.tr`; diğeri buraya yönlenir.
- [ ] **`formatteknik.com` (ikinci alan adı):** `formatteknik.com` ve `www.formatteknik.com` da yeni sunucuyu göstermeli; ikisi de
      kalıcı olarak `https://www.formatteknik.com.tr`'ye yönlenir (aynı içerik iki adreste olmasın diye — Google bunu çift içerik sayar).
      Vercel'de iki alan adı da projeye eklenir (yönlendirme `vercel.json`'da hazır); cPanel'de "Alias / Parked" alan adı olarak eklenip
      SSL (AutoSSL) açılır. `.com`'un DNS'i ayrı firmadaysa oradan da yeni sunucuya yönlendirilmeli.
- [ ] **`npm run build` çalıştırın.** Oluşan `dist/` klasörü yayına alınacak klasördür.
- [ ] **Yayından önce:** `npm run preview` açıkken `npm run check:redirects` — eski 38 adresin hepsi ✓ olmalı.
- [ ] **Uygulama (ana ekrana ekleme) — gerçek telefonlarda** (yayından sonra, https adresinde; bilgisayardan taklit edilemez):
  - Android / Chrome: menüde "Uygulamayı yükle" çıkmalı; simge Format Teknik logosu olmalı; açılınca adres çubuğu olmamalı.
  - iPhone / Safari: Paylaş → "Ana Ekrana Ekle"; simge ve ad "Format Teknik" olmalı.
  - Uygulamayı bir kez açtıktan sonra uçak modunda tekrar açın: sayfalar ve teklif fişi çalışmalı (PDF'ler internet ister).
- [ ] **Animasyonları gerçek cihazlarda izleyin** (test ortamı saniyede 2 kare çizdiği için akıcılık burada denetlenemedi):
      3D giriş, başlıktaki dönen dişli (kaydırma ve üzerine gelme), kumpas, katalog şeridindeki yelpaze, kaşenin basılması.

## Yayın günü

- [ ] **Yayından hemen sonra:** `npm run check:redirects -- https://www.formatteknik.com.tr` — eski adresler, `www` / `https` ve
      `formatteknik.com` yönlendirmesi yayındaki sitede denenir. ✗ çıkarsa eski siteye dönmeden önce birlikte bakalım.
- [ ] **Google Search Console** (search.google.com/search-console; site sahibinin Google hesabıyla):
  1. `https://www.formatteknik.com.tr` mülkü yoksa ekleyin ve doğrulayın (alan adı mülkü — DNS TXT kaydıyla — en kapsamlısıdır).
  2. **Site haritaları** → eski `/tr/sitemap.xml` kaydı varsa kaldırın, `sitemap.xml` ekleyin.
  3. **URL denetimi** → anasayfa ve `/urunler` için "Dizine eklenmesini iste".
  4. İlk 4 hafta, haftada bir **Sayfalar** raporunda "Bulunamadı (404)" listesine bakın. Orada eski bir adres görünürse
     `vercel.json` → `redirects`'e bir satır eklenir; derleme `.htaccess`'i kendiliğinden günceller.
- [ ] **Google İşletme Profili** varsa: web sitesi adresini `https://www.formatteknik.com.tr` olarak güncelleyin.
- [ ] **Yüklemeden önce eski sitenin tam yedeğini alın** (cPanel → Yedekleme ya da barındırıcınızın paneli): bir sorun çıkarsa dakikalar içinde geri dönülebilsin.
