"use client"

import Link from "next/link"
import { LandingSection, landingCtaWhatsapp, landingCtaOutline } from "@/components/home/landing-motion"

const WHATSAPP_URL =
  "https://wa.me/243970299448?text=Bonjour%2C%20je%20souhaite%20commander%20un%20iPhone%20chez%20Apple%20Store%20Market."

export function LandingFinalCta() {
  return (
    <LandingSection className="bg-[#f5f5f7]">
      <div className="container-pro py-12 sm:py-20 md:py-24 text-center">
        <p className="text-[12px] font-medium tracking-wide text-[#0071e3] uppercase mb-3">
          Prêt à commander ?
        </p>
        <h2 className="font-sf-display text-[clamp(1.5rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-tight max-w-2xl mx-auto">
          Prêt à passer à un nouvel iPhone ?
        </h2>
        <p className="text-[14px] sm:text-[17px] text-[#6e6e73] mt-3 sm:mt-4 max-w-xl mx-auto leading-relaxed">
          Commandez maintenant, échangez votre ancien téléphone ou demandez un
          modèle précis chez Apple Store Kolwezi.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center justify-center gap-1.5 sm:gap-3">
          <a href={WHATSAPP_URL} className={landingCtaWhatsapp}>
            Commander sur WhatsApp
          </a>
          <Link href="/#promotions" className={landingCtaOutline}>
            Voir les promotions
          </Link>
        </div>
      </div>
    </LandingSection>
  )
}
