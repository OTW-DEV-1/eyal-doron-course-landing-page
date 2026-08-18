import { Aurora } from '@/components/reactbits/Aurora'
import { CARD } from '@/components/ui'

/** Two complementary halves of creative thinking, resolved by the dark panel below them. */
export function Remember() {
  return (
    <section id="remember" className="relative z-[2] flex items-center px-[clamp(18px,6vw,8em)]">
      <div className="w-full pt-6 pb-2">
        <div className="mx-auto max-w-[1200px] text-center">
          <h2
            data-reveal
            className="m-0 mb-0.5 text-[42.5px] leading-[1.05] font-bold text-ink-black sm:text-[clamp(34px,6.3vw,75px)]"
          >
            הכי חשוב עכשיו:
          </h2>
          <p data-reveal className="mt-[-8px] mb-0 text-[clamp(50px,7.75vw,93.5px)] leading-[1.05] font-bold">
            <span className="text-spectrum">לחשוב יצירתי</span>
          </p>
          <p data-reveal className="mt-5 text-[25px] leading-[1.25] text-pretty text-ink sm:leading-[1.3]">
            אבל הכוונה כאן היא לחשיבה יצירתית במובן המלא והעמוק של המושג.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 text-right md:grid-cols-2">
            <div data-reveal className={`${CARD} rounded-[26px] px-[30px] py-7`}>
              <div className="text-spectrum mb-2.5 w-fit text-[25px] font-bold">מצד אחד</div>
              <p className="text-[25px] leading-[1.25] text-pretty text-ink sm:leading-[1.4]">
                לדעת לכוון למטרה, להתמקד בעיקר,
                <br />
                לזהות את &quot;הנקודה המכרעת&quot; שתפתור את כל השאר.
              </p>
            </div>
            <div data-reveal className={`${CARD} rounded-[26px] px-[30px] py-7`}>
              <div className="text-spectrum mb-2.5 w-fit text-[25px] font-bold">מצד שני</div>
              <p className="text-[25px] leading-[1.25] text-pretty text-ink sm:leading-[1.4]">
                להיות גמיש, עירני למתרחש, להחליף טקטיקות,
                <br />
                להפוך חסרון ליתרון, ליזום ולחבר אפשרויות בדרך חדשה.
              </p>
            </div>
          </div>

          <div data-reveal className="run-border relative mt-8 rounded-[26px] border border-white/10 bg-dark">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
              <Aurora colors="#06B58D,#42C5C6,#6EB9F2" intensity={2.75} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(35,34,39,.5),rgba(35,34,39,.78))]" />
            </div>
            <div className="relative z-[1] px-[34px] py-8">
              <div className="text-spectrum mx-auto mb-2 w-fit text-[25px] font-bold">התוצאה:</div>
              <p className="mx-auto m-0 max-w-[900px] text-[25px] leading-[1.25] font-bold text-pretty text-white sm:leading-[1.4]">
                היכולת להמציא מחדש את המגרש ולגלות אפשרויות שאחרים טרם חשבו עליהן.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
