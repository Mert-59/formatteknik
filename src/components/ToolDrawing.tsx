import type { SVGProps } from 'react'
import type { DrawingKey } from '../data/catalog'

/*
 * Ürün gruplarının teknik çizimleri (viewBox 240×140).
 * Her çizgi pathLength=1 taşır; kapsayıcıdaki --plot değişkeni 1 → 0 olunca
 * tüm çizgiler aynı anda "plotter" gibi çizilir (bkz. index.css .plot).
 */

type P = SVGProps<SVGPathElement>
const Path = (p: P) => <path pathLength={1} {...p} />
const Line = (p: SVGProps<SVGLineElement>) => <line pathLength={1} {...p} />
const Rect = (p: SVGProps<SVGRectElement>) => <rect pathLength={1} {...p} />
const Circle = (p: SVGProps<SVGCircleElement>) => <circle pathLength={1} {...p} />
const Poly = (p: SVGProps<SVGPolylineElement>) => <polyline pathLength={1} {...p} />

const zigzag = (x0: number, x1: number, step: number, yA: number, yB: number) => {
  const pts: string[] = []
  for (let x = x0, i = 0; x <= x1; x += step, i++) pts.push(`${x},${i % 2 ? yB : yA}`)
  return pts.join(' ')
}
const ticks = (x0: number, x1: number, step: number, y0: number, y1: number) => {
  let d = ''
  for (let x = x0; x <= x1; x += step) d += `M${x} ${y0}V${y1}`
  return d
}

/** Merkez çizgisi (kesik-nokta) */
const Center = ({ d }: { d: string }) => <path d={d} className="plot-center" />

/** Ölçü etiketi */
const Label = ({ x, y, children }: { x: number; y: number; children: string }) => (
  <text x={x} y={y} textAnchor="middle" className="plot-label fill-current font-mono text-[8.5px] tracking-[0.08em]" stroke="none">
    {children}
  </text>
)

