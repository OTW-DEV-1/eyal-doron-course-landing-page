'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import Lenis from 'lenis'

const clamp01 = (v: number) => Math.max(0, Math.min(1, v))

type LetterHost = HTMLElement & {
  _letters?: HTMLSpanElement[]
  _clipTxt?: boolean
  _bgImg?: string
}
type RevealEl = HTMLElement & { _seenAtLoad?: boolean; _lastP?: number }
type ClipAnc = HTMLElement & { _bgImg?: string }

/**
 * Splits a headline into per-character spans so they can be staggered in.
 *
 * Gradient-clipped text is the tricky part: `background-clip:text` on the
 * parent would clip against the parent's box, so each character has to carry
 * its own copy of the gradient. The original background is read once, then
 * cleared from the parent and re-applied per span.
 */
function initLetters(lq: LetterHost) {
  if (lq._letters?.length && lq._letters[0].isConnected) return

  const cs = getComputedStyle(lq)
  if (lq._clipTxt == null) {
    lq._clipTxt = cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text'
    const bi = cs.backgroundImage
    lq._bgImg = bi && bi !== 'none' ? bi : 'linear-gradient(to left,#5b5b5a,#000000)'
  }
  const clipTxt = lq._clipTxt
  const bgImg = lq._bgImg as string

  if (clipTxt) {
    lq.style.background = 'none'
    lq.style.webkitTextFillColor = 'initial'
    lq.style.color = '#000000'
  }

  const spans: HTMLSpanElement[] = []
  const walker = document.createTreeWalker(lq, NodeFilter.SHOW_TEXT, null)
  const texts: Text[] = []
  let tn: Node | null
  while ((tn = walker.nextNode())) texts.push(tn as Text)

  texts.forEach((t) => {
    // Walk up to find an ancestor with its own gradient (e.g. a highlighted word).
    let nClip = false
    let nBg: string | null = null
    let anc = t.parentNode as ClipAnc | null
    while (anc && anc !== lq && anc.nodeType === 1) {
      const acs = getComputedStyle(anc)
      if (acs.webkitBackgroundClip === 'text' || acs.backgroundClip === 'text') {
        if (anc._bgImg == null) {
          const abi = acs.backgroundImage
          anc._bgImg = abi && abi !== 'none' ? abi : bgImg
          anc.style.background = 'none'
          anc.style.webkitTextFillColor = 'initial'
        }
        nClip = true
        nBg = anc._bgImg
        break
      }
      anc = anc.parentNode as ClipAnc | null
    }

    const frag = document.createDocumentFragment()
    let word: HTMLSpanElement | null = null
    t.textContent?.split('').forEach((ch) => {
      if (/\s/.test(ch)) {
        word = null
        frag.appendChild(document.createTextNode(ch))
        return
      }
      if (!word) {
        // Wrap each word so inline-block characters never break mid-word.
        word = document.createElement('span')
        word.style.display = 'inline-block'
        word.style.whiteSpace = 'nowrap'
        frag.appendChild(word)
      }
      const s = document.createElement('span')
      s.textContent = ch
      s.style.display = 'inline-block'
      s.style.willChange = 'transform,opacity'
      if (clipTxt || nClip) {
        s.style.backgroundImage = nClip ? (nBg as string) : bgImg
        s.style.webkitBackgroundClip = 'text'
        s.style.backgroundClip = 'text'
        s.style.webkitTextFillColor = 'transparent'
      }
      word.appendChild(s)
      spans.push(s)
    })
    t.parentNode?.replaceChild(frag, t)
  })

  lq._letters = spans
}

/**
 * Scroll-driven motion for the whole page.
 *
 * Performance note: every frame is split into a read phase and a write phase.
 * Interleaving `getBoundingClientRect` with style writes would force the
 * browser to recalculate layout once per element — with ~100 animated elements
 * that alone is enough to make scrolling stutter. All geometry is gathered
 * first, then all styles are applied.
 */
