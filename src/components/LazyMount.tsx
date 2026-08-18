'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Defers mounting a subtree until it approaches the viewport.
 *
 * Used for the photo sphere, which builds 70 3D-transformed tiles and pulls 19
 * images. Rendering that on page load costs a noticeable chunk of the initial
 * frame budget for a section most visitors take several seconds to reach.
 *
 * The placeholder reserves the same height so nothing shifts when it swaps in.
 */
export function LazyMount({
  children,
  className,
  rootMargin = '300px',
}: {
  children: ReactNode
  className?: string
  rootMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || show) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [show, rootMargin])

  return (
    <div ref={ref} className={className}>
      {show ? children : null}
    </div>
  )
}
