# Yapılacaklar

Son güncelleme: 18 Kasım 2026

## Sizden beklenen içerik

- [ ] **Carmon logosu.** Şu an marka duvarında yalnızca yazı olarak görünüyor.
- [ ] **Format logosu.** Şu an marka duvarında yalnızca yazı olarak görünüyor.
- [ ] **Star Tool logosu, daha büyük sürüm.** Elimizdeki dosya 250×23 piksel. Yüksek çözünürlüklü ekranlarda hafif bulanık görünebilir; SVG ya da en az 1000 piksel genişliğinde PNG gerekiyor.
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

Not: `foundedYear` (kuruluş yılı), `deliveryTime` ve `deliveryArea` (teslimat) alanları Kurumsal sayfasındaki rakamlar şeridinde
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

Yeni katalog eklemek için `catalogs.ts` dosyasının başındaki açıklamaya bakın.

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
