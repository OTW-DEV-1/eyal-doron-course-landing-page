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
        {/* seed 8.11 places the teal/green mass in the upper-left of the aurora
            area with the sky-blue high and the right side clean — the
            composition the design reference shows. speed 0 holds it there:
            drifting blobs kept wandering into washed-out arrangements minutes
            after load, which read as a broken background. */}
        <Aurora colors="#06B58D,#42C5C6,#6EB9F2" intensity={1.92} seed={8.11} speed={0} style={{ top: 0, bottom: 0, left: 0, width: '70%', height: 'auto' }} />
        <div className="pointer-events-none absolute inset-0 z-[1]">
          {/* Drawn twice, exactly as the prototype does — the second pass doubles
              the texture's density. One copy alone reads washed out.

              max-w-[950px]: the artwork is 16:9 with a blob on its left edge
              and another on its right edge, and the design's authored width
              shows only a ~700px-wide centred window of it — both blobs sit
              outside that window. Without the cap, the centred cover crop
              widens with the viewport and slides onto both: a sliver of the
              left blob appears as an empty wedge at the screen corner and the
              right blob's leading arc as a floating crescent. 950px at this
              image's cover scale reproduces the design's window at every
              viewport. (Anchoring the crop left instead was tried and exposes
              the entire left blob — worse.) */}
          <img src={asset('hero-texture.webp')} alt="" className="absolute inset-y-0 left-0 h-full w-[52%] max-w-[950px] object-cover" />
          <img src={asset('hero-texture.webp')} alt="" className="absolute inset-y-0 left-0 h-full w-[52%] max-w-[950px] object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,245,242,0)_0%,rgba(246,245,242,0)_46%,rgba(246,245,242,.62)_60%,rgba(246,245,242,.9)_72%,#F6F5F2_100%)]" />
          <div className="absolute inset-x-0 top-0 h-[150px] bg-[linear-gradient(180deg,rgba(246,245,242,.85)_20%,rgba(246,245,242,0)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-[240px] bg-[linear-gradient(180deg,rgba(246,245,243,0)_0%,rgba(246,245,243,.96)_70%,#f6f5f3_100%)]" />
        </div>
      </div>

      {/* Slowly counter-rotating seal. Must NEVER overlap the pull-quote card.
          Wherever the card is absolutely positioned (xl+), the badge anchors to
          the same bottom edge: card top sits at its bottom offset + ~271px of
          card height, and the badge's bottom is pinned 24px above that. Because
          both measure from the section's bottom, no viewport size can push them
          into each other. Below xl the card is in normal flow far beneath the
          badge, so the top-percentage anchor there is safe. */}
      <img
        src={asset('circle-badge.webp')}
        alt="תהליך מיוחד לארגונים"
        className="pointer-events-none absolute top-[41%] left-[14px] z-[4] h-auto w-[150px] animate-[spinSlow_12s_linear_infinite] sm:top-[34%] sm:left-[clamp(135px,14.4vw,288px)] sm:w-[clamp(135px,15.3vw,297px)] xl:top-auto xl:bottom-[calc(clamp(55px,11vh,125px)+295px)]"
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

        {/* The portrait is bottom-anchored at -468px in the prototype. Its
            column shortens as the viewport widens (the text wraps less), which
            at ~2560px pushed the head up until it slid behind the fixed header.
            The design reference keeps clear space between the header and the
            head, so beyond 1600px the anchor eases down proportionally
            (0.14px per extra viewport px, capped at -608px), landing the head
            where the design shows it while leaving <=1600px untouched.

            The 15% reduction is a transform scale, not a smaller width. The
            portrait is square and bottom-anchored below the fold, so shrinking
            its width shortens it by the same amount and the bottom edge stays
            put — the head drops by 15% of the height (144px at 1600px, 170px at
            2400px), sinking it behind the badge and the pull-quote card. The
            compensating offset would have to track the height, which varies
            with the column width. origin-top scales about the element's own top
            edge instead, so the head holds its position at every viewport for
            free. Safe here because the reveal engine writes its inline
            transforms to the wrapper, never to this image. */}
        <div
          data-reveal
          className="relative order-2 flex min-h-[300px] items-end justify-start self-stretch md:order-none md:min-h-[420px]"
        >
          <img
            data-hero-portrait
            src={asset('hero-eyal.webp')}
            alt="מטלנט לסופר-טלנט"
            className="mx-auto block h-auto w-full max-w-[420px] md:absolute md:bottom-[clamp(-608px,calc(-468px_-_(100vw_-_1600px)*0.47),-468px)] md:left-0 md:mx-0 md:w-[137.5%] md:max-w-[1133px] md:origin-top md:scale-[.85]"
          />
        </div>
      </div>

      {/* Pull-quote card. Floats over the hero art only once there is room for it.

          Horizontal padding is 30px, not the prototype's 34px. The closing line
          needs 569.6px and the prototype's content box is 567.75px — it fits
          there by 0.02px, which is luck rather than a margin. At 34px here the
          line wrapped, making the card 28px taller, which pushed its top edge up
          into the rotating badge. 30px gives ~6px of slack; the 4px difference
          is imperceptible and the layout stops depending on sub-pixel rounding. */}
      <div
        data-reveal
        className="relative z-[3] mt-[10px] max-w-none rounded-[24px] border border-white bg-[linear-gradient(160deg,rgba(255,255,255,.82)_0%,rgba(239,238,235,.72)_100%)] px-[30px] py-[30px] text-center backdrop-blur-[14px] sm:mt-6 xl:absolute xl:bottom-[clamp(55px,11vh,125px)] xl:left-[clamp(60px,9vw,150px)] xl:mt-0 xl:w-[638px] xl:max-w-[638px] xl:shadow-[0_26px_60px_rgba(20,19,24,.10)]"
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
