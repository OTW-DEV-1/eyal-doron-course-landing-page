'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

type AuroraProps = {
  colors?: string
  intensity?: number
  speed?: number
  fadeEdges?: boolean
  /**
   * Starting phase of the blob drift. The prototype used Math.random(), which
   * made the first impression a lottery — some loads matched the design's
   * intended composition and some looked washed out, and no two screenshots
   * agreed. A fixed seed makes every load open on the same composition; tune
   * per instance to art-direct where the colour mass sits.
   */
  seed?: number
  className?: string
  style?: CSSProperties
}

const FADE =
  'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.6) 18%,#000 40%,#000 60%,rgba(0,0,0,.6) 82%,transparent 100%)'

/**
 * Drifting blurred colour blobs — the brand's "aurora" motif.
 *
 * The page mounts twelve of these, so compositor cost dominates. The key is
 * that the canvas ELEMENT is kept small and scaled up, rather than being
 * full-size:
 *
 *   `filter: blur()` forces the browser to allocate a second render surface at
 *   the element's rendered size. A full-viewport aurora therefore cost two
 *   ~1.4Mpx layers, and twelve of them accounted for most of a ~359MB GPU layer
 *   budget. Past that budget the compositor rasterises in tiles and culls
 *   anything outside its interest rect, which is what made the 3D gallery
 *   sphere paint in and drop out mid-rotation.
 *
 *   Instead the canvas is laid out at its backing-store size (<=360px) and
 *   scaled up with a transform. `filter` applies before `transform`, so the
 *   blur runs on the small surface and is scaled up with it — the blur radius
 *   is pre-divided so the on-screen result is unchanged. Layer area drops ~20x.
 *
 * The output is a heavy blur either way, so the upscale is invisible.
 */
const MAX_DIM = 360
const FRAME_MS = 1000 / 30
const BLUR_PX = 30

export function Aurora({
  colors = '#06B58D,#42C5C6,#6EB9F2',
  intensity = 0.55,
  speed = 1,
  fadeEdges = false,
  seed = 13,
  className,
  style,
}: AuroraProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = ref.current
    if (!host || !canvas) return
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
      const cw = Math.max(2, host.offsetWidth)
      const ch = Math.max(2, host.offsetHeight)
      const scale = Math.min(1, MAX_DIM / Math.max(cw, ch))
      w = canvas.width = Math.max(2, Math.round(cw * scale))
      h = canvas.height = Math.max(2, Math.round(ch * scale))
      // Lay the canvas out at its backing-store size, then scale it to fill the
      // host. Blur is pre-divided so it lands at BLUR_PX once scaled up.
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      canvas.style.transform = `scale(${cw / w}, ${ch / h})`
      canvas.style.filter = `blur(${(BLUR_PX * scale).toFixed(2)}px) saturate(1.05)`
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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      render(seed)
      return
    }

    let raf = 0
    let t = seed
    let last = performance.now()
    let lastDraw = 0
    let visible = false

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      // Advance by wall-clock so the frame cap cannot slow the drift down.
      t += ((now - last) / 1000) * 0.168 * speed
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
        if (visible && !document.hidden) start()
        else stop()
      },
      { rootMargin: '120px' },
    )
    io.observe(host)

    const ro = new ResizeObserver(() => {
      resize()
      if (!visible) render(t)
    })
    ro.observe(host)

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
  }, [colors, speed, seed])

  const fade = fadeEdges ? FADE : undefined

  // `inset: 0` below is only a default. If the caller pins one edge and gives a
  // size, the opposite edge has to be released or the box is over-constrained —
  // and this page is RTL, where the browser resolves that by ignoring `left`,
  // not `right`. That silently flipped the hero's aurora to the wrong side.
  const s = (style ?? {}) as Record<string, unknown>
  const release = {
    ...(s.width !== undefined && s.left !== undefined && s.right === undefined ? { right: 'auto' } : {}),
    ...(s.width !== undefined && s.right !== undefined && s.left === undefined ? { left: 'auto' } : {}),
    ...(s.height !== undefined && s.height !== 'auto' && s.top !== undefined && s.bottom === undefined
      ? { bottom: 'auto' }
      : {}),
    ...(s.height !== undefined && s.height !== 'auto' && s.bottom !== undefined && s.top === undefined
      ? { top: 'auto' }
      : {}),
  }

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        // Deliberately NOT overflow:hidden. A CSS blur paints far outside the
        // element's box, and that soft spill is what makes the aurora read as a
        // glow rather than a rectangle. Clipping it here produced hard edges.
        // Parents that need the aurora contained (rounded cards, dark panels)
        // already carry their own overflow:hidden.
        pointerEvents: 'none',
        opacity: intensity,
        WebkitMaskImage: fade,
        maskImage: fade,
        ...style,
        ...release,
      }}
    >
      <canvas
        ref={ref}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transformOrigin: '0 0',
          // width/height/transform/filter are set from the effect once the host
          // has been measured.
        }}
      />
    </div>
  )
}
