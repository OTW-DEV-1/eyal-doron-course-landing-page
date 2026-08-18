'use client'

import { useRef, useState } from 'react'
import { asset } from '@/lib/assets'
import { testimonials, videoTestimonials } from '@/lib/content'
import { CARD } from '@/components/ui'

function VideoCard({ v }: { v: (typeof videoTestimonials)[number] }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div data-reveal className={`${CARD} flex flex-col gap-[14px] rounded-[26px] px-[22px] pt-[22px] pb-[26px]`}>
      {playing ? (
        <iframe
          src={`${v.url}&autoplay=1`}
          allow="autoplay; fullscreen"
          allowFullScreen
          title={v.name}
          className="aspect-video w-full rounded-2xl border-none bg-[#111]"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`הפעלת הסרטון של ${v.name}`}
          className="relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-dark"
        >
          <img src={v.thumb} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="relative z-[2] flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#06B58D,#42C5C6_55%,#6EB9F2)] shadow-[0_10px_26px_rgba(6,181,141,.35)] transition-transform duration-300">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5z" />
            </svg>
          </span>
        </button>
      )}
      <div className="text-right">
        <div className="text-[23px] font-bold text-ink-black">{v.name}</div>
        <div className="text-[19.5px] text-ink-black">{v.role}</div>
      </div>
    </div>
  )
}

/**
 * Video testimonials plus a horizontally-snapping strip of written ones.
 *
 * The arrows scroll by one card width. Because the page is RTL, "next" scrolls
 * in the negative direction — hence the inverted signs.
 */
export function Numbers() {
  const stripRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState<Record<number, boolean>>({})

  const step = () => {
    const c = stripRef.current
    return c ? (c.clientWidth - 44) / 3 + 22 : 0
  }

  return (
    <section id="numbers" className="px-4 pt-5 pb-[34px] sm:px-[clamp(18px,6vw,8em)] sm:pt-[30px] sm:pb-10">
      <div className="w-full">
        <h2
          data-reveal
          className="text-headline mb-4 pb-0 text-center text-[42.5px] leading-[1.3] font-bold sm:mb-[52px] sm:text-[clamp(34px,6.3vw,75px)]"
        >
          מספרים מהשטח
        </h2>

        <div className="mb-[30px] grid grid-cols-1 gap-6 md:grid-cols-2">
          {videoTestimonials.map((v) => (
            <VideoCard key={v.url} v={v} />
          ))}
        </div>

        <div className="relative">
          <div
            ref={stripRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-[22px] overflow-x-auto px-0.5 pt-1.5 pb-[14px] [scrollbar-width:none]"
          >
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                data-reveal
                className={`${CARD} flex w-full min-w-0 flex-none snap-start flex-col gap-[14px] rounded-[26px] px-8 py-9 sm:w-[calc((100%-44px)/3)] sm:min-w-[300px]`}
              >
                <div className="text-spectrum self-start text-[55px] leading-[.65] font-bold">&quot;</div>
                <div className="flex-1">
                  <p
                    className="testimonial-text text-[25px] leading-[1.5] text-pretty text-ink-black"
                    data-clamped={String(!expanded[i])}
                  >
                    {t.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded((s) => ({ ...s, [i]: !s[i] }))}
                  className="text-spectrum cursor-pointer self-start border-none p-0 text-right text-[20px] font-bold"
                >
                  {expanded[i] ? 'הצג פחות' : 'קרא עוד'}
                </button>
                <div className="mt-1.5 flex min-h-16 items-center gap-[14px]">
                  <img
                    src={asset(t.photo)}
                    alt={t.name}
                    className="block h-[52px] w-[52px] flex-none rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[23px] font-bold text-ink-black">{t.name}</div>
                    <div className="text-[19.5px] text-ink-black">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => stripRef.current?.scrollBy({ left: step(), behavior: 'smooth' })}
            aria-label="הקודם"
            className="absolute top-1/2 right-[-6px] z-[2] flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E3E1DC] bg-white text-ink transition-all duration-300 hover:border-transparent hover:bg-[linear-gradient(100deg,#06B58D,#42C5C6_50%,#6EB9F2)] hover:text-white sm:right-[-24px] sm:h-[52px] sm:w-[52px]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => stripRef.current?.scrollBy({ left: -step(), behavior: 'smooth' })}
            aria-label="הבא"
            className="absolute top-1/2 left-[-6px] z-[2] flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#E3E1DC] bg-white text-ink transition-all duration-300 hover:border-transparent hover:bg-[linear-gradient(100deg,#06B58D,#42C5C6_50%,#6EB9F2)] hover:text-white sm:left-[-24px] sm:h-[52px] sm:w-[52px]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
