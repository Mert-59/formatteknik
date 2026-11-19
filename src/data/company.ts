/**
 * Kurumsal bilgiler — Kurumsal sayfasındaki bölümleri besler.
 *
 * BOŞ BIRAKILAN ALAN SİTEDE GÖSTERİLMEZ. Bilgi girildikçe ilgili bölüm kendiliğinden görünür;
 * yarım ya da "yakında" yazan bir bölüm hiç çıkmaz.
 */

export type CompanyPhoto = {
  /** public/kurumsal/ klasöründeki dosya, ör. '/kurumsal/depo.jpg' (yatay, en az 1600 px genişlik önerilir) */
  src: string
  /** Görme engelli kullanıcılar ve arama motorları için kısa açıklama, ör. 'Çorlu deposunda kesici uç rafları' */
  alt: string
  /** İsteğe bağlı: fotoğrafın altında görünen kısa yazı */
  caption?: string
}

export type Reference = {
  /** Firma adı — yalnızca izin alınan firmalar yazılmalı */
  name: string
  /** İsteğe bağlı: public/kurumsal/referanslar/ klasöründeki logo, ör. '/kurumsal/referanslar/firma.svg' */
  logo?: string
  /** İsteğe bağlı: sektör, ör. 'Otomotiv' */
  sector?: string
}

export const COMPANY = {
  /*
   * DİKKAT: foundedYear, deliveryArea ve deliveryTime şu an sitede HİÇBİR YERDE gösterilmiyor
   * (Kurumsal sayfasındaki rakamlar şeridi 8 Kasım 2026'da kaldırıldı). Doldurulsalar da görünmezler.
   */
  /** Kuruluş yılı, ör. 2015. 0 = gösterilmez. */
  foundedYear: 2024 as number,
  /** Teslimat yapılan bölge, ör. 'Çorlu, Çerkezköy, Ergene OSB ve Tekirdağ geneli'. '' = gösterilmez. */
  deliveryArea: '' as string,
  /** Teslimat süresi, ör. 'Stoktaki ürünlerde aynı gün'. '' = gösterilmez. */
  deliveryTime: '' as string,
  /** Depo, ofis, ekip fotoğrafları. Boş liste = galeri gösterilmez. */
  photos: [] as CompanyPhoto[],
  /** Referans firmalar (izinli). Boş liste = bölüm gösterilmez. */
  references: [] as Reference[],
}

/**
 * Hizmet verilen sektörler (mevcut sitede ve anasayfada geçen dört sektör).
 * Açıklamalar sektörün genel ihtiyacını anlatır; firmaya ait referans ya da iddia içermez.
 */
export const SECTORS = [
  {
    name: 'Havacılık',
    text: 'Titanyum, nikel alaşımları ve alüminyumda dar toleranslı işleme; ölçümün izlenebilir olması şart.',
  },
  {
    name: 'Medikal',
    text: 'İmplant ve cerrahi alet üretimi; paslanmaz çelik ve titanyumda küçük çaplı, hassas işlemler.',
  },
  {
    name: 'Otomotiv',
    text: 'Seri üretim: takım ömrü, tekrarlanabilir kalite ve kısa çevrim süreleri öncelikli.',
  },
  {
    name: 'Makina',
    text: 'Genel imalat ve yedek parça; farklı malzemelerde tornalama, frezeleme ve delik işlemleri.',
  },
] as const
