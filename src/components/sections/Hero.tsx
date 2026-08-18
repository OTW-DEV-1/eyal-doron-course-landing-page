import { asset } from '@/lib/assets'
import { Aurora } from '@/components/reactbits/Aurora'
import { Cta } from '@/components/ui'

/**
 * Full-height opener.
 *
 * Desktop layers an aurora canvas + a photographic texture behind the copy,
 * scrimmed left-to-right so the right column stays readable. Below 640px both
 * are dropped for a single animated gradient wash — the texture is a large
 * image that carries no meaning at phone size.
 */
export function Hero() {
  return (
    <section className="relative z-[5] flex min-h-0 flex-col justify-start overflow-hidden px-4 pt-[84px] pb-16 sm:min-h-screen sm:pt-[110px] sm:pr-[clamp(16px,4.5vw,5em)] sm:pb-[30px] sm:pl-0">
      {/* Mobile-only gradient wash, masked to an ellipse behind the headline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 animate-[heroGradShift_9s_ease-in-out_infinite_alternate] bg-[linear-gradient(90deg,#06B58D_0%,#42C5C6_25%,#6EB9F2_50%,#42C5C6_75%,#06B58D_100%)] bg-[length:300%_100%] opacity-60 [mask-image:radial-gradient(ellipse_100%_46%_at_50%_68%,#000_25%,rgba(0,0,0,.55)_58%,transparent_84%)] sm:hidden"
      />

      <div className="hidden sm:block">
        <Aurora colors="#06B58D,#42C5C6,#6EB9F2" intensity={1.92} style={{ top: 0, bottom: 0, left: 0, width: '70%', height: 'auto' }} />
        <div className="pointer-events-none absolute inset-0 z-[1]">
          {/* Drawn twice, exactly as the prototype does — the second pass doubles
              the texture's density. One copy alone reads washed out. */}
          <img src={asset('hero-texture.webp')} alt="" className="absolute inset-y-0 left-0 h-full w-[52%] object-cover" />
          <img src={asset('hero-texture.webp')} alt="" className="absolute inset-y-0 left-0 h-full w-[52%] object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,245,242,0)_0%,rgba(246,245,242,0)_46%,rgba(246,245,242,.62)_60%,rgba(246,245,242,.9)_72%,#F6F5F2_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[150px] bg-[linear-gradient(180deg,rgba(246,245,242,.85)_20%,rgba(246,245,242,0)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[240px] bg-[linear-gradient(180deg,rgba(246,245,243,0)_0%,rgba(246,245,243,.96)_70%,#f6f5f3_100%)]" />
        </div>
      </div>

      {/* Slowly counter-rotating seal. */}
      <img
        src={asset('circle-badge.webp')}
        alt="תהליך מיוחד לארגונים"
        className="pointer-events-none absolute top-[41%] left-[14px] z-[4] h-auto w-[150px] animate-[spinSlow_12s_linear_infinite] sm:top-[34%] sm:left-[clamp(135px,14.4vw,288px)] sm:w-[clamp(135px,15.3vw,297px)]"
      />

      <div className="relative z-[2] grid w-full grid-cols-1 items-start gap-[18px] pt-5 sm:gap-7 md:grid-cols-[1.05fr_.95fr] md:gap-14 md:pt-[12vh]">
        <div className="mt-0 flex flex-col items-center text-center sm:items-start sm:text-right md:-mt-[5vh]">
          <h1
            data-reveal
            className="text-headline mt-0 pb-[.06em] text-[69px] leading-[.8em] font-bold sm:text-[clamp(40px,7.7vw,97px)] sm:leading-[1.3]"
          >
            <span className="whitespace-nowrap">מטלנט </span>
            <br className="block sm:hidden" />
            <span className="text-spectrum whitespace-nowrap">לסופר-טלנט</span>
          </h1>

          <p
            data-reveal
            className="mt-[22px] max-w-[735px] text-[24px] leading-[1.3] font-normal text-pretty text-ink sm:text-[clamp(19px,3vw,31.5px)]"
          >
            תהליך דיגיטלי היברידי מיוחד לארגונים, שמפתח את היכולת לחשוב אחרת ומעניק סט של כלי עבודה לחיים בעולם
            שלא מפסיק לרוץ.
          </p>

          <p
            data-reveal
            className="mt-[14px] max-w-[693px] text-[24px] leading-[1.3] font-normal text-pretty text-ink sm:text-[clamp(18px,2.7vw,29px)]"
          >
            תהליך חוויתי ושיטתי שמזמין את משתתפיו לעשות המעבר: <br className="hidden sm:inline" />
            <strong className="text-ink">מטלנטים ל-סופר-טלנטים</strong>.
          </p>

          <div
            data-reveal
            className="mt-[1.2em] flex w-full flex-wrap justify-center gap-4 pt-[1.2em] sm:mt-[2em] sm:w-auto sm:justify-start sm:pt-[2em]"
          >
            <Cta href="#contact" className="max-w-[250px] flex-1 px-7 py-[13px] text-center text-[20.4px] sm:flex-none">
              הצטרפו לתהליך
            </Cta>
            <Cta
              href="#benefits"
              variant="outline"
              className="max-w-[250px] flex-1 px-7 py-[13px] text-center text-[20.4px] sm:flex-none"
            >
              למידע נוסף
            </Cta>
          </div>
        </div>

        <div
          data-reveal
          className="relative order-2 flex min-h-[300px] items-end justify-start self-stretch md:order-none md:min-h-[420px]"
        >
          <img
            data-hero-portrait
            src={asset('hero-eyal.webp')}
            alt="מטלנט לסופר-טלנט"
            className="mx-auto block h-auto w-full max-w-[420px] md:absolute md:bottom-[-468px] md:left-0 md:mx-0 md:w-[137.5%] md:max-w-[1133px]"
          />
        </div>
      </div>

      {/* Pull-quote card. Floats over the hero art only once there is room for it. */}
      <div
        data-reveal
        className="relative z-[3] mt-[10px] max-w-none rounded-[24px] border border-white bg-[linear-gradient(160deg,rgba(255,255,255,.82)_0%,rgba(239,238,235,.72)_100%)] px-[34px] py-[30px] text-center backdrop-blur-[14px] sm:mt-6 xl:absolute xl:bottom-[clamp(55px,11vh,125px)] xl:left-[clamp(60px,9vw,150px)] xl:mt-0 xl:max-w-[638px] xl:shadow-[0_26px_60px_rgba(20,19,24,.10)]"
      >
        <p className="text-[22.5px] leading-[1.3] font-bold text-ink sm:text-[clamp(20px,1.65vw,22.5px)]">
          העולם זז מהר. משבר רודף משבר,
          <br />
          לעוד שיבוש ועוד משבר. <br />
          המציאות החדשה בשתי מילים:
        </p>
        <div className="mt-[6px] text-[45.5px] leading-[1.15] font-bold text-gray-body sm:text-[clamp(36px,4.55vw,67px)]">
          &quot;אין לדעת&quot;.
        </div>
        <p className="mt-[10px] text-[19px] leading-[1.3] font-normal text-pretty text-ink sm:text-[clamp(19px,1.43vw,21.5px)]">
          חייבים להגיב מהר, להיות גמישים מחשבתית, לפתור בעיות, לפעול בחוסר וודאות.
        </p>
      </div>

      <a
        href="#intro-video"
        data-reveal
        aria-label="התחילו כאן"
        className="absolute bottom-[calc(clamp(24px,6vh,70px)+15px)] right-[calc(clamp(30px,6vw,110px)-15px)] z-[3] hidden h-[clamp(121px,11vw,165px)] w-[clamp(121px,11vw,165px)] xl:block"
      >
        <img
          src={asset('scroll-arrow.webp')}
          alt=""
          className="absolute top-1/2 left-[calc(50%+35px)] h-[47%] w-[42%] animate-[bobArrow_2.2s_ease-in-out_infinite] object-contain"
        />
      </a>
    </section>
  )
}
