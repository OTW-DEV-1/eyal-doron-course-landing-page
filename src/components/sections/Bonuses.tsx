import { Fragment } from 'react'
import { asset } from '@/lib/assets'
import { Aurora } from '@/components/reactbits/Aurora'
import { CARD, Cta, GradientIcon, ICONS } from '@/components/ui'

const BONUSES = [
  { id: 'bo-book', paths: ICONS.book, title: 'רשימה של ספרים', body: 'שכל אחד חייב להכיר', from: 'right' },
  { id: 'bo-map', paths: ICONS.map, title: 'מפת הקשרים', body: 'שרטוט של "מפת הקשרים שלי בעולם"', from: 'left' },
  { id: 'bo-doc', paths: ICONS.doc, title: 'מקורות ומאמרים', body: 'הפניה למקורות ולמאמרים נבחרים', from: 'right' },
  { id: 'bo-people', paths: ICONS.people, title: 'קהילה של ידע והשראה', body: 'הצטרפות לקהילה של ידע והשראה', from: 'left' },
  { id: 'bo-trophy', paths: ICONS.trophy, title: 'נצחונות מהירים', body: 'תוצאות קטנות ומיידיות כבר מהשבוע הראשון', from: 'right', early: true },
  { id: 'bo-globe', paths: ICONS.globe, title: 'דוגמאות מהעולם', body: 'קייסים אמיתיים מארגונים מובילים בעולם', from: 'left', early: true },
] as const

/** Horizontal tracer with two light pulses running in opposite directions. */
function TracerH({ top }: { top: string }) {
  return (
    <div
      aria-hidden
      className="absolute left-[calc(50%-50vw)] z-0 h-px w-screen overflow-hidden bg-[rgba(66,197,198,.42)]"
      style={{ top }}
    >
      <div className="absolute top-0 h-px w-[18%] animate-[pulseR_3.4s_cubic-bezier(.4,0,.6,1)_infinite] rounded-full bg-[linear-gradient(90deg,rgba(66,197,198,0),#06B58D_35%,#42C5C6_50%,#6EB9F2_65%,rgba(110,185,242,0))] shadow-[0_0_18px_rgba(66,197,198,1),0_0_40px_rgba(66,197,198,.75)]" />
      <div className="absolute top-0 h-px w-[18%] animate-[pulseL_3.4s_cubic-bezier(.4,0,.6,1)_infinite] rounded-full bg-[linear-gradient(90deg,rgba(66,197,198,0),#06B58D_35%,#42C5C6_50%,#6EB9F2_65%,rgba(110,185,242,0))] shadow-[0_0_18px_rgba(66,197,198,1),0_0_40px_rgba(66,197,198,.75)]" />
    </div>
  )
}

function TracerV({ left }: { left: string }) {
  return (
    <div
      aria-hidden
      className="absolute inset-y-0 z-0 w-px overflow-hidden bg-[rgba(110,185,242,.40)]"
      style={{ left }}
    >
      <div className="absolute left-0 h-[20%] w-px animate-[pulseD_3.4s_cubic-bezier(.4,0,.6,1)_infinite] rounded-full bg-[linear-gradient(180deg,rgba(6,181,141,0),#06B58D_35%,#42C5C6_50%,#6EB9F2_65%,rgba(110,185,242,0))] shadow-[0_0_18px_rgba(6,181,141,1),0_0_40px_rgba(6,181,141,.75)]" />
      <div className="absolute left-0 h-[20%] w-px animate-[pulseU_3.4s_cubic-bezier(.4,0,.6,1)_infinite] rounded-full bg-[linear-gradient(180deg,rgba(6,181,141,0),#06B58D_35%,#42C5C6_50%,#6EB9F2_65%,rgba(110,185,242,0))] shadow-[0_0_18px_rgba(6,181,141,1),0_0_40px_rgba(6,181,141,.75)]" />
    </div>
  )
}

/**
 * Extras included with the programme.
 *
 * Desktop is a three-column grid with the brand tile spanning all rows in the
 * middle and a circuit-board tracer animation behind it. Phones drop the tile
 * and tracers entirely — they read as noise at that width — leaving a plain
 * stack of cards.
 */
