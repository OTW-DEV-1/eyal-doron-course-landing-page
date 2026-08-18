import { CARD, Cta, GradientIcon, ICONS } from '@/components/ui'

const ITEMS = [
  {
    n: '01',
    icon: { id: 's-user', paths: ICONS.user },
    title: 'מנהלים וטלנטים',
    body: 'למנהלות ולמנהלים בכל הדרגים, או לטלנטים שרוצים להתקדם לשלב הבא בפיתוח האישי והמקצועי שלהם.',
  },
  {
    n: '02',
    icon: { id: 's-chat', paths: ICONS.chat },
    title: 'ברית של Win-Win',
    body: 'לארגונים שרוצים לייצר ברית אמיתית של "Win-Win" עם העובדים: ברית של התפתחות משותפת ולמידה מתמדת.',
  },
  {
    n: '03',
    icon: { id: 's-trend', paths: ICONS.trend },
    title: 'שדרוג המשאב האנושי',
    body: 'לארגונים שרוצים לשפר באופן דרמטי את המשאב האנושי והיצירתי בעידן טכנולוגי מלא הפתעות ותהפוכות.',
  },
  {
    n: '04',
    icon: { id: 's-star', paths: ICONS.star },
    title: 'להמציא מגרש חדש',
    body: 'לארגונים מצליחים שרוצים להמציא מגרש חדש ולהוביל את השוק. לא לחכות לשיבוש הבא, ליצור את הפתרון החדש לפני שכל האחרים זיהו אותו.',
  },
]

/** Who the programme is for — four numbered audience cards. */
export function Stations() {
  return (
    <section id="stations" className="px-4 py-[70px] sm:px-[clamp(18px,6vw,8em)] sm:py-16">
      <div className="w-full">
        <h2
          data-reveal
          className="text-headline mb-16 text-center text-[42.5px] leading-[1.3] font-bold sm:text-[clamp(34px,6.3vw,75px)]"
        >
          למי זה מתאים?
        </h2>

        <div className="relative w-full pb-0">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-stretch gap-[26px]">
            {ITEMS.map((it) => (
              <div
                key={it.n}
                data-reveal
                className={`${CARD} relative flex min-h-[329px] flex-col overflow-hidden rounded-[26px] px-[clamp(18px,2.6vw,40px)] pt-0 pb-[clamp(24px,2.6vw,34px)]`}
              >
                <div className="relative flex h-[110px] flex-none items-start justify-between pt-2.5 sm:h-[160px] sm:items-center sm:pt-0">
                  <div className="numeral-outline-soft -mt-[14px] text-[131px] leading-none font-bold sm:mt-0 sm:text-[clamp(84px,11vw,150px)]">
                    {it.n}
                  </div>
                  <div className="absolute top-6 left-[calc(24px-clamp(18px,2.6vw,40px))] flex h-[58px] w-[58px] items-center justify-center">
                    <div className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#06B58D,#42C5C6_55%,#6EB9F2)]">
                      <GradientIcon id={it.icon.id} paths={it.icon.paths} size={30} color="#FFFFFF" />
                    </div>
                  </div>
                </div>

                <div className="relative z-[1] mt-2 text-start">
                  <h4 className="mb-3 text-[27.5px] leading-[1.25] font-bold whitespace-nowrap text-ink-black sm:text-[clamp(19px,1.45vw,28px)]">
                    {it.title}
                  </h4>
                  <p className="text-[22px] leading-[1.4] font-medium text-pretty text-gray-body sm:text-[21px]">
                    {it.body}
                  </p>
                </div>

                <div className="pointer-events-none absolute bottom-[-154px] left-[-132px] h-[374px] w-[462px] rounded-full bg-[radial-gradient(circle,rgba(66,197,198,.141)_0%,rgba(110,185,242,.07)_45%,rgba(255,255,255,0)_74%)] blur-[6px]" />
              </div>
            ))}
          </div>
        </div>

        <div data-reveal className="mt-14 text-center">
          <Cta
            href="#contact"
            className="px-12 py-[19px] text-[22px] font-bold shadow-[0_14px_34px_rgba(66,197,198,.35)] hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(66,197,198,.5)]"
          >
            רוצים לשמוע עוד!
          </Cta>
          <p className="mt-[14px] text-[23px] text-gray-body">שיחה קצרה, בלי התחייבות.</p>
        </div>
      </div>
    </section>
  )
}
