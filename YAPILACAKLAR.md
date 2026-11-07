# Yapılacaklar

Son güncelleme: 7 Kasım 2026

## Sizden beklenen içerik

- [ ] **Carmon logosu.** Şu an marka duvarında yalnızca yazı olarak görünüyor.
- [ ] **Format logosu.** Şu an marka duvarında yalnızca yazı olarak görünüyor.
- [ ] **Star Tool logosu, daha büyük sürüm.** Elimizdeki dosya 250×23 piksel. Yüksek çözünürlüklü ekranlarda hafif bulanık görünebilir; SVG ya da en az 1000 piksel genişliğinde PNG gerekiyor.
- [ ] **Paylaşım görseli.** Site linki WhatsApp'ta veya sosyal medyada paylaşıldığında önizleme görseli çıkmıyor. 1200×630 piksellik bir görsel hazırlanmalı ve `index.html` dosyasına `og:image` olarak eklenmeli.

Logo dosyalarını proje klasörüne bırakmanız yeterli. Arka planı temizlenip `public/brands/` klasörüne işlenmeleri ve `src/data/brands.ts` dosyasına eklenmeleri gerekiyor.

## Yayına almadan önce

- [ ] **Firma bilgilerini son kez kontrol edin.** Telefon, WhatsApp numarası, e-posta ve adres `src/config/site.ts` dosyasında.
- [ ] **Gerçek telefonda deneme siparişi verin.** Fişe birkaç kalem ekleyip WhatsApp ile gönderin. Mesaj doğru numaraya, düzgün biçimde gitmeli.
- [ ] **Barındırma hizmetini seçin ve yönlendirme ayarını ekleyin.** Bu ayar olmazsa `/urunler` gibi sayfalar yenilendiğinde 404 hatası verir. Netlify, Vercel ve cPanel için gereken ayar `README.md` dosyasında "Yayına alma" başlığı altında anlatılıyor.
- [ ] **`npm run build` çalıştırın.** Oluşan `dist/` klasörü yayına alınacak klasördür.
