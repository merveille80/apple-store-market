"use client"

import { motion } from "framer-motion"
import {
  LandingSection,
  SectionHeader,
  fadeUpStagger,
  fadeUpChild,
} from "@/components/home/landing-motion"

const STEPS = [
  {
    step: "1",
    title: "Choisissez votre modèle",
    description:
      "Parcourez le catalogue du XR au 17 Pro Max et sélectionnez le modèle qui vous convient.",
  },
  {
    step: "2",
    title: "Confirmez le prix et la disponibilité",
    description:
      "Contactez-nous sur WhatsApp pour valider le prix, l'état et la disponibilité en temps réel.",
  },
  {
    step: "3",
    title: "Payez et récupérez ou recevez",
    description:
      "Finalisez votre achat et récupérez à Kolwezi ou recevez votre iPhone dans votre ville.",
  },
] as const

export function LandingHowItWorks() {
  return (
    <LandingSection className="bg-white">
      <div className="container-pro section-y !py-12 sm:!py-20">
        <SectionHeader
          eyebrow="Processus"
          title="Commandez votre iPhone en 3 étapes."
        />
        <motion.div
          variants={fadeUpStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto"
        >
          <div
            className="hidden md:block absolute top-[52px] left-[18%] right-[18%] h-px bg-gradient-to-r from-transparent via-[#0071e3]/25 to-transparent"
            aria-hidden
          />
          {STEPS.map(({ step, title, description }) => (
            <motion.article
              key={step}
              variants={fadeUpChild}
              className="relative rounded-[20px] sm:rounded-[22px] border border-black/[0.06] bg-[#fafafa] p-5 sm:p-7 text-center md:text-left"
            >
              <span className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#0071e3] text-white text-[14px] sm:text-[15px] font-semibold mb-3 sm:mb-4 shadow-[0_4px_12px_rgba(0,113,227,0.25)]">
                {step}
              </span>
              <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                {title}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#6e6e73] mt-2 leading-relaxed">
                {description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </LandingSection>
  )
}
