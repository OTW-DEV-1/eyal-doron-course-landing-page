import { Aurora } from '@/components/reactbits/Aurora'
import { Cta } from '@/components/ui'

const STEPS: React.ReactNode[] = [
  <>
    התהליך בנוי משתי יחידות לימוד מרכזיות:
    <br />
    דיוק עצמי וגמישות מחשבתית – ניגודים משלימים שיוצרים יחד <strong>חשיבה יצירתית מרמה אחרת.</strong>
  </>,
  'בכל יום נחשפים המשתתפים לכלי חדש ליישום מול אתגרים שוטפים שלהם באמצעות סרטונים יומיים מושקעים וסוחפים, עד עשר דקות, לא יותר.',
  'קבוצת ווטסאפ מיוחדת משותפת לכל הקבוצה מעדכנת ומנהלת דיאלוג עם המשתתפים.',
  'מנחה מלווה עוקב אחרי ההתקדמות וההפנמה של המשתתפים באופן אישי.',
  'ביקורים בשטח של מנחים מלווים ואלמנטים עיצוביים במרחב העבודה שעוזרים לתהליך ההטמעה.',
  'וובינרים מיוחדים מוקדשים לבירור שאלות וקשיים שהתעוררו.',
]

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div data-reveal className="rounded-[18px] border border-white/10 bg-white/[.05] p-[26px] backdrop-blur-[6px]">
      <p className="text-[22.5px] leading-[1.3] text-pretty text-white sm:text-[26px]">{children}</p>
    </div>
  )
}

/**
 * Alternating timeline. The spine and dots are painted by MotionProvider as the
 * section scrolls; here we only lay out the rails.
 *
 * On phones the whole thing collapses to a single right-hand rail: the dot moves
 * to a narrow first column and every card lands in the second, regardless of
 * which side it occupies on desktop.
 */
export function Process() {
  return (
    <section id="process" className="px-3 py-2 sm:px-[clamp(16px,4.5vw,5em)] sm:py-10">
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-dark px-[14px] py-[26px] text-on-dark sm:px-7 sm:pt-[50px] sm:pb-[100px]">
        <Aurora colors="#06B58D,#42C5C6,#6EB9F2" intensity={0.86} />

        <div className="relative z-[2] w-full">
          <h2
            data-reveal
            className="mb-[26px] text-center text-[53px] leading-[1.3] font-bold sm:mb-14 sm:text-[clamp(34px,6.3vw,75px)]"
          >
            מבנה התהליך
          </h2>

          <div data-tl-wrap className="relative mx-auto max-w-[980px] py-2.5 pb-0 sm:pb-2.5">
            {/* Spine track + the progress fill that rides on top of it. */}
            <div
              data-tl-bg
              className="absolute inset-y-0 right-[14px] w-[3px] translate-x-1/2 rounded-full bg-white/10 md:right-auto md:left-1/2 md:-translate-x-1/2"
            />
            <div
              data-tl-line
              className="absolute top-0 right-[14px] h-0 w-[3px] translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#6EB9F2,#42C5C6,#06B58D)] shadow-[0_0_14px_rgba(66,197,198,.55)] md:right-auto md:left-1/2 md:-translate-x-1/2"
            />

            {STEPS.map((step, i) => {
              const onRight = i % 2 === 0
              return (
                <div
                  key={i}
                  className={`grid grid-cols-[28px_1fr] items-center gap-x-[18px] md:grid-cols-[1fr_56px_1fr] ${
                    i === STEPS.length - 1 ? 'mb-0' : 'mb-[34px]'
                  }`}
                >
                  <div className="col-start-2 row-start-1 md:col-start-auto md:row-start-auto">
                    {onRight ? <Card>{step}</Card> : null}
                  </div>
                  <div className="col-start-1 row-start-1 flex items-center justify-center md:col-start-auto md:row-start-auto">
                    <div
                      data-tl-dot
                      className="h-5 w-5 rounded-full bg-dark-dot transition-[background,box-shadow,transform] duration-[400ms]"
                    />
                  </div>
                  <div className="col-start-2 row-start-1 md:col-start-auto md:row-start-auto">
                    {onRight ? null : <Card>{step}</Card>}
                  </div>
                </div>
              )
            })}
          </div>

          <div data-reveal className="mt-[26px] text-center sm:mt-16">
            <Cta href="#contact" className="px-[38px] py-[15px] text-[20.6px]">
              רוצים לשמוע עוד!
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
