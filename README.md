# Format Teknik — formatteknik.com.tr

Çorlu/Tekirdağ merkezli kesici takım, ölçüm ve sarf malzemesi tedarikçisinin web sitesi.
Vite + React + TypeScript + Tailwind v4. Animasyonlar: GSAP (giriş, kaydırma efektleri) ve Motion (menü, çekmece, sayfa geçişleri).

## Komutlar

```sh
npm install
npm run dev      # geliştirme sunucusu
npm run build    # tip denetimi + üretim derlemesi → dist/
npm run lint     # oxlint
npm run preview  # dist/ klasörünü yerelde sunar
```

## İçerik nereden yönetilir

| Ne | Dosya |
|---|---|
| Firma adı, adres, telefon, WhatsApp, e-posta, menü | `src/config/site.ts` |
| Ürün grupları (ad, açıklama, örnek kod, çizim) | `src/data/catalog.ts` |
| Markalar ve logoları (`public/brands/`) | `src/data/brands.ts` |
| Sayfa başlıkları / açıklamaları | her sayfadaki `usePageMeta(...)` |
| Paylaşım önizlemesi, yapılandırılmış veri | `index.html` |
| Site haritası | `public/sitemap.xml` |

## Yapı

- `src/intro/` — anasayfanın 3D girişi (Three.js). Ayrı parça olarak yüklenir; anasayfa her açıldığında
  oynar, diğer sayfalar bu yükü indirmez. Altbilgideki "Girişi izle" ile istenildiğinde tekrar oynatılabilir.
- `src/cart/` — **teklif fişi** (sepet): tarayıcıda saklanır, WhatsApp mesajı olarak gönderilir. Sunucu gerekmez.
  - `QuickAdd.tsx` — tek ekleme formu (çekmece ve ürünler sayfası). Kod + adet zorunlu; grup ve marka isteğe bağlı. Enter ekler.
  - `parse.ts` — "Liste yapıştır": her satır bir kalem; `x10`, `10 adet`, `; 10` veya Excel sekmesi adet olarak okunur.
  - `CartDrawer.tsx` — fiş çekmecesi: fiş no (`FT-YYAAGG-NNNN`), mesaj önizleme, gönderince "GÖNDERİLDİ" mührü.
  - `CartBar.tsx` — telefonda fişte kalem varken alttaki çubuk.
  - Ad ve firma cihazda hatırlanır (`ft-customer-v1`); fiş no ve gönderim zamanı `ft-order-v1`'de tutulur.
- `src/lib/scroll.ts` — kaydırma kilidi ve modal odak yönetimi (sepet, mobil menü).

## Yayına alma

Site tek sayfalı bir uygulamadır (SPA). Sunucu, var olmayan her yol için `index.html` döndürmelidir;
aksi hâlde `/urunler` gibi adresler sayfa yenilenince 404 verir. Barındırıcıya göre ayar:

- **Netlify:** `public/_redirects` → `/*  /index.html  200`
- **Vercel:** `vercel.json` → `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`
- **Apache (cPanel):** `.htaccess` ile `FallbackResource /index.html`
