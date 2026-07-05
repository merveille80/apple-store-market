"use client"

import { Star } from "lucide-react"
import { motion } from "framer-motion"
import {
  LandingSection,
  SectionHeader,
  fadeUpStagger,
  fadeUpChild,
} from "@/components/home/landing-motion"

const TESTIMONIALS = [
  {
    name: "Grâce M.",
    initials: "GM",
    text: "J'ai acheté mon iPhone 13 Pro Max chez Apple Store Kolwezi. Le téléphone était propre, bien testé et la livraison rapide.",
  },
  {
    name: "Jonathan K.",
    initials: "JK",
    text: "J'ai échangé mon ancien iPhone contre un modèle supérieur. Le service était simple, rapide et professionnel.",
  },
  {
    name: "Esther L.",
    initials: "EL",
    text: "Les prix sont clairs, le service est sérieux et on te conseille bien avant d'acheter.",
  },
  {
    name: "David T.",
    initials: "DT",
    text: "J'ai commandé depuis Lubumbashi et j'ai reçu mon iPhone sans problème. Très bon service.",
  },
] as const

export function LandingTestimonials() {
  return (
    <LandingSection id="temoignages" className="bg-white border-t border-black/[0.06]">
      <div className="container-pro section-y !py-12 sm:!py-20">
        <SectionHeader
          eyebrow="Avis clients"
          title="Ils ont déjà fait confiance à Apple Store Kolwezi."
        />
        <motion.div
          variants={fadeUpStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-4xl mx-auto"
        >
          {TESTIMONIALS.map(({ name, initials, text }) => (
            <motion.article
              key={name}
              variants={fadeUpChild}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="rounded-[20px] bg-white p-5 sm:p-6 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.14)] transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="h-9 w-9 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[12px] font-semibold flex items-center justify-center shrink-0">
                  {initials}
                </span>
                <div>
                  <p className="text-[14px] font-medium text-[#1d1d1f]">{name}</p>
                  <div className="flex items-center gap-0.5 mt-0.5" aria-label="5 étoiles sur 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.4 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 17,
                          delay: 0.3 + i * 0.07,
                        }}
                        className="inline-flex"
                      >
                        <Star className="h-3 w-3 fill-[#0071e3] text-[#0071e3]" strokeWidth={0} />
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[14px] sm:text-[15px] text-[#6e6e73] leading-relaxed">
                &ldquo;{text}&rdquo;
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </LandingSection>
  )
}
