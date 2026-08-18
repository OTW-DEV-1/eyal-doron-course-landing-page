import type { ReactNode, SVGProps } from 'react'

/* ---------------------------------------------------------------------------
   Icons

   Every icon is a thin-stroke 24×24 line drawing stroked with the brand
   spectrum. The gradient must be defined per-instance (each needs a unique id)
   and uses userSpaceOnUse so the ramp spans the icon box rather than the path
   bounding box — otherwise single-line icons render as a flat colour.
--------------------------------------------------------------------------- */

type IconPath = string | [tag: 'circle', attrs: SVGProps<SVGCircleElement>]

type GradientIconProps = {
  id: string
  paths: IconPath[]
  size?: number
  /** Solid colour instead of the spectrum gradient. */
  color?: string
  /** Stroke width, or 'thin' for a hairline that ignores scaling. */
  strokeWidth?: number | 'thin'
  className?: string
}

export function GradientIcon({
  id,
  paths,
  size = 26,
  color,
  strokeWidth = 1.7,
  className,
}: GradientIconProps) {
  const stroke = color || `url(#${id})`
  const extra =
    strokeWidth === 'thin'
      ? { strokeWidth: 2, vectorEffect: 'non-scaling-stroke' as const }
      : { strokeWidth }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={24} y2={24}>
          <stop offset="0%" stopColor="#06B58D" />
          <stop offset="50%" stopColor="#42C5C6" />
          <stop offset="100%" stopColor="#6EB9F2" />
        </linearGradient>
      </defs>
      {paths.map((p, i) =>
        Array.isArray(p) ? (
          <circle
            key={i}
            {...p[1]}
            stroke={stroke}
            {...extra}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <path
            key={i}
            d={p}
            stroke={stroke}
            {...extra}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ),
      )}
    </svg>
  )
}

/** Shared icon geometry, keyed by name. */
export const ICONS = {
  star: ['M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6-5.4-2.9-5.4 2.9 1.1-6L3.2 9.4l6.1-.8z'],
  bolt: ['M13 3 4 14h7l-1 7 9-11h-7z'],
  aim: [
    ['circle', { cx: 12, cy: 12, r: 9 }],
    ['circle', { cx: 12, cy: 12, r: 4.5 }],
    ['circle', { cx: 12, cy: 12, r: 0.8 }],
  ],
  flex: ['M4 17c4 0 4-10 8-10s4 10 8 10', 'M4 7h.01', 'M20 17h.01'],
  link: [
    'M9.4 14.6 14.6 9.4',
    ['circle', { cx: 7, cy: 17, r: 3.4 }],
    ['circle', { cx: 17, cy: 7, r: 3.4 }],
  ],
  spark: [
    'M12 3v4', 'M12 17v4', 'M3 12h4', 'M17 12h4',
    'M5.6 5.6l2.8 2.8', 'M15.6 15.6l2.8 2.8', 'M18.4 5.6l-2.8 2.8', 'M8.4 15.6l-2.8 2.8',
  ],
  quest: ['M9 9.5a3 3 0 1 1 4.3 2.7c-.9.45-1.3 1.05-1.3 2v.3', 'M12 18h.01'],
  chatBig: ['M21 11.5a7.5 7.5 0 0 1-7.5 7.5H5l1.7-3.2A7.5 7.5 0 1 1 21 11.5z', 'M9 11h6', 'M9 14h4'],
  home: ['M3.5 11 12 4l8.5 7', 'M5.5 9.8V20h13V9.8', 'M10 20v-5h4v5'],
  clockBig: [['circle', { cx: 12, cy: 12, r: 9 }], 'M12 7v5l3.2 2'],
  clock: [['circle', { cx: 12, cy: 12, r: 8.5 }], 'M12 7.5v4.5l3 2'],
  chat: ['M21 11.5a8 8 0 0 1-11.8 7L4 20l1.5-5.2A8 8 0 1 1 21 11.5z'],
  user: [['circle', { cx: 12, cy: 8, r: 3.4 }], 'M5.5 20c.8-3.8 3.4-6 6.5-6s5.7 2.2 6.5 6'],
  trend: ['M3.5 17.5 9 12l4 3.5 7-8', 'M15 7.5h5v5'],
  trophy: ['M8 21h8', 'M12 17v4', 'M7 4h10v4a5 5 0 0 1-10 0z', 'M7 4H4v2a3 3 0 0 0 3 3', 'M17 4h3v2a3 3 0 0 1-3 3'],
  globe: [
    ['circle', { cx: 12, cy: 12, r: 10 }],
    'M2 12h20',
    'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  ],
  book: ['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'],
  map: ['M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z', 'M9 4v14', 'M15 6v14'],
  doc: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M8 13h8', 'M8 17h5'],
  people: [
    ['circle', { cx: 9, cy: 8, r: 3.5 }],
    'M2.5 20a6.5 6.5 0 0 1 13 0',
    ['circle', { cx: 17.5, cy: 9.5, r: 2.8 }],
    'M15.5 14.6a5.5 5.5 0 0 1 6 5.4',
  ],
} satisfies Record<string, IconPath[]>

/* ---------------------------------------------------------------------------
   Buttons
--------------------------------------------------------------------------- */

const SPECTRUM_BG = 'bg-[linear-gradient(100deg,#06B58D,#42C5C6_50%,#6EB9F2)]'

type CtaProps = {
  href: string
  children: ReactNode
  className?: string
  /** Outlined variant used as the hero's secondary action. */
  variant?: 'solid' | 'outline'
}

/**
 * `data-magnet` opts the element into the cursor-follow effect wired up by
 * MotionProvider.
 */
export function Cta({ href, children, className = '', variant = 'solid' }: CtaProps) {
  const base =
    'inline-block rounded-full border-[1.5px] font-semibold transition-[filter,transform,background-color,color,box-shadow] duration-300'
  const skin =
    variant === 'solid'
      ? `${SPECTRUM_BG} border-transparent text-white hover:brightness-[1.12] hover:text-white`
      : 'bg-page-alt text-ink border-ink hover:bg-ink hover:text-white'

  return (
    <a href={href} data-magnet className={`${base} ${skin} ${className}`}>
      {children}
    </a>
  )
}

/** The site's recurring light card: warm white gradient, hairline white border. */
export const CARD =
  'bg-[linear-gradient(160deg,#FFFFFF_0%,#EFEEEB_100%)] border border-white'
