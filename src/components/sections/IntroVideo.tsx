'use client'

import { useState } from 'react'
import { INTRO_VIDEO_POSTER, INTRO_VIDEO_URL } from '@/lib/content'

/** Click-to-play poster; the Vimeo iframe is only mounted once the user asks for it. */
export function IntroVideo() {
  const [playing, setPlaying] = useState(false)

  return (
    <section id="intro-video" className="px-4 pt-5 pb-1.5 sm:px-[clamp(18px,6vw,8em)] sm:pt-[26px] sm:pb-2.5">
      <div
        data-reveal
        className="intro-halo relative overflow-hidden rounded-[32px] bg-dark p-[3px]"
      >
        <div className="relative z-[1] aspect-video overflow-hidden rounded-[29px]">
          {playing ? (
            <iframe
              src={`${INTRO_VIDEO_URL}&autoplay=1`}
              allow="autoplay; fullscreen"
              allowFullScreen
              title="סרטון הפתיחה"
              className="block h-full w-full border-none bg-[#111]"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="הפעלת סרטון הפתיחה"
              className="relative flex h-full w-full cursor-pointer items-center justify-center bg-dark"
            >
              <img loading="lazy" decoding="async" src={INTRO_VIDEO_POSTER} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <span className="relative z-[2] flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#06B58D,#42C5C6_55%,#6EB9F2)] shadow-[0_14px_36px_rgba(6,181,141,.35)] transition-transform duration-300 hover:scale-[1.08]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5z" />
                </svg>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
