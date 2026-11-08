import { createContext, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE } from '../config/site'

export type PageMeta = { title: string; description?: string; noindex?: boolean }

/** Sekme başlığı: "Ürünlerimiz | Format Teknik"; anasayfada "Format Teknik | Çorlu" */
export const pageTitle = (title: string) => (title ? `${title} | ${SITE.name}` : `${SITE.name} | Çorlu`)

/**
 * Ön-render sırasında (sunucuda) sayfanın başlık bilgisini toplayan işlev; entry-server.tsx sağlar,
 * scripts/prerender.mjs o sayfanın HTML'indeki <head> etiketlerine işler. Tarayıcıda yoktur (null).
 */
export const SsrHeadContext = createContext<((meta: PageMeta) => void) | null>(null)

/**
 * Sayfa başlığı, açıklaması ve canonical adresi.
 * Tarayıcıda: index.html'deki etiketleri günceller (yinelenen etiket oluşturmaz).
 * Ön-render'da: değerler ssrHead'e yazılır ve doğrudan HTML'e girer.
 * `noindex`: arama motorları bu sayfayı dizine eklemesin (ör. 404).
 */
export function usePageMeta(title: string, description?: string, opts?: { noindex?: boolean }) {
  const { pathname } = useLocation()
  const noindex = !!opts?.noindex

  const collectSsrHead = useContext(SsrHeadContext)
  collectSsrHead?.({ title: pageTitle(title), description, noindex })

  useEffect(() => {
    document.title = pageTitle(title)
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    const canonical = document.querySelector('link[rel="canonical"]')
    if (noindex) canonical?.remove()
    else if (canonical) canonical.setAttribute('href', SITE.url + pathname)
    else {
      const link = document.createElement('link')
      link.rel = 'canonical'
      link.href = SITE.url + pathname
      document.head.appendChild(link)
    }
    // 404 gibi sayfalar dizine eklenmesin; sayfadan çıkınca etiket kalkar.
    // (404.html'de etiket ön-render'dan hazır gelir; diğer sayfaya geçince o da kaldırılır.)
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!noindex) {
      robots?.remove()
      return
    }
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      robots.content = 'noindex'
      document.head.appendChild(robots)
    }
    const tag = robots
    return () => tag.remove()
  }, [title, description, pathname, noindex])
}
