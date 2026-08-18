'use client'

import { useState, type FormEvent } from 'react'
import { Aurora } from '@/components/reactbits/Aurora'

const FIELD =
  'rounded-[14px] border border-white/[.14] bg-white/[.06] px-[18px] py-4 text-[18px] text-on-dark outline-none placeholder:text-white placeholder:opacity-100 focus:border-brand-teal sm:text-[25.6px]'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** Lead form. Posts to /api/contact, which relays through Resend. */
export function Contact() {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending' || status === 'sent') return
    setStatus('sending')

    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const label =
    status === 'sent' ? 'נשלח ✓' : status === 'sending' ? 'שולח…' : status === 'error' ? 'נסו שוב' : 'שליחת פרטים'

  return (
    <section id="contact" className="px-3 py-6 sm:px-[clamp(16px,4.5vw,5em)] sm:py-10">
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-dark px-4 py-[60px] text-on-dark sm:px-7 sm:py-20">
        <Aurora colors="#06B58D,#42C5C6,#6EB9F2" intensity={0.64} />

        <div className="relative z-[2] mx-auto max-w-[840px] text-center">
          <p data-reveal className="mb-[14px] text-[23.1px] font-semibold text-on-dark-muted">
            טופס השארת פרטים
          </p>
          <h2
            data-reveal
            className="mb-[18px] text-[49px] leading-[.8em] font-bold whitespace-normal sm:text-[clamp(30px,6.1vw,82px)] sm:leading-[1.3] sm:whitespace-nowrap"
          >
            השאירו פרטים <br className="block sm:hidden" />
            <span className="text-spectrum-rev">ונחזור אליכם</span>
          </h2>
          <p
            data-reveal
            className="mx-auto mb-10 max-w-[900px] text-[24px] leading-[1.3] text-pretty text-white sm:text-[28.2px]"
          >
            רוצים לראות איך זה עובד על הטלנטים שלכם? <br />
            &nbsp;השאירו פרטים ונחזור אליכם עם הצעה מותאמת, ללא התחייבות.
          </p>

          <form
            data-reveal
            onSubmit={onSubmit}
            className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[14px] text-right"
          >
            <input required name="fullname" placeholder="שם מלא" autoComplete="name" className={FIELD} />
            <input name="org" placeholder="ארגון" autoComplete="organization" className={FIELD} />
            <input name="role" placeholder="תפקיד" autoComplete="organization-title" className={FIELD} />
            <input type="email" name="email" placeholder="אימייל" autoComplete="email" className={FIELD} />
            <input type="tel" name="phone" placeholder="טלפון" dir="rtl" autoComplete="tel" className={`${FIELD} text-right`} />
            <input type="number" name="participants" placeholder="מספר משתתפים" min={1} className={FIELD} />

            {/* Honeypot. Hidden from users and from assistive tech; bots fill it in. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <div className="col-span-full mt-3 block sm:flex sm:justify-center">
              <button
                type="submit"
                data-magnet
                disabled={status === 'sending' || status === 'sent'}
                className="block w-full cursor-pointer rounded-full border-[1.5px] border-transparent bg-[linear-gradient(100deg,#06B58D,#42C5C6_50%,#6EB9F2)] px-5 py-[14px] text-[20.7px] font-semibold text-white transition-[filter,transform] duration-300 hover:brightness-[1.12] disabled:cursor-default sm:w-auto sm:px-11 sm:py-[15px] sm:text-[27.3px]"
              >
                {label}
              </button>
            </div>

            <p aria-live="polite" className="col-span-full min-h-6 text-center text-[18px]">
              {status === 'sent' ? 'תודה! קיבלנו את הפרטים ונחזור אליכם בהקדם.' : null}
              {status === 'error' ? 'משהו השתבש בשליחה. אפשר לנסות שוב בעוד רגע.' : null}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
