import { Aurora } from '@/components/reactbits/Aurora'
import { Cta, GradientIcon, ICONS } from '@/components/ui'

/**
 * The framing contrast of the whole pitch: "talents" vs "super-talents".
 *
 * Both cards sit on the dark panel; only the second gets the aurora glow and
 * the animated run-border, so the eye lands on it.
 */
export function Talents() {
  return (
    <section id="talents" className="relative z-[2] px-[14px] sm:px-4 md:px-[clamp(18px,6vw,8em)]">
      <div className="flex w-full min-h-0 flex-col justify-center py-[50px] md:min-h-screen md:pt-[30px] md:pb-[90px]">
        <div className="relative overflow-hidden rounded-[44px] border border-white/10 bg-dark px-[clamp(28px,4vw,64px)] pt-[clamp(20px,2.5vw,36px)] pb-[clamp(40px,5vw,72px)] text-on-dark shadow-[0_40px_110px_rgba(20,19,24,.22),0_12px_40px_rgba(20,19,24,.10)]">
          <div className="relative z-[2]">
            <h2
              data-reveal
              className="mb-5 pt-[.42em] pb-[.42em] text-center text-[clamp(39px,7.1vw,84px)] leading-[1em] font-bold text-white sm:mb-7 sm:pt-[0.1em] sm:pb-[0.4em] sm:text-[clamp(29px,5.35vw,64px)]"
            >
              בכל ארגון, <br className="inline sm:hidden" />
              בכל חדר ישיבות,
              <br />
              יש שני סוגים של אנשים
            </h2>

            <div className="grid grid-cols-1 items-stretch gap-7 pt-5 sm:pt-0 md:grid-cols-2">
              {/* Talents — flat, deliberately unadorned. */}
              <div
                data-reveal
                className="relative flex min-h-0 flex-col items-center justify-start rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,.045)_0%,rgba(255,255,255,0)_100%)] px-5 py-7 text-center md:min-h-[360px] md:px-10 md:py-12"
              >
                <div className="mx-auto mb-[18px] flex h-[76px] w-[76px] items-center justify-center rounded-full border border-white/[.14] bg-white/[.06]">
                  <GradientIcon id="ic-talent" paths={ICONS.star} size={40} color="#FFFFFF" />
                </div>
                <h3 className="mb-4 text-[37.5px] font-bold text-white sm:text-[clamp(30px,4vw,50px)]">טלנטים</h3>
                <p className="mx-auto max-w-[34ch] text-[22.5px] leading-[1.35] text-pretty text-white sm:text-[25px]">
                  אלה שרצים על המשימות, עובדים קשה, משקיעים מאמץ ומצטיינים במגרש המוכר – המגרש שאחרים כבר הגדירו.
                </p>
              </div>

              {/* Super-talents — glow, gradient heading, animated border. */}
              <div
                data-reveal
                className="run-border relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#2B2A30_0%,rgba(43,42,48,0)_100%)]"
              >
                <div className="relative flex h-auto flex-col items-center justify-start overflow-hidden rounded-[24px] px-5 py-7 text-center text-on-dark md:h-full md:px-10 md:py-12">
                  <Aurora
                    colors="#06B58D,#42C5C6,#6EB9F2"
                    intensity={7.1}
                    style={{ top: 0, left: 0, right: 0, height: 520, bottom: 'auto' }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(35,34,39,.32),rgba(35,34,39,.62))]" />
                  <div className="relative z-[1] mx-auto mb-[18px] flex h-[76px] w-[76px] items-center justify-center rounded-full border border-white/[.14] bg-white/[.06]">
                    <GradientIcon id="ic-super" paths={ICONS.bolt} size={44} />
                  </div>
                  <h3 className="text-spectrum relative z-[1] mb-4 text-[37.5px] font-extrabold sm:text-[clamp(30px,4vw,50px)]">
                    סופר-טלנטים
                  </h3>
                  <p className="relative z-[1] mx-auto max-w-[34ch] text-[22.5px] leading-[1.35] font-normal text-pretty text-white sm:text-[25px]">
                    אלה שעושים את כל הדברים האלה אבל עוד משהו: הם עוזרים לארגון להגדיר קטגוריה חדשה, לגלות מגרש
                    חדש, לפני המתחרים.
                    <br />
                    <strong>הם אלה שעושים את ההבדל.</strong>
                  </p>
                </div>
              </div>
            </div>

            <div data-reveal data-reveal-early className="mt-[52px] text-center">
              <Cta
                href="#contact"
                className="px-2 py-[14px] text-[clamp(15px,4.6vw,21px)] whitespace-nowrap sm:px-9 sm:py-4 sm:text-[21.3px]"
              >
                אנחנו נתאים מסלול לצוות או לארגון שלכם
              </Cta>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
