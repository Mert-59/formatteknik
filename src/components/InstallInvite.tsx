import { useState } from 'react'
import { Share, X } from 'lucide-react'
import { useInstall } from '../lib/install'

/** iPhone / iPad: Safari'de Paylaş → Ana Ekrana Ekle */
function IosSteps({ className = '' }: { className?: string }) {
  return (
    <p className={`text-[13px] leading-relaxed text-graphite ${className}`}>
      Tarayıcının <Share className="inline size-3.5 -translate-y-px" aria-label="Paylaş" /> <span className="font-medium text-ink">Paylaş</span> düğmesine
      dokunun, ardından <span className="font-medium text-ink">“Ana Ekrana Ekle”</span>yi seçin.
    </p>
  )
}

/**
 * Fiş gönderildikten sonra, bir kez: "Bir dahaki siparişte tek dokunuş — ana ekrana ekleyin".
 * Kurulamıyorsa, zaten kuruluysa ya da kullanıcı "şimdi değil" dediyse hiç çizilmez (bkz. lib/install.ts).
 */
export default function InstallInvite({ className = '' }: { className?: string }) {
  const { mode, dismissed, install, dismiss } = useInstall()
  const [steps, setSteps] = useState(false)
  if (!mode || dismissed) return null

  return (
    <div className={`anim-fade-up rounded-2xl border border-line bg-paper p-3.5 [--anim-dur:0.5s] [--anim-delay:0.4s] [--anim-y:8px] ${className}`}>
      <div className="flex items-center gap-3">
        <img src="/icons/icon-192.png" alt="" width={44} height={44} className="size-11 shrink-0 rounded-[10px] border border-line" />
        <p className="min-w-0 flex-1 text-[13px] leading-snug text-graphite">
          <span className="block font-medium text-ink">Bir dahaki siparişte tek dokunuş</span>
          Format Teknik’i ana ekranınıza ekleyin.
        </p>
        <button
          type="button"
          onClick={() => (mode === 'prompt' ? install() : setSteps((s) => !s))}
          aria-expanded={mode === 'ios' ? steps : undefined}
          className="h-10 shrink-0 rounded-full bg-ink px-4 text-[13px] font-medium text-paper transition-colors hover:bg-accent-ink"
        >
          Ekle
        </button>
        <button type="button" onClick={dismiss} aria-label="Şimdi değil" className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:text-ink">
          <X className="size-4" />
        </button>
      </div>
      {steps && <IosSteps className="mt-3 border-t border-line pt-3" />}
    </div>
  )
}

/** Altbilgide sade bağlantı: davet kapatılmış olsa da kurulum buradan yapılabilir. */
export function InstallLink() {
  const { mode, install } = useInstall()
  const [steps, setSteps] = useState(false)
  if (!mode) return null
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => (mode === 'prompt' ? install() : setSteps((s) => !s))}
        aria-expanded={mode === 'ios' ? steps : undefined}
        className="inline-flex items-center gap-3 rounded-full border border-ink/15 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] transition-colors hover:border-ink"
      >
        ↓ ANA EKRANA EKLE
      </button>
      {steps && <IosSteps className="mt-3 max-w-xs" />}
    </div>
  )
}
