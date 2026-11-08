import { createPortal } from 'react-dom'
import { SITE } from '../config/site'
import { useCart } from './CartContext'
import { p2, stampTime } from './slipUtils'

/**
 * Teklif fişinin yazdırma / PDF görünümü (A4).
 *
 * Ekranda hiç görünmez. printSlip() (slipUtils.ts) çağrılınca <html>'e `printing-slip` sınıfı eklenir;
 * yazdırma sırasında sayfadaki her şey gizlenir, yalnızca bu görünüm basılır (bkz. index.css).
 * Kullanıcı Ctrl+P ile sayfayı kendisi yazdırırsa bu görünüm devreye girmez.
 */

const today = () => {
  const d = new Date()
  return `${p2(d.getDate())}.${p2(d.getMonth() + 1)}.${d.getFullYear()}`
}

export default function PrintSlip() {
  const { items, units, orderNo, sentAt, customer } = useCart()
  if (!items.length) return null

  const who = [
    ['Ad Soyad', customer.name.trim()],
    ['Firma', customer.company.trim()],
  ].filter(([, v]) => v)
  const site = SITE.url.replace(/^https?:\/\//, '')

  return createPortal(
    <div className="print-slip font-sans text-[10.5pt] leading-snug text-black">
      {/* başlık */}
      <header className="flex items-start justify-between gap-6 border-b-2 border-black pb-4">
        <div>
          <p className="text-[20pt] leading-none">
            <span className="font-wide font-bold tracking-[-0.01em]">FORMAT</span>{' '}
            <span className="font-mono text-[15pt] font-medium tracking-[0.2em] text-[#3a4048]">TEKNİK</span>
          </p>
          <p className="mt-2.5 max-w-[78mm] text-[9pt] text-[#3a4048]">{SITE.address}</p>
          <p className="mt-0.5 text-[9pt] text-[#3a4048]">
            {SITE.phoneDisplay} · {SITE.email}
          </p>
        </div>
        {/* gönderildiyse mühür: başlıktaki boşlukta durur, hiçbir yazının üstüne binmez */}
        <div className="flex flex-1 justify-center self-center">
          {sentAt > 0 && (
            <div className="print-stamp rotate-[-7deg] rounded-[5px] border-2 border-[#c2330f] px-3 py-1 text-center font-mono text-[#c2330f]">
              <span className="block text-[12pt] font-semibold leading-tight tracking-[0.26em]">GÖNDERİLDİ</span>
              <span className="block text-[7.5pt] tracking-[0.14em]">{stampTime(sentAt)}</span>
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="whitespace-nowrap font-wide text-[15pt] font-semibold tracking-[-0.01em]">TEKLİF TALEBİ</p>
          <dl className="mt-2 grid grid-cols-[auto_auto] justify-end gap-x-3 font-mono text-[9.5pt]">
            <dt className="text-[#6b727a]">Fiş No</dt>
            <dd className="font-medium">{orderNo}</dd>
            <dt className="text-[#6b727a]">Tarih</dt>
            <dd>{today()}</dd>
          </dl>
        </div>
      </header>

      {/* müşteri */}
      {who.length > 0 && (
        <dl className="flex flex-wrap gap-x-10 gap-y-1 border-b border-[#c9ced3] py-3">
          {who.map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="text-[#6b727a]">{k}:</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* kalemler */}
      <div>
        <table className="mt-4 w-full border-collapse">
          <thead>
            <tr className="border-b border-black text-left font-mono text-[8pt] tracking-[0.12em] text-[#3a4048]">
              <th className="w-[10mm] py-1.5 font-medium">#</th>
              <th className="py-1.5 font-medium">ÜRÜN KODU / TARİF</th>
              <th className="w-[38mm] py-1.5 font-medium">GRUP</th>
              <th className="w-[28mm] py-1.5 font-medium">MARKA</th>
              <th className="w-[16mm] py-1.5 text-right font-medium">ADET</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.id} className="break-inside-avoid border-b border-[#dde1e4] align-top">
                <td className="py-2 font-mono text-[9pt] text-[#6b727a]">{p2(i + 1)}</td>
                <td className="py-2 pr-3">
                  <span className="break-words font-mono font-medium">{it.code}</span>
                  {it.note && <span className="mt-0.5 block text-[9pt] text-[#3a4048]">Not: {it.note}</span>}
                </td>
                <td className="py-2 pr-3 text-[9.5pt]">{it.category || '—'}</td>
                <td className="py-2 pr-3 text-[9.5pt]">{it.brand || 'Fark etmez'}</td>
                <td className="py-2 text-right font-mono font-medium tabular-nums">{it.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 flex justify-end gap-2 text-[10pt]">
        <span className="text-[#6b727a]">Toplam:</span>
        <span className="font-medium">
          {items.length} kalem · {units} adet
        </span>
      </p>

      {customer.note.trim() && (
        <div className="mt-5 break-inside-avoid border-l-2 border-black pl-3">
          <p className="font-mono text-[8pt] tracking-[0.12em] text-[#3a4048]">NOT</p>
          <p className="mt-1 whitespace-pre-wrap">{customer.note.trim()}</p>
        </div>
      )}

      <footer className="mt-10 break-inside-avoid border-t border-[#c9ced3] pt-3 text-[8.5pt] text-[#3a4048]">
        <p className="font-medium text-black">Bu belge bir teklif talebidir.</p>
        <p className="mt-1">
          {site}
          {SITE.hours && <> · {SITE.hours}</>}
        </p>
      </footer>
    </div>,
    document.body,
  )
}
