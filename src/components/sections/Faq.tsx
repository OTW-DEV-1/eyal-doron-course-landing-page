'use client'

import { useState } from 'react'
import { asset } from '@/lib/assets'
import { Aurora } from '@/components/reactbits/Aurora'
import { faqs } from '@/lib/content'
import { CARD, Cta } from '@/components/ui'

/**
 * FAQ accordion, the pricing panel, and the closing quote.
 *
 * The accordion animates via `grid-template-rows: 0fr -> 1fr`, which lets the
 * panel transition to its natural height without measuring it in JS.
 */
export function Faq() {
  const [open, setOpen] = useState(-1)

  return (
    <section id="faq" className="px-4 pt-[70px] pb-[1em] sm:px-[clamp(18px,6vw,8em)] sm:pt-5 sm:pb-[4em]">
      <div className="w-full">
        <h2
          data-reveal
          className="text-headline mb-[52px] text-center text-[42.5px] leading-[1.3] font-bold sm:text-[clamp(34px,6.3vw,75px)]"
        >
          שאלות שהרבה שואלים
        </h2>

        <div className="relative pb-[6em]">
          <Aurora
            colors="#06B58D,#42C5C6,#6EB9F2"
            intensity={0.92}
            fadeEdges
            style={{ inset: '-8% -4%', width: 'auto', height: 'auto' }}
          />
          <div className="pointer-events-none absolute inset-y-[-8%] inset-x-[-4%] bg-[linear-gradient(180deg,#f6f5f3_0%,#f6f5f3_5%,rgba(246,245,243,.78)_26%,rgba(246,245,243,.62)_50%,rgba(246,245,243,.78)_74%,#f6f5f3_95%,#f6f5f3_100%)]" />

          <div className="relative grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {faqs.map((f, i) => {
              const isOpen = open === i
              return (
                <div key={f.q} data-reveal className={`${CARD} overflow-hidden rounded-[26px]`}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-none px-[26px] py-[22px] text-right text-[22px] font-semibold text-ink sm:text-[21.9px]"
                  >
                    <span>{f.q}</span>
                    <span
                      className="inline-flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-[linear-gradient(120deg,#06B58D,#6EB9F2)] text-white transition-transform duration-[450ms]"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-[450ms] ease-out"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-[26px] pb-6 text-[20px] leading-[1.3] text-gray-body">{f.a}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pricing */}
        <div
          data-reveal
          className={`${CARD} relative mt-14 overflow-hidden rounded-[26px] px-[clamp(26px,4vw,56px)] py-[clamp(30px,3.2vw,50px)] text-center`}
        >
          <div className="hidden sm:block">
            <Aurora
              colors="#06B58D,#42C5C6,#6EB9F2"
              intensity={2.36}
              style={{
                zIndex: 1,
                WebkitMaskImage:
                  'radial-gradient(ellipse 30% 42% at 0% 0%, #000 0%, rgba(0,0,0,.6) 30%, transparent 52%),radial-gradient(ellipse 30% 42% at 100% 100%, #000 0%, rgba(0,0,0,.6) 30%, transparent 52%)',
                maskImage:
                  'radial-gradient(ellipse 30% 42% at 0% 0%, #000 0%, rgba(0,0,0,.6) 30%, transparent 52%),radial-gradient(ellipse 30% 42% at 100% 100%, #000 0%, rgba(0,0,0,.6) 30%, transparent 52%)',
              }}
            />
            <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_74%_88%_at_50%_50%,#ffffff_0%,rgba(255,255,255,.9)_38%,rgba(255,255,255,0)_64%),radial-gradient(ellipse_55%_65%_at_100%_0%,#ffffff_0%,rgba(255,255,255,.9)_40%,rgba(255,255,255,0)_68%),radial-gradient(ellipse_55%_65%_at_0%_100%,#ffffff_0%,rgba(255,255,255,.9)_40%,rgba(255,255,255,0)_68%),radial-gradient(ellipse_60%_55%_at_50%_0%,#ffffff_0%,rgba(255,255,255,.9)_42%,rgba(255,255,255,0)_70%),radial-gradient(ellipse_60%_55%_at_50%_100%,#ffffff_0%,rgba(255,255,255,.9)_42%,rgba(255,255,255,0)_70%)]" />
          </div>
          {/* Phones get the flat animated wash instead of the layered aurora. */}
          <div className="pointer-events-none absolute inset-0 z-0 animate-[heroGradShift_9s_ease-in-out_infinite_alternate] bg-[linear-gradient(90deg,#06B58D_0%,#42C5C6_25%,#6EB9F2_50%,#42C5C6_75%,#06B58D_100%)] bg-[length:300%_100%] opacity-[.19] [mask-image:radial-gradient(ellipse_75%_55%_at_0%_0%,#000_0%,rgba(0,0,0,.5)_45%,transparent_74%),radial-gradient(ellipse_75%_55%_at_100%_100%,#000_0%,rgba(0,0,0,.5)_45%,transparent_74%)] sm:hidden" />

          <img loading="lazy" decoding="async" src={asset('price-texture.png')} alt="" className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover" />

          <h3 className="text-headline relative z-[2] mb-5 text-[42.5px] leading-[1.1] font-bold sm:text-[clamp(34px,6.3vw,75px)]">
            מחיר והנחה
          </h3>

          <div className="relative z-[2] mx-auto flex max-w-[760px] flex-col gap-[34px]">
            <p className="text-[24px] leading-[1.35] text-pretty text-gray-body sm:text-[32.3px]">
              מחיר הקורס הבסיסי הוא <br />
              <span className="text-[30px] font-bold text-ink-black sm:text-[54px]">750 ₪ למשתתף</span>
              <br />
              עד 100 משתתפים.
            </p>
            <p className="text-[24px] leading-[1.35] text-pretty text-gray-body sm:text-[32.3px]">
              מעבר ל-100 משתתפים <br className="block sm:hidden" />
              <span className="font-bold text-ink-black">המחיר יורד ל-650 ₪ למשתתף.</span>
            </p>
            <p className="text-[24px] leading-[1.35] text-pretty text-gray-body sm:text-[32.3px]">
              ככל שיש יותר משתתפים - <br className="block sm:hidden" />
              האפקט במסדרונות מתחזק <br />
              והמחיר פר משתתף יורד <br className="block sm:hidden" />
              (המחירים אינם כוללים מע״מ).
            </p>
            <p className="text-[24px] leading-[1.35] text-pretty text-gray-body sm:text-[32.3px]">
              את ההיקף המדויק, <br className="block sm:hidden" />
              פיילוט אפשרי והתאמת המסלול - <br />
              <span className="font-bold text-ink-black">נסגור יחד בשיחה אישית.</span>
            </p>
          </div>

          <div className="relative z-[2] mt-[26px]">
            <Cta href="#contact" className="px-9 py-[15px] text-[20.6px]">
              לקבלת הצעה מותאמת
            </Cta>
          </div>
        </div>

        {/* Closing quote — split into per-letter spans by MotionProvider. */}
        <div data-reveal className="relative mt-[72px] w-full py-[clamp(40px,4.5vw,72px)]">
          <div className="relative z-[1] flex flex-col items-center gap-[clamp(22px,2.6vw,34px)] text-center">
            <div className={`${CARD} flex h-24 w-24 flex-none items-center justify-center rounded-full`}>
              <svg width="52" height="52" viewBox="0 0 48 48" aria-hidden="true" className="block">
                <defs>
                  <linearGradient id="qgrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#06B58D" />
                    <stop offset="0.52" stopColor="#42C5C6" />
                    <stop offset="1" stopColor="#6EB9F2" />
                  </linearGradient>
                </defs>
                <path
                  d="M20.5 9C12.4 12.1 7 19.2 7 27.2 7 33.7 10.9 38 16.3 38c4.6 0 8.1-3.3 8.1-7.7 0-4.2-3-7.4-7.1-7.4-.8 0-1.6.1-2.3.4 1-4.9 4.4-9 9.3-11.4L20.5 9z"
                  fill="url(#qgrad)"
                />
                <path
                  d="M40.1 9c-8.1 3.1-13.5 10.2-13.5 18.2 0 6.5 3.9 10.8 9.3 10.8 4.6 0 8.1-3.3 8.1-7.7 0-4.2-3-7.4-7.1-7.4-.8 0-1.6.1-2.3.4 1-4.9 4.4-9 9.3-11.4L40.1 9z"
                  fill="url(#qgrad)"
                />
              </svg>
            </div>
            <div>
              <p
                data-letters
                className="px-[18px] text-[31.6px] leading-[1.3] font-normal text-pretty text-ink-black sm:px-0 sm:text-[clamp(22px,3.3vw,44px)]"
              >
                הערך האמיתי של התהליך מתחיל דווקא כשהוא נגמר: <br />
                &nbsp;&nbsp;
                <span className="text-[inherit] font-bold text-brand-teal sm:text-[clamp(24px,3.6vw,48px)]">
                  כשהכלים, השפה והתובנות הופכים לחלק מהיום-יום של הארגון,
                </span>
                <br />
                וכל טלנט הופך למכפיל כוח שמייצר אימפקט הרבה מעבר לתפקיד שלו.
              </p>
              <p className="mt-[clamp(24px,2.6vw,40px)] px-[18px] text-[22px] font-bold text-gray-body sm:px-0 sm:text-[23px]">
                - מנכ״ל בלובירד, רונן נדיר
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
