import type { SVGProps } from 'react'

/**
 * lucide-react 1.x marka simgelerini içermez. Bu simgeler sitedeki diğer lucide simgeleriyle
 * aynı çizgi dilinde çizilmiştir (24×24, 2 px çizgi, yuvarlak uçlar, currentColor).
 */
export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
