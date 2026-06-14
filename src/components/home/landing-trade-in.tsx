"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { LandingSection, SectionHeader, landingCtaWhatsapp } from "@/components/home/landing-motion"

const CONDITIONS = [
  "Téléphone original",
  "Écran en bon état",
  "Face arrière en bon état",
  "Batterie minimum 80%",
  "Appareil fonctionnel",
] as const

const TRADE_WHATSAPP =
  "https://wa.me/243970299448?text=" +
  encodeURIComponent("Bonjour, je souhaite une estimation de troc pour mon téléphone chez Apple Store Market.")

export function LandingTradeIn() {
  return (
    <LandingSection id="troc" className="bg-[#f5f5f7]">
      <div className="container-pro section-y !py-12 sm:!py-20">
        <SectionHeader
          eyebrow="Troc"
          title="Passez à un iPhone supérieur sans stress."
          description="Vous avez déjà un iPhone ou un Android ? Échangez votre ancien téléphone contre un modèle supérieur, selon l'état de l'appareil."
        />

        <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_1.1fr] gap-6 sm:gap-8 items-center">
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-[280px] aspect-square rounded-[28px] bg-white shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] overflow-hidden p-6">
              <Image
                src="/phones/upgrade.jpg"
                alt="Échangez votre iPhone"
                width={400}
                height={400}
                unoptimized
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>

          <div className="rounded-[22px] sm:rounded-[24px] bg-white p-5 sm:p-8 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)]">
            <p className="text-[12px] sm:text-[13px] font-medium text-[#86868b] uppercase tracking-wide mb-4">
              Conditions de troc
            </p>
            <ul className="space-y-2.5 sm:space-y-3">
              {CONDITIONS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[14px] sm:text-[15px] text-[#1d1d1f]">
                  <span className="h-6 w-6 rounded-full bg-[#0071e3]/10 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-[#0071e3]" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 sm:mt-8 flex justify-center sm:justify-start">
              <a href={TRADE_WHATSAPP} className={landingCtaWhatsapp}>
                Demander une estimation
              </a>
            </div>
          </div>
        </div>
      </div>
    </LandingSection>
  )
}
