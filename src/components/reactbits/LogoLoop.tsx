'use client'

import type { ReactNode } from 'react'

type LogoLoopProps = {
  children: ReactNode
  gap?: number
  duration?: number
  reverse?: boolean
  fade?: boolean
}

const MASK = 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)'

/**
 * Seamless marquee. The row is rendered twice and translated -50%, so the
 * second copy lands exactly where the first started.
 */
export function LogoLoop({ children, gap = 56, duration = 26, reverse = false, fade = true }: LogoLoopProps) {
  const row = (key: string, hide: boolean) => (
    <div
      key={key}
      aria-hidden={hide || undefined}
      style={{ display: 'flex', alignItems: 'center', gap, paddingLeft: gap, flex: '0 0 auto' }}
    >
      {children}
    </div>
  )

  const mask = fade ? MASK : undefined

  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        direction: 'ltr',
        maskImage: mask,
        WebkitMaskImage: mask,
        // Vertical padding + negative margin lets card shadows overflow without
        // being clipped by the marquee's own overflow:hidden.
        padding: '48px 0',
        margin: '-48px 0',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          direction: 'ltr',
          animation: `rbLoop ${duration}s linear infinite${reverse ? ' reverse' : ''}`,
        }}
      >
        {row('a', false)}
        {row('b', true)}
      </div>
    </div>
  )
}