export function Bonuses() {
  return (
    <section id="bonuses" className="relative px-[clamp(18px,6vw,8em)] pt-6 pb-16">
      <div data-reveal className="relative mx-auto mt-2 max-w-[1280px] sm:mt-12">
        <div className="hidden sm:block">
          <Aurora
            colors="#06B58D,#42C5C6,#6EB9F2"
            intensity={0.92}
            fadeEdges
            style={{ top: '-8%', bottom: '-8%', left: '50%', transform: 'translateX(-50%)', width: '100vw', height: 'auto', zIndex: 0 }}
          />
        </div>
        <div className="pointer-events-none absolute inset-y-[-8%] left-1/2 z-0 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,#f6f5f3_0%,rgba(246,245,243,.42)_20%,rgba(246,245,243,.2)_50%,rgba(246,245,243,.42)_80%,#f6f5f3_100%)] opacity-50 sm:opacity-100" />

        <h3 className="text-headline relative z-[1] mb-2.5 pt-0 text-center text-[42.5px] leading-[1.3] font-bold sm:text-[clamp(34px,6.3vw,75px)]">
          מה עוד מקבלים
        </h3>
        <p className="relative z-[1] mb-[30px] text-center text-[clamp(21px,2.2vw,26px)] font-semibold text-gray-body sm:mb-14">
          השראה ובונוסים לאורך כל הדרך:
        </p>

        <div className="relative grid grid-cols-1 items-stretch gap-2.5 sm:grid-cols-[1fr_minmax(300px,380px)_1fr] sm:grid-rows-3 sm:gap-x-11 sm:gap-y-[26px]">
          <div className="hidden sm:contents">
            {['calc(16% - 14px)', 'calc(25% - 14px)', 'calc(34% - 14px)', 'calc(66% + 14px)', 'calc(75% + 14px)', 'calc(84% + 14px)'].map(
              (t) => (
                <TracerH key={t} top={t} />
              ),
            )}
            {['7%', '13%', '87%', '93%'].map((l) => (
              <TracerV key={l} left={l} />
            ))}
          </div>

          {BONUSES.map((b, i) => (
            <Fragment key={b.id}>
              <div
                data-reveal
                data-reveal-x={b.from}
                {...('early' in b && b.early ? { 'data-reveal-early': '' } : {})}
                className={`${CARD} relative z-[1] flex flex-col items-center justify-center gap-2.5 rounded-[30px] px-5 py-[22px] text-center shadow-[0_12px_34px_rgba(20,19,24,.07)] transition-[transform,box-shadow] duration-[350ms] hover:-translate-y-[5px] hover:shadow-[0_22px_48px_rgba(20,19,24,.14)] sm:px-10 sm:py-[38px]`}
              >
                <div className="flex h-[60px] items-center justify-center sm:h-auto">
                  <GradientIcon id={b.id} paths={b.paths} size={42} />
                </div>
                <h4 className="text-[25.5px] leading-[1.3] font-bold">{b.title}</h4>
                <p className="text-[21.5px] leading-[1.4] text-pretty text-gray-body">{b.body}</p>
              </div>

              {/* The brand tile is placed after the first card so grid
                  auto-placement gives it the centre column. */}
              {i === 0 ? (
                <div
                  data-reveal
                  data-reveal-mode="scale"
                  className="relative z-[1] hidden min-h-[480px] items-center justify-center sm:row-span-3 sm:flex"
                >
                  <div className="flex h-[280px] w-[280px] items-center justify-center rounded-[44px] bg-[linear-gradient(135deg,#06B58D,#42C5C6_50%,#6EB9F2)] shadow-[0_14px_36px_rgba(6,181,141,.28)]">
                    <img src={asset('logo-white.png')} alt="מטלנט לסופר-טלנט" className="block h-auto w-[78%]" />
                  </div>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>

      <div data-reveal data-reveal-early className="mt-[52px] text-center">
        <Cta
          href="#contact"
          className="block w-full px-10 py-[14px] text-[23.8px] sm:inline-block sm:w-auto sm:py-[17px] sm:text-[21.3px]"
        >
          רוצים להפוך לסופר-טלנטים? <br className="block sm:hidden" />
          דברו איתנו ונקבע שיחת הדגמה
        </Cta>
      </div>
    </section>
  )
}
