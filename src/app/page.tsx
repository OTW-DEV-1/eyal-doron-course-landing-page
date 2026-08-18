import { MotionProvider } from '@/components/MotionProvider'
import { Header } from '@/components/sections/Header'
import { Hero } from '@/components/sections/Hero'
import { IntroVideo } from '@/components/sections/IntroVideo'
import { Talents } from '@/components/sections/Talents'
import { WhyNow } from '@/components/sections/WhyNow'
import { Learn } from '@/components/sections/Learn'
import { Gallery } from '@/components/sections/Gallery'
import { Remember } from '@/components/sections/Remember'
import { Leap } from '@/components/sections/Leap'
import { LogosStrip } from '@/components/sections/LogosStrip'
import { Benefits } from '@/components/sections/Benefits'
import { Stations } from '@/components/sections/Stations'
import { Practice } from '@/components/sections/Practice'
import { Process } from '@/components/sections/Process'
import { Bonuses } from '@/components/sections/Bonuses'
import { About } from '@/components/sections/About'
import { Numbers } from '@/components/sections/Numbers'
import { Faq } from '@/components/sections/Faq'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

export default function Page() {
  return (
    <div className="overflow-x-clip overflow-y-visible text-right text-ink">
      <MotionProvider />
      <Header />
      <Hero />
      <IntroVideo />
      <Talents />
      <WhyNow />
      <Learn />
      <Gallery />
      <Remember />
      <Leap />
      <LogosStrip />
      <Benefits />
      <Stations />
      <Practice />
      <Process />
      <Bonuses />
      <About />
      <Numbers />
      <Faq />
      <Contact />
      <Footer />
    </div>
  )
}
