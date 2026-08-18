import { asset } from '@/lib/assets'
import { Aurora } from '@/components/reactbits/Aurora'
import { Cta } from '@/components/ui'

/** Founder bio. The portrait bleeds off the right edge on desktop. */
export function About() {
  return (
    <section id="about" className="relative overflow-hidden px-[18px] py-[60px] sm:py-0 sm:pt-[30px] sm:pr-0 sm:pb-10 sm:pl-[clamp(18px,6vw,8em)]">
      <div className="hidden sm:block">
        <Aurora
          colors="#06B58D,#42C5C6,#6EB9F2"
          intensity={1.5}
          style={{ top: 0, bottom: 0, right: 0, left: 'auto', width: '66%', height: 'auto' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(270deg,rgba(246,245,243,0)_0%,rgba(246,245,243,0)_34%,rgba(246,245,243,.6)_52%,rgba(246,245,243,.92)_68%,#f6f5f3_82%,#f6f5f3_100%)]" />
      </div>
      {/* Phones get a pair of soft blooms instead of the full aurora bed. */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_55%_32%_at_12%_34%,rgba(66,197,198,.38)_0%,rgba(110,185,242,.2)_55%,transparent_80%),radial-gradient(ellipse_55%_32%_at_88%_30%,rgba(110,185,242,.38)_0%,rgba(66,197,198,.2)_55%,transparent_80%)] opacity-50 [mask-image:linear-gradient(180deg,#000_0%,#000_40%,rgba(0,0,0,.3)_55%,rgba(0,0,0,.12)_70%,rgba(0,0,0,.12)_100%)] sm:hidden" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[170px] bg-[linear-gradient(180deg,rgba(246,245,243,.92)_12%,rgba(246,245,243,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[200px] bg-[linear-gradient(180deg,rgba(246,245,243,0)_0%,rgba(246,245,243,.95)_88%)]" />

      <div className="relative z-[1] grid w-full grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-center gap-14">
        <div
          data-reveal
          className="relative z-[1] -mx-[18px] flex h-auto min-h-0 w-[calc(100%+36px)] items-end justify-center self-stretch sm:mx-0 sm:w-full sm:justify-end sm:min-h-[clamp(560px,64vw,900px)]"
        >
          <img loading="lazy" decoding="async"
            src={asset('eyal.webp')}
            alt="ד״ר אייל דורון"
            className="static z-[1] block h-auto w-full max-w-none sm:absolute sm:right-0 sm:bottom-0 sm:w-[125%] sm:max-w-[775px]"
          />
        </div>

        <div data-reveal className="relative z-[30]">
          <h2 className="text-headline -mt-[14px] mb-[13px] text-[42.5px] leading-[1.3] font-bold sm:mt-0 sm:mb-[26px] sm:text-[clamp(34px,6.3vw,75px)]">
            ד״ר אייל דורון
          </h2>
          <p className="text-[22.5px] leading-[1.3] text-pretty text-ink-black sm:text-[24.5px]">
            חוקר ומפתח חשיבה יצירתית, מומחה לאסטרטגיה יצירתית בעולם חסר ודאות.{' '}
            <br className="hidden sm:inline" />
            ד&quot;ר דורון עומד בראש התוכנית Action in Creativity ב-Fore של אוניברסיטת רייכמן.{' '}
            <br className="hidden sm:inline" />
            דורון ייסד את שיטת SEISEI לפיתוח חשיבה יצירתיות בקרב ילדים בוני-נוער{' '}
            <br className="hidden sm:inline" />
            שהיתה גם נושא הפוסט-דוקרטורט שלו.
          </p>
          <p className="mt-4 text-[22.5px] leading-[1.3] text-pretty text-ink-black sm:text-[24.5px]">
            השיטה נבחרה על-ידי ארגון HundrED בפינלנד כאחת <br className="hidden sm:inline" />
            ממאה שיטות החינוך החדשניות בעולם.
          </p>
          <p className="mt-4 text-[22.5px] leading-[1.3] text-pretty text-ink-black sm:text-[24.5px]">
            דורון עובד באופן שוטף עם הנהלות בכירות, מייסדים וארגונים גדולים בארץ ובעולם.{' '}
            <br className="hidden sm:inline" />
            הוא מחברם של ספרים רבי-מכר ויוצר של סדרות מדע פופולרי לטלוויזיה.{' '}
            <br className="hidden sm:inline" />
            העשייה הבינתחומית הזאת חוברת יחד בקורס הזה לפורמט חוויתי וסוחף.
          </p>
          <div className="mt-[34px] pt-[1em]">
            <Cta
              href="#contact"
              className="block w-full px-5 py-[14px] text-center text-[20.4px] sm:inline-block sm:w-auto sm:px-[34px] sm:py-[15px]"
            >
              הפכו לסופר-טלנטים!
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
