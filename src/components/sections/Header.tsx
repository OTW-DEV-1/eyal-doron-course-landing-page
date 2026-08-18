import { asset } from '@/lib/assets'
import { navLinks } from '@/lib/content'
import { Cta } from '@/components/ui'

/**
 * Fixed dark pill. The nav collapses below 1181px, leaving logo + CTA
 * shoulder to shoulder — there is no mobile menu in the design.
 */
export function Header() {
  return (
    <header className="fixed top-[10px] sm:top-4 right-0 left-0 z-[100] px-3 sm:px-[clamp(16px,4.5vw,5em)]">
      <div className="flex w-full items-center justify-between gap-[18px] rounded-full border border-white/[.14] bg-black/[.78] px-[14px] py-[10px] shadow-[inset_0_1px_0_rgba(255,255,255,.16)] backdrop-blur-[18px] backdrop-saturate-[1.4] lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <img
          src={asset('logo-white.png')}
          alt="dr. eyal doron"
          className="ms-3 block h-[34px] justify-self-start sm:h-[37px]"
        />

        <nav className="hidden items-center justify-center gap-[14px] text-[16.9px] font-normal whitespace-nowrap lg:flex 2xl:gap-6 2xl:text-[19.4px]">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="font-medium text-white transition-colors hover:text-brand-teal">
              {l.label}
            </a>
          ))}
        </nav>

        <Cta
          href="#contact"
          className="justify-self-end px-3 py-1.5 text-[12px] sm:px-[26px] sm:py-3 sm:text-[19.4px]"
        >
          רוצים לשמוע עוד!
        </Cta>
      </div>
    </header>
  )
}
