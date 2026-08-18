import { asset } from '@/lib/assets'
import { LogoLoop } from '@/components/reactbits/LogoLoop'
import { logoRowA, logoRowB } from '@/lib/content'
import { CARD } from '@/components/ui'

function LogoCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className={`${CARD} h-[110px] w-[210px] flex-none rounded-[18px] px-7 py-[22px] sm:h-[156px] sm:w-[300px] sm:rounded-[24px] sm:px-[42px] sm:py-8`}>
      <img src={asset(src)} alt={alt} className="block h-full w-full object-contain" />
    </div>
  )
}

/** Client logos, two marquees running in opposite directions. */
export function LogosStrip() {
  return (
    <section id="logos-strip" className="relative z-[1] pt-4 pb-14 sm:pt-16 sm:pb-14">
      <div className="relative z-[1] w-full text-center">
        <p
          data-reveal
          className="m-0 mb-12 pt-2 text-[34px] leading-[1.15em] font-bold text-ink sm:pt-14 sm:text-[clamp(24px,3.3vw,40px)]"
        >
          ארגונים שעברו את התהליך הזה, <br className="block sm:hidden" />
          בארץ ובעולם:
        </p>

        <div data-reveal>
          <LogoLoop gap={40} duration={26}>
            {logoRowA.map((l) => (
              <LogoCard key={l.src} {...l} />
            ))}
          </LogoLoop>
          <div className="h-7" />
          <LogoLoop gap={40} duration={26} reverse>
            {logoRowB.map((l) => (
              <LogoCard key={l.src} {...l} />
            ))}
          </LogoLoop>
        </div>
      </div>
    </section>
  )
}
