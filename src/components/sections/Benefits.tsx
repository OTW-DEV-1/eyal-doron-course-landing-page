import { CARD, GradientIcon, ICONS } from '@/components/ui'

type Benefit = {
  span: string
  icon: { id: string; paths: (typeof ICONS)[keyof typeof ICONS]; size: number }
  title: string
  body: React.ReactNode
}

const BENEFITS: Benefit[] = [
  {
    span: 'md:col-span-4',
    icon: { id: 'b-spark', paths: ICONS.spark, size: 130 },
    title: 'מיומנויות קריטיות בעידן ה-AI',
    body: (
      <>
        חשיבה יצירתית, אישית ומקורית, לצד היכולת להתמקד.
        <br />
        להבחין בעיקר ולחתור למטרה בעולם מלא רעשים והפרעות.
      </>
    ),
  },
  {
    span: 'md:col-span-2',
    icon: { id: 'b-quest', paths: ICONS.quest, size: 130 },
    title: 'שאלות חדשות, אפשרויות חדשות',
    body: 'יכולת לשאול שאלות חדשות ולחפש אפשרויות חדשות. להשתמש במשאבים, בניסיון ובידע של הארגון ולבנות מהם את הצעדים הבאים.',
  },
  {
    span: 'md:col-span-2',
    icon: { id: 'b-link', paths: ICONS.link, size: 130 },
    title: 'חיבור למטרות הארגון',
    body: 'חיבור טבעי ועמוק יותר של המשתתפים למטרות של הארגון ולהשפעה שלו על המציאות.',
  },
  {
    span: 'md:col-span-4',
    icon: { id: 'b-chat', paths: ICONS.chatBig, size: 130 },
    title: 'שפה ארגונית משותפת',
    body: (
      <>
        המשתתפים מדברים על מושגי המפתח ועל הכלים החדשים
        <br />
        במסדרונות ובפגישות העבודה שלהם.
      </>
    ),
  },
  {
    span: 'md:col-span-2',
    icon: { id: 'b-home', paths: ICONS.home, size: 130 },
    title: 'ערך שמלווה גם הביתה',
    body: 'דרך החשיבה והכלים מלווה את המשתתפים גם למרחבי חיים אחרים שלהם – הם מקבלים תחושת ערך והשקעה בהם מצד הארגון ומתחברים באופן עמוק יותר ואישי יותר לתהליך.',
  },
  {
    span: 'md:col-span-2',
    icon: { id: 'b-flex', paths: ICONS.flex, size: 150 },
    title: 'לגשת לאתגרים אחרת',
    body: 'לדעת איך לגשת לאתגרים מכיוונים אחרים ובלתי-צפויים ולהוליד תשובות חדשות.',
  },
  {
    span: 'md:col-span-2',
    icon: { id: 'b-clock', paths: ICONS.clockBig, size: 130 },
    title: 'ניהול זמן אמיתי',
    body: 'לדעת לנהל את הזמן ולהספיק הרבה יותר. להפסיק עם התחושה המתמדת של "אין לי זמן" ולקחת אחריות על הזמן היקר של חיינו.',
  },
  {
    span: 'md:col-span-3',
    icon: { id: 'b-aim', paths: ICONS.aim, size: 150 },
    title: 'דיוק עצמי',
    body: 'להגיע לרמות חדשות של דיוק עצמי בתוך אלפי משימות והפרעות.',
  },
  {
    span: 'md:col-span-3',
    icon: { id: 'b-star', paths: ICONS.star, size: 130 },
    title: 'הערך המיוחד שלי',
    body: 'למצוא את הערך המיוחד שלי שרק אני יודע להביא איתי לכל חדר שאני נכנס אליו.',
  },
]

/**
 * Bento grid of outcomes. Cards vary in width across a 6-column track on
 * desktop and stack to a single column on phones.
 */
export function Benefits() {
  return (
    <section id="benefits" className="relative px-4 pb-[70px] sm:px-[clamp(28px,9.4vw,12.5em)] sm:pb-16">
      <div className="w-full">
        <h2
          data-reveal
          className="text-headline mb-[52px] pt-[1.2em] text-center text-[42.5px] leading-[1.15em] font-bold sm:pt-12 sm:text-[clamp(34px,6.3vw,75px)]"
        >
          <span className="text-spectrum">הערך של הקורס,</span>
          <br />
          מה מקבלים המשתתפים שעוברים אותו:
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-[22px]">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              data-reveal
              className={`${CARD} relative flex min-h-[230px] flex-col overflow-hidden rounded-[26px] px-9 pt-10 pb-[90px] transition-transform duration-[350ms] hover:-translate-y-1.5 ${b.span}`}
            >
              {/* Oversized watermark icon bleeding off the lower-left corner. */}
              <div className="pointer-events-none absolute bottom-[-30px] left-[-16px] rotate-[-8deg] opacity-45">
                <GradientIcon id={b.icon.id} paths={b.icon.paths} size={b.icon.size} strokeWidth="thin" />
              </div>
              <h3 className="relative z-[1] mb-3 text-[27.5px] font-bold sm:text-[31px]">{b.title}</h3>
              <p className="relative z-[1] max-w-full text-[22px] leading-[1.35] text-pretty text-gray-body sm:text-[24.5px]">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
