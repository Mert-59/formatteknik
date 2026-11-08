/** vite.config.ts → catalogSizes(): public/kataloglar/*.pdf dosyalarının bayt cinsinden boyutları (anahtar: uzantısız dosya adı) */
declare module 'virtual:catalog-sizes' {
  const sizes: Record<string, number>
  export default sizes
}
