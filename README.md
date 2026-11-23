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
npm run test:guess  # ürün grubu tahmininin örnek tablosu (src/cart/guess.ts)
npm run preview  # dist/ klasörünü yayındaki gibi sunar (temiz adresler, 404.html, yönlendirmeler) → http://localhost:4173
npm run check:redirects                                 # eski site adreslerini önizlemede dener (preview açıkken)
npm run check:redirects -- https://www.formatteknik.com.tr  # ...ve yayındaki sitede (yayından hemen sonra)
```

## İçerik nereden yönetilir

| Ne | Dosya |
|---|---|
| Firma adı, adres, telefon, WhatsApp, e-posta, menü | `src/config/site.ts` |
| Ürün grupları (ad, açıklama, örnek kod, çizim) | `src/data/catalog.ts` |
| Ürün grubu sayfalarının içeriği (`/urunler/<grup>`: genel bakış, sayfa açıklaması, markalar) | `src/data/guides.ts` |
| Kurumsal sayfa bilgileri (kuruluş, teslimat, fotoğraflar, referanslar) | `src/data/company.ts` |
| PDF kataloglar (grup sayfalarında ve `/kataloglar`'da) — dosyalar `public/kataloglar/`, kapaklar `public/kataloglar/kapak/` | `src/data/catalogs.ts` |
| Eski siteden yönlendirmeler (`/tr/...`, eski PDF adresleri) — tek liste, tüm barındırıcılar için | `vercel.json` → `redirects` |
| Markalar ve logoları (`public/brands/`) | `src/data/brands.ts` |
| Sayfa başlıkları / açıklamaları | her sayfadaki `usePageMeta(...)` |
| Paylaşım önizlemesi, yapılandırılmış veri | `index.html` |
| Site haritası | derlemede kendiliğinden üretilir (`dist/sitemap.xml`) |

## Yapı

- **Ön-render** — `npm run build` her sayfanın HTML'ini içeriği dolu olarak üretir
  (`dist/index.html`, `urunler.html`, `urunler/<grup>.html` ×12, `kurumsal.html`, `iletisim.html`, `404.html`)
  ve `dist/sitemap.xml`'i bu sayfalardan yazar. Yeni bir ürün grubu `catalog.ts` + `guides.ts`'e eklenince
  sayfası ve site haritası kaydı kendiliğinden oluşur. Her dosyada o sayfanın kendi
  başlığı, açıklaması, canonical adresi ve paylaşım etiketleri vardır; arama motorları ve WhatsApp/LinkedIn
  önizlemeleri JavaScript çalıştırmadan sayfayı okur. Tarayıcıda React bu HTML'i devralır (hydration).
  - `src/entry-server.tsx` sayfayı sunucuda çizer, `scripts/prerender.mjs` dosyaları yazar.
  - Kural: **çizim sırasında** tarayıcıya özgü bir şey (`window`, `localStorage`, ekran genişliği, `#çapa`) okunmaz;
    bunlar `src/lib/client.ts` kancalarıyla ya da `useLayoutEffect` içinde okunur. Aksi hâlde derleme
    hata verir ya da tarayıcı konsolunda "hydration" uyarısı çıkar.
- `src/intro/` — anasayfanın 3D girişi (Three.js). Ayrı parça olarak yüklenir; cihazdaki **ilk** anasayfa açılışında kendiliğinden
  oynar, izlenince ya da atlanınca bir daha oynamaz (`ft-intro-v2`, bkz. `src/lib/introState.ts`). Diğer sayfalar bu yükü
  indirmez. Altbilgideki "Girişi izle" ile istenildiğinde tekrar oynatılabilir.
