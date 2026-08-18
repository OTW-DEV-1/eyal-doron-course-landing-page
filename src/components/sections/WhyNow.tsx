import { asset } from '@/lib/assets'
import { Aurora } from '@/components/reactbits/Aurora'
import { Cta } from '@/components/ui'

/**
 * The "why now" argument, sitting on a full-bleed aurora + texture bed that is
 * feathered to the page colour on all four edges so it reads as a glow rather
 * than a band.
 */
export function WhyNow() {
  return (
    <section id="logos" className="relative z-[1] overflow-hidden pt-10 pb-4 sm:pt-0 sm:pb-[52px]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Aurora colors="#06B58D,#42C5C6,#6EB9F2" intensity={7.56} />
        <img src={asset('hero-texture-2.png')} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,245,243,0)_0%,rgba(246,245,243,0)_18%,rgba(246,245,243,.42)_32%,rgba(246,245,243,.82)_42%,rgba(246,245,243,.82)_58%,rgba(246,245,243,.42)_68%,rgba(246,245,243,0)_82%,rgba(246,245,243,0)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[300px] bg-[linear-gradient(180deg,#f6f5f3_0%,rgba(246,245,243,.8)_35%,rgba(246,245,243,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[300px] bg-[linear-gradient(0deg,#f6f5f3_0%,rgba(246,245,243,.8)_35%,rgba(246,245,243,0)_100%)]" />
      </div>

      <div id="why-now" className="relative z-[1] w-full">
        <div className="mx-auto max-w-[1100px] px-[clamp(18px,6vw,8em)] text-center">
          <h2
            data-reveal
            className="text-headline m-0 mb-6 text-[42.5px] leading-[1.2] font-bold sm:text-[clamp(34px,6.3vw,75px)]"
          >
            מ&quot;טלנט&quot; <br className="inline sm:hidden" />
            <span className="text-spectrum">ל&quot;סופר-טלנט&quot;</span>
          </h2>

          <p
            data-reveal
            className="mx-auto max-w-[900px] text-[25px] leading-[1.25] font-normal text-pretty text-ink sm:leading-[1.4]"
          >
            תהליך דיגיטלי היברידי מיוחד לארגונים, שמפתח את היכולת לחשוב אחרת ומעניק סט של כלי עבודה לחיים בעולם שלא
            מפסיק לרוץ.
          </p>
          <p
            data-reveal
            className="mx-auto mt-[18px] max-w-[900px] text-[25px] leading-[1.25] font-normal text-pretty text-ink sm:leading-[1.4]"
          >
            תהליך חוויתי ושיטתי שמזמין את משתתפיו לעשות המעבר: <strong>מטלנטים ל-סופר-טלנטים</strong>.
          </p>

          <h3
            data-reveal
            className="text-headline mt-[25px] mb-[22px] pt-0 text-[clamp(26px,4.7vw,56px)] font-bold"
          >
            למה עכשיו?
          </h3>

          <p data-reveal className="text-[25px] leading-[1.25] text-pretty text-ink sm:leading-[1.4]">
            עולם העבודה עובר שינוי מטלטל שאנחנו רק בתחילתו – זה ברור כבר (כמעט) לכולם.
          </p>
          <p data-reveal className="mt-[18px] text-[25px] leading-[1.25] text-pretty text-ink sm:leading-[1.4]">
            מהפכת ה-AI רק החלה. <br />
            חשוב ללמוד פיצ&apos;רים חדשים של קלוד, אבל זה לא באמת יכין אותנו למה שעומד להתרחש בגדול ומהר.
            <br />
            הכל בסוף חוזר לשאלה: מה יש לנו להגיד ואיך אנחנו חושבים.
          </p>
          <p data-reveal className="mt-[18px] text-[25px] leading-[1.25] text-pretty text-ink sm:leading-[1.4]">
            עלינו להגיב ולאמץ שפה חדשה וגישה חדשה לחיים בשגרה של משברים.
          </p>
          <p
            data-reveal
            className="mt-[18px] pb-[1em] text-[25px] leading-[1.25] font-bold text-pretty text-ink sm:leading-[1.4]"
          >
            התהליך עוזר לאנשים לעשות את המעבר המחשבתי הזה בצורה מוחשית, מעשית ומעצימה.
          </p>

          <div data-reveal data-reveal-early className="mt-6">
            <Cta href="#contact" className="block w-full px-12 py-[14px] text-[23.8px] sm:inline-block sm:w-auto sm:py-[19px]">
              גם אנחנו רוצים להפוך לסופר-טלנטים!
            </Cta>
            <div className="h-4" />
          </div>
        </div>
      </div>
    </section>
  )
}
