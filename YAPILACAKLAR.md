# Yapılacaklar

Son güncelleme: 8 Kasım 2026

## Sizden beklenen içerik

- [ ] **Carmon logosu.** Şu an marka duvarında yalnızca yazı olarak görünüyor.
- [ ] **Format logosu.** Şu an marka duvarında yalnızca yazı olarak görünüyor.
- [ ] **Star Tool logosu, daha büyük sürüm.** Elimizdeki dosya 250×23 piksel. Yüksek çözünürlüklü ekranlarda hafif bulanık görünebilir; SVG ya da en az 1000 piksel genişliğinde PNG gerekiyor.
- [x] **Paylaşım görseli.** `public/og-image.png` (1200×630) hazırlandı ve `index.html`'e eklendi. Kendi görselinizi kullanmak isterseniz aynı adla değiştirmeniz yeterli.
- [x] **Çalışma saatleri.** `src/config/site.ts` → `hours` dolduruldu (`Hafta içi 09.00-18.00`).
- [ ] **Teklife dönüş süresi.** `src/config/site.ts` → `replyTime` (ör. `'aynı iş günü içinde'`). Boşken fiş gönderildikten sonra "en kısa sürede dönüş yapacağız" yazar; doldurulunca bu süre yazılır ve İletişim sayfasında da görünür.

### Kurumsal sayfa bilgileri — `src/data/company.ts`

Boş bırakılan alan sitede **hiç gösterilmez**; doldurdukça ilgili bölüm kendiliğinden belirir. Bölüm numaraları da kendiliğinden sıralanır.

- [ ] **Kuruluş yılı** → `foundedYear: 2015` gibi. Rakamlar şeridinde "KURULUŞ" olarak çıkar.
- [ ] **Teslimat süresi** → `deliveryTime: 'Stoktaki ürünlerde aynı gün'` gibi.
- [ ] **Teslimat bölgesi** → `deliveryArea: 'Çorlu, Çerkezköy, Ergene OSB ve Tekirdağ geneli'` gibi. Süre ve bölgeden biri doluysa rakamların altında "TESLİMAT" satırı çıkar.
- [ ] **Fotoğraflar** (depo, ofis, ekip) → dosyaları `public/kurumsal/` klasörüne koyun, `photos` listesine ekleyin:
      `{ src: '/kurumsal/depo.jpg', alt: 'Çorlu deposunda kesici uç rafları', caption: 'Depomuz' }`
      Yatay, en az 1600 piksel genişlikte fotoğraf önerilir. 3 ya da daha fazla fotoğrafta ilki büyük gösterilir.
- [ ] **Referans firmalar** (yalnızca izin alınanlar) → `references` listesine:
      `{ name: 'Firma Adı', sector: 'Otomotiv' }` — logo varsa `logo: '/kurumsal/referanslar/firma.svg'` ekleyin.

"Rakamlar" şeridindeki marka (10), ürün grubu (9) ve sektör (4) sayıları sitedeki listelerden kendiliğinden sayılır; elle girilmez.
Sektör açıklamaları da `src/data/company.ts` içinde (`SECTORS`); dilediğiniz gibi düzenleyebilirsiniz.

Logo dosyalarını proje klasörüne bırakmanız yeterli. Arka planı temizlenip `public/brands/` klasörüne işlenmeleri ve `src/data/brands.ts` dosyasına eklenmeleri gerekiyor.

## Yayına almadan önce

- [ ] **Firma bilgilerini son kez kontrol edin.** Telefon, WhatsApp numarası, e-posta ve adres `src/config/site.ts` dosyasında.
- [ ] **Gerçek telefonda deneme siparişi verin.** Fişe birkaç kalem ekleyip WhatsApp ile gönderin. Mesaj doğru numaraya, düzgün biçimde gitmeli.
- [ ] **Barındırma hizmetini seçin ve yönlendirme ayarını ekleyin.** Bu ayar olmazsa `/urunler` gibi sayfalar yenilendiğinde 404 hatası verir. Netlify, Vercel ve cPanel için gereken ayar `README.md` dosyasında "Yayına alma" başlığı altında anlatılıyor.
- [ ] **`npm run build` çalıştırın.** Oluşan `dist/` klasörü yayına alınacak klasördür.
