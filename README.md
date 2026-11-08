# Format Teknik — formatteknik.com.tr

Çorlu/Tekirdağ merkezli kesici takım, ölçüm ve sarf malzemesi tedarikçisinin web sitesi.
Vite + React + TypeScript + Tailwind v4. Animasyonlar: GSAP (3D giriş, kumpas, kaydırmaya bağlı efektler) ve saf CSS
(açılış animasyonları `index.css` → `.anim-*`; açılıp kapanan çekmece/menü/akordeon `src/lib/presence.ts` → `usePresence`).

## Komutlar

```sh
npm install
npm run dev      # geliştirme sunucusu
npm run build    # tip denetimi + üretim derlemesi + ön-render → dist/
npm run lint     # oxlint
npm run preview  # dist/ klasörünü yayındaki gibi sunar (temiz adresler, 404.html) → http://localhost:4173
```

## İçerik nereden yönetilir

| Ne | Dosya |
|---|---|
| Firma adı, adres, telefon, WhatsApp, e-posta, menü | `src/config/site.ts` |
| Ürün grupları (ad, açıklama, örnek kod, çizim) | `src/data/catalog.ts` |
| Ürün grubu sayfalarının içeriği (`/urunler/<grup>`: genel bakış, sayfa açıklaması, markalar) | `src/data/guides.ts` |
| Kurumsal sayfa bilgileri (kuruluş, teslimat, fotoğraflar, referanslar) | `src/data/company.ts` |
| PDF kataloglar (grup sayfalarında ve `/kataloglar`'da) — dosyalar `public/kataloglar/`, kapaklar `public/kataloglar/kapak/` | `src/data/catalogs.ts` |
| Eski siteden yönlendirmeler (`/tr/...`, eski PDF adresleri) | `vercel.json` → `redirects` |
| Markalar ve logoları (`public/brands/`) | `src/data/brands.ts` |
| Sayfa başlıkları / açıklamaları | her sayfadaki `usePageMeta(...)` |
| Paylaşım önizlemesi, yapılandırılmış veri | `index.html` |
| Site haritası | derlemede kendiliğinden üretilir (`dist/sitemap.xml`) |

## Yapı

- **Ön-render** — `npm run build` her sayfanın HTML'ini içeriği dolu olarak üretir
  (`dist/index.html`, `urunler.html`, `urunler/<grup>.html` ×9, `kurumsal.html`, `iletisim.html`, `404.html`)
  ve `dist/sitemap.xml`'i bu sayfalardan yazar. Yeni bir ürün grubu `catalog.ts` + `guides.ts`'e eklenince
  sayfası ve site haritası kaydı kendiliğinden oluşur. Her dosyada o sayfanın kendi
  başlığı, açıklaması, canonical adresi ve paylaşım etiketleri vardır; arama motorları ve WhatsApp/LinkedIn
  önizlemeleri JavaScript çalıştırmadan sayfayı okur. Tarayıcıda React bu HTML'i devralır (hydration).
  - `src/entry-server.tsx` sayfayı sunucuda çizer, `scripts/prerender.mjs` dosyaları yazar.
  - Kural: **çizim sırasında** tarayıcıya özgü bir şey (`window`, `localStorage`, ekran genişliği, `#çapa`) okunmaz;
    bunlar `src/lib/client.ts` kancalarıyla ya da `useLayoutEffect` içinde okunur. Aksi hâlde derleme
    hata verir ya da tarayıcı konsolunda "hydration" uyarısı çıkar.
- `src/intro/` — anasayfanın 3D girişi (Three.js). Ayrı parça olarak yüklenir; anasayfa her açıldığında (yenileme dahil) kendiliğinden
  oynar, diğer sayfalar bu yükü indirmez. Altbilgideki "Girişi izle" ile istenildiğinde tekrar oynatılabilir.
- `src/cart/` — **teklif fişi** (sepet): tarayıcıda saklanır, WhatsApp mesajı olarak gönderilir. Sunucu gerekmez.
  - `QuickAdd.tsx` — tek ekleme formu (çekmece ve ürünler sayfası). Kod + adet zorunlu; grup ve marka isteğe bağlı. Enter ekler.
  - `parse.ts` — "Liste yapıştır": her satır bir kalem; `x10`, `10 adet`, `; 10` veya Excel sekmesi adet olarak okunur.
  - `CartDrawer.tsx` — fiş çekmecesi: fiş no (`FT-YYAAGG-NNNN`), mesaj önizleme, gönderince "GÖNDERİLDİ" mührü.
  - `CartBar.tsx` — telefonda fişte kalem varken alttaki çubuk.
  - Ad ve firma cihazda hatırlanır (`ft-customer-v1`); fiş no ve gönderim zamanı `ft-order-v1`'de tutulur.
- `src/lib/scroll.ts` — kaydırma kilidi ve modal odak yönetimi (sepet, mobil menü).

## Yayına alma

`npm run build` → `dist/` klasörü yayına alınır. Her sayfa ayrı bir HTML dosyasıdır; barındırıcı
`/urunler` adresinde `urunler.html`'i sunmalı, bulunamayan adreslerde `404.html`'i 404 koduyla döndürmelidir.
Gereken ayarlar projede hazır:

- **Vercel:** proje kökündeki `vercel.json` (`cleanUrls: true`). `404.html` kendiliğinden kullanılır.
- **Netlify:** ek ayar gerekmez; `urunler.html`'i `/urunler` adresinde ve `404.html`'i kendiliğinden sunar.
- **Apache (cPanel):** `public/.htaccess` derlemede `dist/`'e kopyalanır; `dist/` içeriğiyle birlikte yükleyin
  (gizli dosya olduğu için FTP programında "gizli dosyaları göster" açık olmalı).

Eski "her adreste index.html döndür" (SPA) yönlendirmesine artık gerek yok; eklenirse sayfalar yine çalışır
(tarayıcı doğru sayfayı kendisi çizer) ama o adreslerde ön-render'ın SEO faydası kaybolur.

Yayından sonra kontrol: `/urunler` adresini açıp sayfa kaynağını görüntüleyin (Ctrl+U) — ürün grupları
HTML'in içinde görünmeli ve `<title>` "Ürünlerimiz | Format Teknik" olmalı.