- `src/cart/` — **teklif fişi** (sepet): tarayıcıda saklanır, WhatsApp mesajı olarak gönderilir. Sunucu gerekmez.
  - `QuickAdd.tsx` — tek ekleme formu (çekmece ve ürünler sayfası). Kod + adet zorunlu; grup ve marka isteğe bağlı. Enter ekler.
  - `guess.ts` — koddan ürün grubu tahmini (`CNMG 120408` → Torna Uçları, `M8x1.25` → Kılavuz). Grup seçilmemişse
    kendiliğinden seçilir (çerçeveli chip); listede her satır ayrı tahmin edilir. Örnek tablosu: `npm run test:guess`.
  - `parse.ts` — "Liste yapıştır": her satır bir kalem; `x10`, `10 adet`, `; 10` veya Excel sekmesi adet olarak okunur.
  - `CartDrawer.tsx` — fiş çekmecesi: fiş no (`FT-YYAAGG-NNNN`), mesaj önizleme. WhatsApp açılınca "Mesajı gönderdiniz mi?"
    sorulur; "GÖNDERİLDİ" mührü müşterinin onayıyla basılır. Gönderilmiş fiş değişirse yeni numara alır.
  - `History.tsx` — son fişler (en fazla 20) ve "Tekrarla".
  - `CartBar.tsx` — telefonda fişte kalem varken alttaki çubuk. Fiş boşken yerinde `components/QuickContact.tsx`
    ("Ara | WhatsApp", ilk ekrandan sonra; İletişim'de ve altbilgide gizli).
  - Anasayfa açılışında doğrudan kod alanı ve dönen müşteriye son fiş: `components/HeroCode.tsx`.
  - Hepsi yalnızca cihazda: ad/firma `ft-customer-v1`, fiş `ft-cart-v1` + `ft-order-v1`, son fişler `ft-history-v1`.
- `src/lib/scroll.ts` — kaydırma kilidi ve modal odak yönetimi (sepet, mobil menü).
- **Yazı tipleri** (Archivo değişken, IBM Plex Mono) sitenin kendi dosyaları: `src/assets/fonts/` + `src/fonts.css` (yalnızca Latin/Latin-ext; OFL lisansı aynı klasörde).
  Google Fonts'a istek gitmez (KVKK); ana yazı tipi `index.html`'de preload edilir.
- **Dokunma alanı:** küçük metin bağlantılarına `tap` sınıfı (`index.css`) — telefonda görünüm değişmeden tıklama alanı ≥36 px.
- **Uygulama (PWA)** — site telefona "ana ekrana eklenebilir"; açılış akışı web sitesiyle aynıdır (anasayfa; giriş yalnızca cihazdaki ilk açılışta).
  - `public/manifest.webmanifest` — ad, renkler, simgeler, kısayollar. Simgeler `public/icons/`, `Formatlogo.pdf`'ten üretildi
    (logo değişirse simgeler yeniden üretilmeli).
  - `public/sw.js` — service worker şablonu; `npm run build` önceden indirilecek dosya listesini ve sürümü yazar
    (`scripts/pwa.mjs`). Sayfalar, kod, stil, yazı tipleri, logolar (~2,3 MB) cihaza iner; **PDF kataloglar inmez**, ağdan açılır.
    İnternet yokken site ve teklif fişi çalışır. Yeni sürüm bir sonraki sayfa açılışında kendiliğinden gelir.
  - `src/lib/install.ts` + `src/components/InstallInvite.tsx` — "Ana ekrana ekle" daveti: fiş gönderimi onaylanınca bir kez;
    "şimdi değil" kalıcıdır, altbilgideki bağlantı kalır. iPhone'da "Paylaş → Ana Ekrana Ekle" tarifi gösterilir.
  - `sw.js` tarayıcıda saklanmamalı: Vercel (`vercel.json`), Apache (`.htaccess`), Netlify (`public/_headers`) ayarları hazır.

## Yayına alma

`npm run build` → `dist/` klasörü yayına alınır. Her sayfa ayrı bir HTML dosyasıdır; barındırıcı
`/urunler` adresinde `urunler.html`'i sunmalı, bulunamayan adreslerde `404.html`'i 404 koduyla döndürmelidir.
Gereken ayarlar projede hazır:

- **Vercel:** proje kökündeki `vercel.json` (`cleanUrls: true`). `404.html` kendiliğinden kullanılır.
- **Netlify:** ek ayar gerekmez; `urunler.html`'i `/urunler` adresinde ve `404.html`'i kendiliğinden sunar. Yönlendirmeler derlemede üretilen `dist/_redirects` dosyasındadır.
- **Apache (cPanel):** `public/.htaccess` şablonu derlemede yönlendirmelerle birlikte `dist/.htaccess` olarak yazılır; `dist/` içeriğiyle birlikte yükleyin
  (gizli dosya olduğu için FTP programında "gizli dosyaları göster" açık olmalı).

### Alan adı ve eski site adresleri

- **Tek adres: `https://www.formatteknik.com.tr`** (www'li). Eski site ve Google kaydı bu adreste; `www`'siz ve
  `http://` adresler kalıcı olarak buraya yönlenir. Adres `src/config/site.ts` → `url`'de; `index.html`'de başka bir
  adres kalırsa derleme hata verir. DNS'te hem `formatteknik.com.tr` hem `www.formatteknik.com.tr` yeni sunucuyu
  göstermeli (Vercel'de iki alan adı da projeye eklenir).
- **İkinci alan adı: `formatteknik.com`** (ve `www.formatteknik.com`) aynı sunucuyu gösterir ve kalıcı olarak
  `https://www.formatteknik.com.tr`'ye yönlenir (adres yolu korunur: `formatteknik.com/urunler` → `…com.tr/urunler`).
  Kurallar `vercel.json`'daki alan adı satırlarından üç barındırıcı için üretilir; yeni bir alan adı için oraya bir satır eklemek yeter.
- **Yönlendirmeler tek listede: `vercel.json` → `redirects`.** Vercel bu listeyi doğrudan okur; Apache için
  `dist/.htaccess`, Netlify için `dist/_redirects` derlemede bu listeden üretilir (`scripts/redirects.mjs`).
  `.htaccess`'e elle yönlendirme yazmayın. Hedefi sitede olmayan bir yönlendirme derlemeyi durdurur.
- Eski sitenin 27 sayfası ve 11 PDF'i (`scripts/old-urls.txt`, 18 Kasım 2026'da alındı) birer özel kuralla yeni
  sayfalara gider; listede olmayan eski adresler genel kurallarla ürünlere ya da anasayfaya düşer.
  `npm run check:redirects` hepsini dener.

Eski "her adreste index.html döndür" (SPA) yönlendirmesine artık gerek yok; eklenirse sayfalar yine çalışır
(tarayıcı doğru sayfayı kendisi çizer) ama o adreslerde ön-render'ın SEO faydası kaybolur.

Yayından sonra kontrol: `/urunler` adresini açıp sayfa kaynağını görüntüleyin (Ctrl+U) — ürün grupları
HTML'in içinde görünmeli ve `<title>` "Ürünlerimiz | Format Teknik" olmalı.
