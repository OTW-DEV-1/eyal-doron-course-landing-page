'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

type AuroraProps = {
  colors?: string
  intensity?: number
  speed?: number
  fadeEdges?: boolean
  className?: string
  style?: CSSProperties
}

const FADE =
  'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.6) 18%,#000 40%,#000 60%,rgba(0,0,0,.6) 82%,transparent 100%)'

/**
 * Soft blurred colour blobs drifting on a canvas — the brand's "aurora" motif.
 * Canvas rather than CSS so the blobs can overlap and blend continuously.
 */
export function Aurora({
  colors = '#06B58D,#42C5C6,#6EB9F2',
  intensity = 0.55,
  speed = 1,
  fadeEdges = false,
  className,
  style,
}: AuroraProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Render one static frame instead of animating.
      const cols = colors.split(',').map((s) => s.trim())
      const w = (canvas.width = Math.max(2, canvas.offsetWidth))
      const h = (canvas.height = Math.max(2, canvas.offsetHeight))
      cols.forEach((c, i) => {
        const x = w * (0.3 + 0.2 * i)
        const y = h * 0.5
        const r = Math.max(w, h) * (0.3 + (i % 3) * 0.13)
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, c + '5E')
        g.addColorStop(0.55, c + '3C')
        g.addColorStop(1, c + '00')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      })
      return
    }

    const cols = colors.split(',').map((s) => s.trim())
    let raf = 0
    let t = Math.random() * 100
    let w = 0
    let h = 0

    const resize = () => {
      w = canvas.width = Math.max(2, canvas.offsetWidth)
      h = canvas.height = Math.max(2, canvas.offsetHeight)
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const blobs = cols.map((c, i) => ({
      c,
      ph: i * 1.9,
      rx: 0.3 + (i % 3) * 0.13,
      sp: 0.7 + (i % 2) * 0.5,
    }))

    const draw = () => {
      t += 0.0028 * speed
      ctx.clearRect(0, 0, w, h)
      blobs.forEach((b) => {
        const x = w * (0.5 + 0.44 * Math.sin(t * b.sp + b.ph))
        const y = h * (0.5 + 0.42 * Math.cos(t * 0.8 * b.sp + b.ph * 1.4))
        const r = Math.max(w, h) * b.rx
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, b.c + '5E')
        g.addColorStop(0.55, b.c + '3C')
        g.addColorStop(1, b.c + '00')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w, h)
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [colors, speed])

  const fade = fadeEdges ? FADE : undefined

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        filter: 'blur(30px) saturate(1.05)',
        opacity: intensity,
        pointerEvents: 'none',
        WebkitMaskImage: fade,
        maskImage: fade,
        ...style,
      }}
    />
  )
}
