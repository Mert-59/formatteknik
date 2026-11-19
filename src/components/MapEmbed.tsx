import { useState } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { SITE } from '../config/site'

/**
 * İletişim sayfası haritası — "tıklayınca yüklenen" yapı.
 *
 * Önce sitenin teknik çizim diliyle sade bir kutu görünür (ızgara, konum işareti, adres).
 * Google Haritalar yalnızca ziyaretçi "Haritayı göster"e basınca yüklenir:
 *  - sayfa hızlı kalır (harita ~0,5–1 MB ve çok sayıda betik getirir),
 *  - ziyaretçi istemeden Google'a bağlanılmaz / çerez yüklenmez (KVKK).
 */
export default function MapEmbed() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div>
      <div className="relative h-[320px] overflow-hidden rounded-3xl border border-line bg-mist md:h-[420px]">
        {loaded ? (
          <iframe
            src={SITE.mapsEmbedUrl}
            title={`${SITE.name} konumu — Google Haritalar`}
            className="absolute inset-0 h-full w-full border-0 grayscale-[0.55] transition-[filter] duration-500 hover:grayscale-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <>
            {/* teknik ızgara + merkezde hedef halkaları: harita yüklenmeden önceki sade görünüm */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,18,21,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,18,21,0.06)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_75%_75%_at_62%_45%,#000_35%,transparent_85%)]"
            />
            <div aria-hidden className="absolute left-[62%] top-[45%] -translate-x-1/2 -translate-y-1/2 max-md:left-1/2 max-md:top-[34%]">
              <span className="absolute left-1/2 top-1/2 size-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/10" />
              <span className="absolute left-1/2 top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink/15" />
              <span className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-accent/15 motion-reduce:animate-none" />
              <span className="relative grid size-11 place-items-center rounded-full bg-accent text-white shadow-[0_8px_24px_rgba(229,64,27,0.35)]">
                <MapPin className="size-5" strokeWidth={2} />
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 md:max-w-md md:p-8">
              <div>
                <p className="font-mono text-[10px] tracking-[0.22em] text-muted">KONUM</p>
                <p className="mt-2 text-[15px] font-medium leading-snug md:text-[17px]">{SITE.address}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <button
                  type="button"
                  onClick={() => setLoaded(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-paper transition-colors hover:bg-accent-ink"
                >
                  <MapPin className="size-4" /> Haritayı göster
                </button>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap inline-flex items-center gap-1 text-[14px] text-graphite underline-offset-4 hover:text-ink hover:underline"
                >
                  Yol tarifi al <ArrowUpRight className="size-4" />
                </a>
              </div>
              <p className="text-[12px] leading-relaxed text-muted">Harita Google tarafından sunulur; “Haritayı göster”e bastığınızda yüklenir.</p>
            </div>
          </>
        )}
      </div>

      {/* harita açıkken de yol tarifi bir dokunuş uzakta */}
      {loaded && (
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-[14px] text-graphite underline-offset-4 hover:text-ink hover:underline"
        >
          Google Haritalar’da aç, yol tarifi al <ArrowUpRight className="size-4" />
        </a>
      )}
    </div>
  )
}