export function MotionProvider() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // The section markup is static, so these lists are collected once rather
    // than re-queried on every frame.
    let reveals = Array.from(document.querySelectorAll<RevealEl>('[data-reveal]'))
    let letterHosts = Array.from(document.querySelectorAll<LetterHost>('[data-letters]'))
    let stackCards = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-card]'))
    const tl = document.querySelector<HTMLElement>('[data-tl-wrap]')
    const tlLine = tl?.querySelector<HTMLElement>('[data-tl-line]') ?? null
    const tlBg = tl?.querySelector<HTMLElement>('[data-tl-bg]') ?? null
    const tlDots = tl ? Array.from(tl.querySelectorAll<HTMLElement>('[data-tl-dot]')) : []

    const refreshNodes = () => {
      reveals = Array.from(document.querySelectorAll<RevealEl>('[data-reveal]'))
      letterHosts = Array.from(document.querySelectorAll<LetterHost>('[data-letters]'))
      stackCards = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-card]'))
    }

    letterHosts.forEach((el) => {
      try {
        initLetters(el)
      } catch {
        /* a headline that resists splitting simply stays static */
      }
    })

    let ticking = false
    let firstPaint = true

    const paint = () => {
      ticking = false
      const vh = window.innerHeight || 800
      const sy = window.scrollY || 0

      /* ---------------- read phase: no style writes below this line -------- */

      // Hoisted out of the per-element loop — reading it inside would force a
      // reflow on every iteration.
      const docH = document.body.scrollHeight || 0

      const revealRects = reveals.map((el) => el.getBoundingClientRect())
      const letterRects = letterHosts.map((el) => el.getBoundingClientRect())
      const stackRects = stackCards.map((el) => el.getBoundingClientRect())

      const tlRect = tl ? tl.getBoundingClientRect() : null
      const tlDotRects = tlRect ? tlDots.map((d) => d.getBoundingClientRect()) : []

      /* ---------------- write phase ---------------------------------------- */

      reveals.forEach((el, i) => {
        const r = revealRects[i]
        // Anything already on screen at load is shown outright — no fade-in for
        // content the visitor can already see.
        if ((firstPaint || sy < 40) && r.top < vh && r.bottom > 0) el._seenAtLoad = true
        if (r.bottom < -300 || r.top > vh + 300) return

        // Near the document end there is no scroll left to drive the reveal, so
        // push the last screenful in explicitly.
        const endBoost = r.top < vh ? clamp01((sy + vh - (docH - vh * 0.3)) / (vh * 0.25)) : 0
        const early = el.hasAttribute('data-reveal-early')
        const enter = el._seenAtLoad
          ? 1
          : Math.max(
              early
                ? clamp01((vh * 1.04 - r.top) / (vh * 0.16))
                : clamp01((vh * 0.97 - r.top) / (vh * 0.34)),
              clamp01((vh * 0.98 - r.bottom) / (vh * 0.18)),
              endBoost,
            )
        const exit = clamp01(r.bottom / (vh * 0.22))
        const p = Math.min(enter, exit)

        // Once an element is settled, stop re-writing identical styles. This is
        // the common case while scrolling past finished content.
        if (el._lastP === 1 && p === 1) return
        el._lastP = p

        const y = (1 - enter) * 90 - (1 - exit) * 90
        const bp = clamp01(p / 0.45)
        const blur = bp > 0.97 ? 'none' : `blur(${((1 - bp) * 8).toFixed(2)}px)`

        const xa = el.getAttribute('data-reveal-x')
        const md = el.getAttribute('data-reveal-mode')
        let vals: gsap.TweenVars
        if (xa) vals = { opacity: p, x: (1 - p) * (xa === 'right' ? 130 : -130), y: 0, scale: 1, filter: blur }
        else if (md === 'scale') vals = { opacity: p, x: 0, y: 0, scale: 0.55 + 0.45 * p, filter: blur }
        else vals = { opacity: p, x: 0, y, scale: 0.93 + 0.07 * p, filter: blur }

        gsap.set(el, vals)
      })
      firstPaint = false

      letterHosts.forEach((lq, i) => {
        if (!lq._letters) return
        const qr = letterRects[i]
        if (qr.bottom < -200 || qr.top > vh + 200) return
        const prog = (lq as RevealEl)._seenAtLoad ? 1 : clamp01((vh * 1.0 - qr.top) / (vh * 0.42))
        const L = lq._letters
        const N = L.length
        for (let j = 0; j < N; j++) {
          // Each character trails the one before it by a fraction of the total.
          const lp = clamp01((prog - (j / N) * 0.75) / 0.25)
          L[j].style.opacity = String(lp)
          L[j].style.transform = `translateY(${((1 - lp) * 34).toFixed(1)}px)`
        }
      })

      // Sticky cards: as the next one rises, shrink, darken and blur the one behind.
      stackCards.forEach((card, i) => {
        const next = stackRects[i + 1]
        if (!next) {
          card.style.transform = ''
          card.style.filter = ''
          return
        }
        const r = stackRects[i]
        const dist = next.top - r.top
        const dist0 = r.height + 28
        const p = clamp01((dist0 - dist) / Math.max(1, (dist0 - 18) * 0.6))
        card.style.transform = `scale(${(1 - p * 0.14).toFixed(4)})`
        card.style.transformOrigin = 'center top'
        card.style.filter = `brightness(${(1 - p * 0.28).toFixed(3)}) blur(${(p * 2.5).toFixed(2)}px)`
      })

      // Process timeline: fill the spine and light up dots as it passes them.
      if (tl && tlRect) {
        const prog = clamp01((vh * 0.6 - tlRect.top) / tlRect.height)
        let topOff = 0
        let botOff = 0
        if (tlDotRects.length) {
          // Trim the spine to run between the first and last dot centres.
          const fr = tlDotRects[0]
          const lr = tlDotRects[tlDotRects.length - 1]
          topOff = fr.top + fr.height / 2 - tlRect.top
          botOff = tlRect.bottom - (lr.top + lr.height / 2)
          if (tlBg) {
            tlBg.style.top = `${topOff}px`
            tlBg.style.bottom = `${botOff}px`
          }
        }
        const span = Math.max(1, tlRect.height - topOff - botOff)
        if (tlLine) {
          tlLine.style.top = `${topOff}px`
          tlLine.style.height = `${(prog * span).toFixed(1)}px`
        }
        const lineY = tlRect.top + topOff + span * prog
        tlDots.forEach((d, i) => {
          const dr = tlDotRects[i]
          const on = dr.top + dr.height / 2 <= lineY + 2
          d.style.background = on ? 'linear-gradient(120deg,#06B58D,#42C5C6 50%,#6EB9F2)' : '#3A3844'
          d.style.boxShadow = on ? '0 0 20px rgba(66,197,198,.75)' : 'none'
          d.style.transform = on ? 'scale(1.3)' : 'scale(1)'
        })
      }
    }

    // One listener, one rAF per frame, covering reveals, letters, stack and timeline.
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(paint)
      }
    }
    const onResize = () => {
      refreshNodes()
      onScroll()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    paint()
    // Late repaints catch layout that settles after fonts and images load.
    const t1 = setTimeout(paint, 400)
    const t2 = setTimeout(() => {
      refreshNodes()
      paint()
    }, 1200)

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    let lraf = 0
    const raf = (time: number) => {
      lenis.raf(time)
      lraf = requestAnimationFrame(raf)
    }
    lraf = requestAnimationFrame(raf)

    // Anchor links must go through Lenis, otherwise native smooth scrolling
    // fights it and the page jitters. One delegated listener rather than one
    // per anchor.
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || href === '#') return
      const target = document.querySelector(href)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -70 })
    }
    document.addEventListener('click', onAnchorClick)

    // Magnetic buttons: nudge toward the cursor, spring back on leave. Bound by
    // delegation so no per-element listeners are attached, and skipped entirely
    // on touch-primary devices where there is no cursor to follow.
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const onPointerMove = (ev: PointerEvent) => {
      const el = (ev.target as HTMLElement | null)?.closest?.('[data-magnet]') as HTMLElement | null
      if (!el) return
      const r = el.getBoundingClientRect()
      gsap.to(el, {
        x: (ev.clientX - r.left - r.width / 2) * 0.22,
        y: (ev.clientY - r.top - r.height / 2) * 0.3,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
    const onPointerOut = (ev: PointerEvent) => {
      const el = (ev.target as HTMLElement | null)?.closest?.('[data-magnet]') as HTMLElement | null
      if (!el) return
      // Ignore moves between children of the same button.
      if (el.contains(ev.relatedTarget as Node | null)) return
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' })
    }
    if (hasHover) {
      document.addEventListener('pointermove', onPointerMove, { passive: true })
      document.addEventListener('pointerout', onPointerOut, { passive: true })
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      clearTimeout(t1)
      clearTimeout(t2)
      cancelAnimationFrame(lraf)
      lenis.destroy()
      document.removeEventListener('click', onAnchorClick)
      if (hasHover) {
        document.removeEventListener('pointermove', onPointerMove)
        document.removeEventListener('pointerout', onPointerOut)
      }
    }
  }, [])

  return null
}
