import { asset } from '@/lib/assets'
import { Aurora } from '@/components/reactbits/Aurora'
import { GradientIcon, ICONS } from '@/components/ui'

const POINTS = [
  {
    icon: { id: 'p-tools', paths: ICONS.bolt },
    body: (
      <>
        <strong>כלים מעשיים ליישום מיידי:</strong> הקורס מבוסס על שנים של עבודה בשטח עם שורה של ארגונים, חברות,
        הנהלות בכירות, יזמים סדרתיים ומנהיגים, בארץ ובמדינות רבות בעולם. תוך כדי עבודה עם חברות ישראליות,
        ישראליות-בינלאומיות וחברות בינלאומיות מובילות. הכלים מזקקים סוג של חשיבה ופעולה של אנשים שיודעת לייצר הבדל
        ויתרון על כל האחרים.
      </>
    ),
  },
  {
    icon: { id: 'p-aim', paths: ICONS.aim },
    body: 'התהליך בנוי מיחידות קטנות ומרוכזות המכילות בכל פעם כלי אחר של חשיבה ליישום מיידי מול האתגרים של המשתתפים ביום יום.',
  },
  {
    icon: { id: 'p-flex', paths: ICONS.flex },
    body: 'כל מפגש נבנה וממשיך את המפגש הקודם ומייצר רצף של שינוי "מיינדסט" – להפסיק להגיב ולהתחיל ליזום, להתהפך על המציאות, להקדים את השיבוש הבא, להתחבר לאינטואיציה שלנו ולחגוג את הידע שצברנו בארגון.',
  },
  {
    icon: { id: 'p-link', paths: ICONS.link },
    early: true,
    body: (
      <>
        <strong>תחושת חיבור ומשמעות:</strong> כל העבודה נעשית לאור מטרות-העל של הארגון והמיקוד העסקי. התהליך מלא
        השראה, תובנות וכלים – כולם נבחנים ומתורגלים מול היעדים העסקיים.
      </>
    ),
  },
]

/** Practice-first pitch, paired with a full-bleed photo that anchors the column. */
export function Practice() {
  return (
    <section id="practice" className="relative overflow-hidden pt-[30px] pb-16 sm:pt-[100px]">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Aurora colors="#06B58D,#42C5C6,#6EB9F2" intensity={2.3} />
        <img loading="lazy" decoding="async" src={asset('hero-texture.png')} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(246,245,243,0)_0%,rgba(246,245,243,.35)_40%,rgba(246,245,243,.8)_62%,rgba(246,245,243,.95)_80%,#f6f5f3_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[220px] bg-[linear-gradient(180deg,#f6f5f3_0%,rgba(246,245,243,0)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] bg-[linear-gradient(0deg,#f6f5f3_0%,rgba(246,245,243,0)_100%)]" />
      </div>

      <div className="relative z-[1] flex flex-col items-end gap-[clamp(12px,1.2vw,20px)] md:grid md:grid-cols-[0.9fr_1.45fr]">
        <div className="order-2 px-4 pb-11 md:order-none md:px-0 md:pr-[clamp(18px,6vw,8em)]">
          <h2
            data-reveal
            className="text-headline m-0 mx-0 my-2 pb-[0.15em] text-center text-[49px] leading-[1em] font-bold md:mb-9 md:text-start md:text-[clamp(34px,6.3vw,75px)]"
          >
            דגש גדול מאוד
            <br />
            על פרקטיקה
          </h2>

          <div className="flex flex-col gap-[26px]">
            {POINTS.map((p) => (
              <div
                key={p.icon.id}
                data-reveal
                {...(p.early ? { 'data-reveal-early': '' } : {})}
                className="flex flex-col items-center gap-[14px] pt-[14px] sm:flex-row sm:items-start sm:gap-[18px] sm:pt-0"
              >
                <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[linear-gradient(135deg,#06B58D,#42C5C6_55%,#6EB9F2)] shadow-[0_10px_24px_rgba(66,197,198,.3)]">
                  <GradientIcon id={p.icon.id} paths={p.icon.paths} size={28} color="#FFFFFF" />
                </div>
                <p className="m-0 px-[14px] text-center text-[22px] leading-[1.4] text-pretty text-ink sm:px-0 sm:text-start">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-first mx-2 max-h-[420px] min-h-[420px] self-stretch overflow-hidden md:order-none md:mx-0 md:max-h-none md:min-h-[720px] md:overflow-visible">
          <img loading="lazy" decoding="async"
            data-reveal
            src={asset('practice.webp')}
            alt="דגש על פרקטיקה"
            className="absolute bottom-0 left-1/2 block h-auto max-h-full w-[92%] -translate-x-1/2 object-contain object-bottom md:left-[60px] md:max-h-[calc(100%-40px)] md:w-[88%] md:translate-x-[140px] md:object-[left_bottom]"
          />
        </div>
      </div>
    </section>
  )
}
