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
type RevealEl = HTMLElement & { _seenAtLoad?: boolean }
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
 * Scroll-driven motion for the whole page. Everything is derived from element
 * positions on each frame rather than from one-shot triggers, so elements fade
 * back out on the way past and the page stays correct after resize or
 * navigation.
 */
export function MotionProvider() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    document.querySelectorAll<LetterHost>('[data-letters]').forEach((el) => {
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

      document.querySelectorAll<RevealEl>('[data-reveal]').forEach((el) => {
        const r = el.getBoundingClientRect()
        // Anything already on screen at load is shown outright — no fade-in for
        // content the visitor can already see.
        if ((firstPaint || (window.scrollY || 0) < 40) && r.top < vh && r.bottom > 0) el._seenAtLoad = true
        if (r.bottom < -300 || r.top > vh + 300) return

        const sy = window.scrollY || 0
        const docH = document.body.scrollHeight || 0
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

      document.querySelectorAll<LetterHost>('[data-letters]').forEach((lq) => {
        try {
          initLetters(lq)
        } catch {
          return
        }
        if (!lq._letters) return
        const qr = lq.getBoundingClientRect()
        if (qr.bottom < -200 || qr.top > vh + 200) return
        const prog = (lq as RevealEl)._seenAtLoad ? 1 : clamp01((vh * 1.0 - qr.top) / (vh * 0.42))
        const L = lq._letters
        const N = L.length
        for (let i = 0; i < N; i++) {
          // Each character trails the one before it by a fraction of the total.
          const lp = clamp01((prog - (i / N) * 0.75) / 0.25)
          L[i].style.opacity = String(lp)
          L[i].style.transform = `translateY(${((1 - lp) * 34).toFixed(1)}px)`
        }
      })

      // Process timeline: fill the spine and light up dots as it passes them.
      const tl = document.querySelector<HTMLElement>('[data-tl-wrap]')
      if (tl) {
        const tr = tl.getBoundingClientRect()
        const prog = clamp01((vh * 0.6 - tr.top) / tr.height)
        const line = tl.querySelector<HTMLElement>('[data-tl-line]')
        const dots = tl.querySelectorAll<HTMLElement>('[data-tl-dot]')
        let topOff = 0
        let botOff = 0
        if (dots.length) {
          // Trim the spine to run between the first and last dot centres.
          const fr = dots[0].getBoundingClientRect()
          const lr = dots[dots.length - 1].getBoundingClientRect()
          topOff = fr.top + fr.height / 2 - tr.top
          botOff = tr.bottom - (lr.top + lr.height / 2)
          const bg = tl.querySelector<HTMLElement>('[data-tl-bg]')
          if (bg) {
            bg.style.top = `${topOff}px`
            bg.style.bottom = `${botOff}px`
          }
        }
        const span = Math.max(1, tr.height - topOff - botOff)
        if (line) {
          line.style.top = `${topOff}px`
          line.style.height = `${(prog * span).toFixed(1)}px`
        }
        const lineY = tr.top + topOff + span * prog
        dots.forEach((d) => {
          const dr = d.getBoundingClientRect()
          const on = dr.top + dr.height / 2 <= lineY + 2
          d.style.background = on ? 'linear-gradient(120deg,#06B58D,#42C5C6 50%,#6EB9F2)' : '#3A3844'
          d.style.boxShadow = on ? '0 0 20px rgba(66,197,198,.75)' : 'none'
          d.style.transform = on ? 'scale(1.3)' : 'scale(1)'
        })
      }
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(paint)
      }
    }

    // "Mach a Kartn" stacking cards: as the next sticky card rises, shrink,
    // darken and blur the one behind it.
    let stackTick = false
    const onStack = () => {
      if (stackTick) return
      stackTick = true
      requestAnimationFrame(() => {
        stackTick = false
        const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-stack-card]'))
        cards.forEach((card, i) => {
          const next = cards[i + 1]
          if (!next) {
            card.style.transform = ''
            card.style.filter = ''
            return
          }
          const r = card.getBoundingClientRect()
          const nr = next.getBoundingClientRect()
          const dist = nr.top - r.top
          const dist0 = r.height + 28
          const p = clamp01((dist0 - dist) / Math.max(1, (dist0 - 18) * 0.6))
          card.style.transform = `scale(${(1 - p * 0.14).toFixed(4)})`
          card.style.transformOrigin = 'center top'
          card.style.filter = `brightness(${(1 - p * 0.28).toFixed(3)}) blur(${(p * 2.5).toFixed(2)}px)`
        })
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    window.addEventListener('scroll', onStack, { passive: true })
    paint()
    onStack()
    // Late repaints catch layout that settles after fonts and images load.
    const t1 = setTimeout(paint, 400)
    const t2 = setTimeout(paint, 1200)

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    let lraf = 0
    const raf = (time: number) => {
      lenis.raf(time)
      lraf = requestAnimationFrame(raf)
    }
    lraf = requestAnimationFrame(raf)

    // Anchor links must go through Lenis, otherwise native smooth scrolling
    // fights it and the page jitters.
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'))
    const anchorHandlers = anchors.map((a) => {
      const handler = (e: MouseEvent) => {
        const href = a.getAttribute('href')
        if (!href || href === '#') return
        const target = document.querySelector(href)
        if (!target) return
        e.preventDefault()
        lenis.scrollTo(target as HTMLElement, { offset: -70 })
      }
      a.addEventListener('click', handler)
      return { a, handler }
    })

    // Magnetic buttons: nudge toward the cursor, spring back on leave.
    const magnets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnet]'))
    const magnetHandlers = magnets.map((el) => {
      const move = (ev: MouseEvent) => {
        const r = el.getBoundingClientRect()
        gsap.to(el, {
          x: (ev.clientX - r.left - r.width / 2) * 0.22,
          y: (ev.clientY - r.top - r.height / 2) * 0.3,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
      const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' })
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      return { el, move, leave }
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('scroll', onStack)
      clearTimeout(t1)
      clearTimeout(t2)
      cancelAnimationFrame(lraf)
      lenis.destroy()
      anchorHandlers.forEach(({ a, handler }) => a.removeEventListener('click', handler))
      magnetHandlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [])

  return null
}
