import Navbar from '@/components/Navbar'
import FabDock from '@/components/FabDock'
import Hero from '@/components/Hero'
import Story from '@/components/Story'
import Reels from '@/components/Reels'
import Strip from '@/components/Strip'
import About from '@/components/About'
import Golan from '@/components/Golan'
import Method from '@/components/Method'
import Programs from '@/components/Programs'
import Testimonials from '@/components/Testimonials'
import Faq from '@/components/Faq'
import FinalFooter from '@/components/FinalFooter'
import DiscPopup from '@/components/DiscPopup'
import LeadPopup from '@/components/LeadPopup'
import Consent from '@/components/Consent'
import Fx from '@/components/Fx'

/*
 * מסע הלקוח (לא לערבב סדר בלי בקשה):
 * כאב (hero) → הזדהות (story) → הוכחה (reels) → המדריך (about+golan)
 * → התוכנית (method) → ההצעה (programs) → הוכחה חברתית → התנגדויות → סגירה.
 */
export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        דלג לתוכן הראשי
      </a>
      <div className="grain" aria-hidden="true" />
      <div className="progress" aria-hidden="true">
        <i id="progressBar" />
      </div>

      <DiscPopup />
      <LeadPopup />
      <Consent />

      <Navbar />
      <FabDock />

      <Hero />

      <main id="main">
        <Story />
        <Reels />
        <Strip />
        <About />
        <Golan />
        <Method />
        <Programs />
        <Testimonials />
        <Faq />
      </main>

      <FinalFooter />
      <Fx />
    </>
  )
}
