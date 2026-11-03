import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SITE } from '../config/site'

/**
 * Sayfa başlığı, açıklaması ve canonical adresi.
 * index.html'deki varsayılan etiketleri günceller (yinelenen etiket oluşturmaz).
 */
export function usePageMeta(title: string, description?: string) {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = title ? `${title} | ${SITE.name}` : `${SITE.name} | Çorlu`
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', SITE.url + pathname)
  }, [title, description, pathname])
}
