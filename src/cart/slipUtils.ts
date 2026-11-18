/** Teklif fişi yardımcıları (bileşen dosyaları yalnızca bileşen dışa aktarsın diye ayrı). */

export const p2 = (n: number) => String(n).padStart(2, '0')

/** Mühür zamanı: GG.AA.YY · SS:DD */
export const stampTime = (at: number) => {
  const d = new Date(at)
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${p2(d.getFullYear() % 100)} · ${p2(d.getHours())}:${p2(d.getMinutes())}`
}

/**
 * Uzun fiş eşiği. WhatsApp bağlantılarının belgelenmiş kesin bir uzunluk sınırı yok;
 * bu eşik ihtiyatlıdır ve yalnızca bilgi notu gösterir, göndermeyi engellemez.
 */
export const isLongMessage = (itemCount: number, message: string) => itemCount > 60 || message.length > 4000

/** Metni panoya kopyalar; Clipboard API yoksa (eski tarayıcı / güvenli olmayan bağlam) seçip kopyalar. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    /* yedek yönteme geç */
  }
  const active = document.activeElement as HTMLElement | null
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none'
  document.body.appendChild(ta)
  try {
    ta.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    ta.remove()
    active?.focus({ preventScroll: true })
  }
}

/**
 * Fişi yazdırır (cart/PrintSlip.tsx görünümü, kurallar index.css'te).
 * PDF olarak kaydedilirse dosya adı fiş numarası olur (tarayıcı sayfa başlığını kullanır).
 */
export function printSlip(orderNo: string) {
  const root = document.documentElement
  const title = document.title
  const done = () => {
    root.classList.remove('printing-slip')
    document.title = title
    window.removeEventListener('afterprint', done)
  }
  root.classList.add('printing-slip')
  if (orderNo) document.title = orderNo
  window.addEventListener('afterprint', done)
  // Çıktıdaki logo henüz yüklenmediyse beklenir (en fazla 1,5 sn): boş kutuyla basılmasın
  const pending = [...document.querySelectorAll<HTMLImageElement>('.print-slip img')]
    .filter((img) => !img.complete)
    .map((img) => img.decode().catch(() => {}))
  if (!pending.length) return window.print()
  Promise.race([Promise.all(pending), new Promise((r) => setTimeout(r, 1500))]).then(() => window.print())
}
