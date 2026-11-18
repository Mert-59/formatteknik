/**
 * Firma logosu (Formatlogo.pdf'ten, şeffaf zemin, 600×444): WebP, desteklemeyen tarayıcıda PNG.
 * Kullanıldığı yerler: Kurumsal sayfası, teklif fişi çıktısı (PrintSlip). Paylaşım görseli (og-image.png) ayrıca üretildi.
 * Üst menüde ve sekme simgesinde bilinçli olarak kullanılmaz: sitenin renkleri (siyah + kızıl) ile logonun
 * mavi-grisi çatışır; logonun ince yazısı küçük boyutta okunmaz.
 */
export default function Logo({ className = '', lazy = false }: { className?: string; lazy?: boolean }) {
  return (
    <picture>
      <source srcSet="/logo/format-teknik.webp" type="image/webp" />
      <img
        src="/logo/format-teknik.png"
        width={600}
        height={444}
        alt="Format Teknik — Kesici Takımlar logosu"
        loading={lazy ? 'lazy' : undefined}
        decoding="async"
        className={`h-auto ${className}`}
      />
    </picture>
  )
}
