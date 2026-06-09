import { LandingHero } from "@/components/home/landing-hero"
import { LandingBenefits } from "@/components/home/landing-benefits"
import { LandingModels } from "@/components/home/landing-models"
import { LandingTradeIn } from "@/components/home/landing-trade-in"
import { LandingPromotions } from "@/components/home/landing-promotions"
import { LandingTestimonials } from "@/components/home/landing-testimonials"
import { LandingHowItWorks } from "@/components/home/landing-how-it-works"
import { LandingFinalCta } from "@/components/home/landing-final-cta"
import { LandingFooter } from "@/components/home/landing-footer"

export default function Home() {
  return (
    <div className="flex flex-col bg-[#f5f5f7]">
      <LandingHero />
      <LandingBenefits />
      <LandingModels />
      <LandingTradeIn />
      <LandingPromotions />
      <LandingTestimonials />
      <LandingHowItWorks />
      <LandingFinalCta />
      <LandingFooter />
    </div>
  )
}
