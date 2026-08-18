import { CARD } from '@/components/ui'

const CARDS = [
  {
    n: '01',
    title: 'גמישות מחשבתית רדיקלית',
    body: <>להגיב מהר לשינוי או למשבר, למצוא פתרונות חדשים, לחבר אחרת אפשרויות ומשאבים.</>,
  },
  {
    n: '02',
    title: 'לבנות את הלהקה שלי בעולם',
    body: (
      <>
        לדעת למצוא משלימי גאונות, לעבוד עם מנטורים ולהיות מנטור עבור אחרים,
        <br />
        לדעת עם מי לשתף פעולה ומתי כדי להגיע להישגי שיא.
      </>
    ),
  },
  {
    n: '03',
    title: 'דיוק עצמי',
    body: (
      <>
        להבין איך למקסם הכי הרבה מכל פגישה ומכל שבוע. לדייק את האג׳נדה האישית והמקורית שלי,
        <br />
        להגדיר את המטרות שלי ואת הנצחונות הקטנים והגדולים שלי ושל אנשיי.
      </>
    ),
  },
  {
    n: '04',
    title: 'ניהול זמן יצירתי',
    body: (
      <>
        להבין בעצם שיש המון זמן, אנחנו פשוט מבזבזים אותו בלי אחריות ולא מתמקדים במה שחשוב באמת.
        <br />
        להתחיל לעשות את זה אחרת לגמרי.
      </>
    ),
  },
]

/**
 * Sticky cards that stack as you scroll. Each card sticks 18px lower than the
 * one before it so the stack fans out; MotionProvider shrinks and blurs the
 * card underneath as the next one covers it.
 */
export function Learn() {
  const stickyTops = ['sm:top-[170px]', 'sm:top-[188px]', 'sm:top-[206px]', 'sm:top-[224px]']

  return (
    <section id="learn" className="relative z-[2] px-[14px] pt-[30px] pb-10 sm:px-[clamp(18px,6vw,8em)] sm:pt-10 sm:pb-[60px]">
      <h2
        data-reveal
        className="text-headline m-0 mb-[26px] pt-[0.2em] pb-[0.25em] text-center text-[46px] leading-[1.2] font-bold sm:mb-11 sm:text-[clamp(34px,6.3vw,75px)]"
      >
        אז מה נלמד בקורס:
      </h2>

      <div>
        {CARDS.map((c, i) => (
          <div
            key={c.n}
            data-stack-card
            className={`${CARD} sticky top-[108px] mb-5 overflow-hidden rounded-[26px] px-5 py-[26px] shadow-[0_24px_70px_rgba(20,19,24,.12)] sm:mb-7 sm:px-[clamp(24px,4vw,64px)] sm:py-[clamp(28px,3.5vw,52px)] ${stickyTops[i]}`}
          >
            <div className="relative z-[1] flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-[clamp(20px,3.5vw,56px)] sm:text-start">
              <div className="numeral-outline flex-none text-[clamp(84px,11vw,150px)] leading-none font-bold">
                {c.n}
              </div>
              <div className="text-center sm:text-start">
                <h3 className="m-0 mb-3 text-[30px] leading-[1.25] font-bold text-ink-black sm:text-[clamp(30px,3.7vw,48px)]">
                  {c.title}
                </h3>
                <p className="m-0 max-w-[62ch] text-[22.5px] leading-[1.4] font-medium text-pretty text-ink-black sm:text-[clamp(23px,2.1vw,29px)]">
                  {c.body}
                </p>
              </div>
            </div>
            {/* Soft teal bloom in the lower-left corner. */}
            <div className="pointer-events-none absolute bottom-[-130px] left-[-110px] h-[500px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(66,197,198,.28)_0%,rgba(110,185,242,.14)_45%,rgba(255,255,255,0)_74%)] opacity-[.64] blur-[6px] sm:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  )
}