/** Ölçü çizgisi: uç işaretleri + etiket */
const Dim = ({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) => (
  <g className="opacity-60">
    <Path d={`M${x1} ${y}H${x2}M${x1} ${y - 4}V${y + 4}M${x2} ${y - 4}V${y + 4}`} />
    <Label x={(x1 + x2) / 2} y={y + 12}>{label}</Label>
  </g>
)

const drawings: Record<DrawingKey, React.ReactNode> = {
  insert: (
    <>
      <Path d="M30 66 L120 26 L210 66 L120 106 Z" />
      <Path d="M54 66 L120 37 L186 66 L120 95 Z" className="opacity-50" />
      <Circle cx={120} cy={66} r={14} />
      <Circle cx={120} cy={66} r={7} />
      <Center d="M20 66H220M120 16V116" />
      <Dim x1={30} x2={210} y={120} label="IC 12,70" />
    </>
  ),
  facemill: (
    <>
      <Circle cx={120} cy={64} r={52} />
      <Circle cx={120} cy={64} r={30} className="opacity-50" />
      <Circle cx={120} cy={64} r={13} />
      <Path d="M116 51h8v-6h-8Z" />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <Rect key={k} x={-6} y={-6} width={12} height={12} transform={`translate(${120 + 44 * Math.cos((k * Math.PI) / 3)} ${64 + 44 * Math.sin((k * Math.PI) / 3)}) rotate(${k * 60 + 20})`} />
      ))}
      <Center d="M60 64H180M120 4V124" />
      <Label x={120} y={134}>Ø63</Label>
    </>
  ),
  tap: (
    <>
      <Rect x={18} y={61} width={14} height={18} />
      <Rect x={32} y={57} width={80} height={26} />
      <Path d="M112 57 L120 53 M112 83 L120 87" />
      <Rect x={120} y={53} width={84} height={34} className="opacity-40" />
      <Poly points={zigzag(120, 204, 6, 53, 47)} fill="none" />
      <Poly points={zigzag(120, 204, 6, 87, 93)} fill="none" />
      <Path d="M204 47 L216 57 L216 83 L204 93" />
      <Path d="M120 66H204M120 74H204" className="opacity-50" />
      <Center d="M10 70H230" />
      <Dim x1={120} x2={216} y={112} label="M8 × 1,25" />
    </>
  ),
  carbideDrill: (
    <>
      <Path d="M22 56 H104 V84 H22 L18 80 V60 Z" />
      <Path d="M104 58 H206 M104 82 H206" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Path key={i} d={`M${108 + i * 20} 58 C ${118 + i * 20} 62, ${122 + i * 20} 78, ${132 + i * 20} 82`} />
      ))}
      <Path d="M206 58 L224 70 L206 82" />
      <Center d="M10 70H232" />
      <Dim x1={104} x2={224} y={108} label="Ø8,5 · 5×D" />
    </>
  ),
  endmill: (
    <>
      <Rect x={18} y={54} width={92} height={32} />
      <Rect x={110} y={54} width={96} height={32} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Line key={i} x1={114 + i * 14} y1={54} x2={136 + i * 14} y2={86} />
      ))}
      <Path d="M206 54 L212 58 V82 L206 86" />
      <Center d="M10 70H230" />
      <Dim x1={110} x2={212} y={110} label="Ø10 · Z4" />
    </>
  ),
  micrometer: (
    <>
      <Path d="M74 50 H58 V92 Q58 116 86 116 H128 Q152 116 152 96 V64" />
      <Rect x={74} y={46} width={10} height={14} />
      <Rect x={96} y={49} width={56} height={8} />
      <Rect x={152} y={45} width={36} height={16} />
      <Path d={ticks(156, 184, 4, 53, 49)} className="opacity-60" />
      <Rect x={188} y={41} width={28} height={24} />
      <Path d={ticks(192, 212, 4, 43, 63)} className="opacity-50" />
      <Rect x={216} y={46} width={12} height={14} />
      <Dim x1={84} x2={96} y={30} label="0–25 mm" />
    </>
  ),
  hssDrill: (
    <>
      <Rect x={18} y={57} width={70} height={26} />
      <Path d="M88 58 H206 M88 82 H206" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <Path d={`M${90 + i * 19} 58 C ${100 + i * 19} 64, ${104 + i * 19} 76, ${114 + i * 19} 82`} />
          <Path d={`M${97 + i * 19} 58 C ${107 + i * 19} 64, ${111 + i * 19} 76, ${121 + i * 19} 82`} className="opacity-40" />
        </g>
      ))}
      <Path d="M206 58 L222 70 L206 82" />
      <Center d="M10 70H232" />
      <Label x={150} y={110}>HSS-Co</Label>
    </>
  ),
  shrink: (
    <>
      <Path d="M30 56 L82 44 L82 96 L30 84 Z" />
      <Rect x={82} y={30} width={30} height={80} />
      <Path d="M88 30 V36 L97 44 L106 36 V30 M88 110 V104 L97 96 L106 104 V110" className="opacity-60" />
      <Path d="M112 48 L190 56 L190 84 L112 92 Z" />
      <Rect x={190} y={63} width={36} height={14} />
      <Path d="M196 63 L204 77 M206 63 L214 77 M216 63 L224 77" className="opacity-50" />
      <Center d="M22 70H234" />
      <Label x={130} y={128}>BT40 · Ø12</Label>
    </>
  ),
  collet: (
    <>
      <Rect x={30} y={56} width={110} height={28} />
      <Poly points={zigzag(30, 60, 5, 56, 52)} fill="none" className="opacity-60" />
      <Poly points={zigzag(30, 60, 5, 84, 88)} fill="none" className="opacity-60" />
      <Path d="M140 50 L194 44 L208 52 L208 88 L194 96 L140 90 Z" />
      <Path d="M156 62 H208 M156 78 H208" className="opacity-60" />
      <Center d="M20 70H222" />
      <Dim x1={140} x2={208} y={112} label="Ø12" />
    </>
  ),
}

export default function ToolDrawing({ kind, className = '' }: { kind: DrawingKey; className?: string }) {
  return (
    <svg
      viewBox="0 0 240 140"
      className={`plot ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {drawings[kind]}
    </svg>
  )
}
