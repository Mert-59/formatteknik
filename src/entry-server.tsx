/* eslint-disable react-refresh/only-export-components -- bileşen dosyası değil; yalnızca derlemede çalışır */
/**
 * Ön-render girişi — yalnızca derlemede çalışır (scripts/prerender.mjs), tarayıcıya gönderilmez.
 * Bir adres için sayfanın HTML'ini ve <head> bilgisini (başlık, açıklama) üretir.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppContent } from './App'
import { NAV, SITE, categoryPath } from './config/site'
import { CATEGORIES } from './data/catalog'
import { ALL_CATALOGS, catalogCover, catalogPdf } from './data/catalogs'
import { SsrHeadContext, type PageMeta } from './lib/usePageMeta'

export { NAV, SITE }

/** Ön-render edilecek ürün grubu sayfaları: /urunler/<grup> */
export const CATEGORY_PATHS = CATEGORIES.map((c) => categoryPath(c.slug))
/** Menüde olmayan diğer sayfalar */
export const EXTRA_PATHS = ['/kataloglar']
/** Derleme denetimi: sitede bağlantısı olan her katalog dosyası (scripts/prerender.mjs varlığını kontrol eder) */
export const CATALOG_FILES = ALL_CATALOGS.flatMap((c) => [catalogPdf(c), catalogCover(c)])

export function render(url: string) {
  let head: PageMeta | null = null
  const html = renderToString(
    <StrictMode>
      <SsrHeadContext.Provider value={(meta) => (head = meta)}>
        <StaticRouter location={url}>
          <AppContent />
        </StaticRouter>
      </SsrHeadContext.Provider>
    </StrictMode>,
  )
  return { html, head: head as PageMeta | null }
}
