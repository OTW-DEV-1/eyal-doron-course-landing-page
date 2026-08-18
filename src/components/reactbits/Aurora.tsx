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
 * The page mounts a dozen of these, so cost per instance matters a lot.
 *
 * Three things keep it cheap:
 *  - The canvas backing store is capped at MAX_DIM on its longest side and
 *    stretched by CSS. The output passes through a 30px blur, so the upscale is
 *    invisible — but it cuts the per-frame fill from millions of pixels to tens
 *    of thousands.
 *  - Animation is paused entirely while the canvas is off-screen.
 *  - Frames are capped at ~30fps. The blobs drift slowly; 60fps buys nothing.
 *
 * Motion is time-based rather than per-frame so the drift speed is identical
 * regardless of the frame cap or a dropped frame.
 */
const MAX_DIM = 360
const FRAME_MS = 1000 / 30

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

    const cols = colors.split(',').map((s) => s.trim())
    const blobs = cols.map((c, i) => ({
      c,
      ph: i * 1.9,
      rx: 0.3 + (i % 3) * 0.13,
      sp: 0.7 + (i % 2) * 0.5,
    }))

    let w = 0
    let h = 0

    const resize = () => {
      const cw = Math.max(2, canvas.offsetWidth)
      const ch = Math.max(2, canvas.offsetHeight)
      const scale = Math.min(1, MAX_DIM / Math.max(cw, ch))
      w = canvas.width = Math.max(2, Math.round(cw * scale))
      h = canvas.height = Math.max(2, Math.round(ch * scale))
    }

    const render = (t: number) => {
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
    }

    resize()

    // A static frame is enough when the visitor has asked for reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      render(0)
      return
    }

    let raf = 0
    let t = Math.random() * 100
    let last = performance.now()
    let lastDraw = 0
    let visible = false

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      // Advance by wall-clock so the cap below cannot slow the drift down.
      t += (now - last) / 1000 * 0.168 * speed
      last = now
      if (now - lastDraw < FRAME_MS) return
      lastDraw = now
      render(t)
    }

    const start = () => {
      if (raf) return
      last = performance.now()
      lastDraw = 0
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (!raf) return
      cancelAnimationFrame(raf)
      raf = 0
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) start()
        else stop()
      },
      { rootMargin: '120px' },
    )
    io.observe(canvas)

    const ro = new ResizeObserver(() => {
      resize()
      // Repaint immediately so a resize while paused does not leave it blank.
      if (!visible) render(t)
    })
    ro.observe(canvas)

    // Stop burning frames on a background tab.
    const onVisibility = () => {
      if (document.hidden) stop()
      else if (visible) start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
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
