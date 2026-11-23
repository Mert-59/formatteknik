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
import { CATALOG_TOC } from './data/catalogToc'
import { SsrHeadContext, type PageMeta } from './lib/usePageMeta'

export { NAV, SITE }

/** Ön-render edilecek ürün grubu sayfaları: /urunler/<grup> */
export const CATEGORY_PATHS = CATEGORIES.map((c) => categoryPath(c.slug))
/** Menüde olmayan diğer sayfalar */
export const EXTRA_PATHS: string[] = [] // /kataloglar artık menüde (NAV)
/** Derleme denetimi: sitede bağlantısı olan her katalog dosyası (scripts/prerender.mjs varlığını kontrol eder) */
export const CATALOG_FILES = ALL_CATALOGS.flatMap((c) => [catalogPdf(c), catalogCover(c)])
/** Derleme denetimi: içindekiler sayfaları katalogun sayfa aralığında ve artan sırada olmalı (data/catalogToc.ts) */
export const CATALOG_TOC_ERRORS = Object.entries(CATALOG_TOC).flatMap(([id, list]) => {
  const c = ALL_CATALOGS.find((k) => k.id === id)
  if (!c) return [`${id}: src/data/catalogs.ts'te böyle bir katalog yok`]
  const errors: string[] = []
  let prev = 0
  for (const e of list) {
    if (e.page < 1 || e.page > c.pages) errors.push(`${id}: "${e.title}" sayfa ${e.page}, katalog ${c.pages} sayfa`)
    if (e.page < prev) errors.push(`${id}: "${e.title}" (${e.page}) bir önceki bölümden (${prev}) önce`)
    prev = e.page
  }
  return errors
})

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
