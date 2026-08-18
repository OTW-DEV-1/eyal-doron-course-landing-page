'use client'

import { useEffect, useRef, useState } from 'react'

type CurvedLoopProps = {
  text?: string
  fontSize?: number
  curve?: number
  speed?: number
  height?: number
}

/** Outlined text scrolling endlessly along a shallow arc. */
export function CurvedLoop({
  text = 'Action in Creativity',
  fontSize = 64,
  curve = 70,
  speed = 90,
  height = 190,
}: CurvedLoopProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const measureRef = useRef<SVGTextElement>(null)
  const tpRef = useRef<SVGTextPathElement>(null)
  const [repLen, setRepLen] = useState(0)
  const unit = text + ' '

  useEffect(() => {
    const measure = () => {
      if (measureRef.current) setRepLen(measureRef.current.getComputedTextLength())
    }
    measure()
    // Futurism loads async; remeasure once it is ready or the arc length is wrong.
    if (document.fonts?.ready) document.fonts.ready.then(() => setTimeout(measure, 60))
  }, [text, fontSize])

  // Each frame rewrites startOffset, which re-lays-out the text along the path —
  // not something to run while the arc is scrolled out of view.
  useEffect(() => {
    if (!repLen || !tpRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const svg = svgRef.current
    if (!svg) return

    let raf = 0
    let off = 0
    let last = performance.now()
    let visible = false

    const tick = (now: number) => {
      off = (off + speed * ((now - last) / 1000)) % repLen
      last = now
      tpRef.current?.setAttribute('startOffset', String(-off))
      raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (raf) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
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
      { rootMargin: '100px' },
    )
    io.observe(svg)

    const onVisibility = () => {
      if (document.hidden) stop()
      else if (visible) start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [repLen, speed])

  const reps = repLen ? Math.min(40, Math.ceil(2600 / repLen) + 2) : 10
  const full = Array(reps).fill(unit).join('')
  const mid = height / 2 + fontSize * 0.3
  const d = `M -300 ${mid} Q 450 ${mid - curve} 900 ${mid} T 1900 ${mid}`
  const fstyle = { fontFamily: "'Futurism','Heebo',sans-serif", fontWeight: 700, fontSize }

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      viewBox={`0 0 1600 ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', overflow: 'visible', direction: 'ltr' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rbCurvedGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#06B58D" />
          <stop offset="0.25" stopColor="#16BD97" />
          <stop offset="0.5" stopColor="#42C5C6" />
          <stop offset="0.75" stopColor="#5FB4F0" />
          <stop offset="1" stopColor="#6EB9F2" />
        </linearGradient>
        <path id="rbCurvedPath" d={d} fill="none" />
      </defs>
      <text ref={measureRef} style={{ ...fstyle, opacity: 0 }}>
        {unit}
      </text>
      <text style={fstyle} fill="none" stroke="url(#rbCurvedGrad)" strokeWidth="2.5">
        <textPath ref={tpRef} href="#rbCurvedPath" startOffset="0">
          {full}
        </textPath>
      </text>
    </svg>
  )
}
