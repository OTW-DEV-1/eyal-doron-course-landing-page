import { Aurora } from '@/components/reactbits/Aurora'
import { CurvedLoop } from '@/components/reactbits/CurvedLoop'
import { Cta } from '@/components/ui'

/** Transition beat, closed by the "Action in Creativity" arc — the programme's tagline. */
export function Leap() {
  return (
    <section id="leap" className="relative overflow-hidden pt-3 pb-0">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <Aurora colors="#06B58D,#42C5C6,#6EB9F2" intensity={1.22} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_78%_at_50%_52%,rgba(246,245,243,0)_0%,rgba(246,245,243,.55)_58%,#f6f5f3_82%)]" />
        <div className="absolute inset-x-0 top-0 h-[140px] bg-[linear-gradient(180deg,#f6f5f3_0%,rgba(246,245,243,0)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[140px] bg-[linear-gradient(0deg,#f6f5f3_0%,rgba(246,245,243,0)_100%)]" />
      </div>

      <div className="relative z-[1] px-[clamp(18px,6vw,8em)] text-center">
        <h2
          data-reveal
          className="text-headline m-0 mb-[34px] pt-[0.5em] pb-[0.3em] text-[64px] leading-[1em] font-bold sm:text-[clamp(34px,6.3vw,75px)] sm:leading-[1.2]"
        >
          היכולת לעשות <br className="inline sm:hidden" />
          את הקפיצה
        </h2>
        <div data-reveal className="mt-7 mb-10">
          <Cta
            href="#contact"
            className="px-12 py-[19px] text-[22px] font-bold shadow-[0_14px_34px_rgba(66,197,198,.35)] hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(66,197,198,.5)]"
          >
            נתאים מסלול לצוות או לארגון שלכם
          </Cta>
        </div>
      </div>

      {/* The arc is drawn at a fixed size, so it is scaled up on phones to keep
          the stroke weight visually consistent. */}
      <div
        data-reveal
        className="relative z-[1] my-[-20px] py-[30px] [&_svg]:scale-[3] sm:my-0 sm:pt-14 sm:pb-0 sm:[&_svg]:scale-100"
      >
        <CurvedLoop text="Action in Creativity" fontSize={94} curve={64} speed={135} height={170} />
      </div>
    </section>
  )
}
