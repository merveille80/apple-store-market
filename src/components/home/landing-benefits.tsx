"use client"

import { ShieldCheck, ArrowRightLeft, Zap, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import {
  LandingSection,
  SectionHeader,
  fadeUpStagger,
  fadeUpChild,
} from "@/components/home/landing-motion"

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "iPhones testés et certifiés",
    description:
      "Chaque appareil est contrôlé avant mise en vente pour garantir qualité et authenticité.",
  },
  {
    icon: ArrowRightLeft,
    title: "Troc possible",
    description:
      "Échangez votre ancien iPhone ou Android contre un modèle supérieur selon l'état de l'appareil.",
  },
  {
    icon: Zap,
    title: "Commande simple et rapide",
    description:
      "Choisissez votre modèle, confirmez sur WhatsApp et finalisez en quelques minutes.",
  },
  {
    icon: MapPin,
    title: "Livraison étendue",
    description:
      "Kolwezi, Likasi, Lubumbashi et Kasumbalesa — remise en main propre ou livraison selon votre ville.",
    cities: ["Kolwezi", "Likasi", "Lubumbashi", "Kasumbalesa"],
  },
] as const

export function LandingBenefits() {
  return (
    <LandingSection className="bg-[#f5f5f7]">
      <div className="container-pro section-y !py-12 sm:!py-20">
        <SectionHeader
          eyebrow="Avantages"
          title="Pourquoi choisir Apple Store Market ?"
        />
        <motion.div
          variants={fadeUpStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {BENEFITS.map(({ icon: Icon, title, description, ...rest }) => (
            <motion.article
              key={title}
              variants={fadeUpChild}
              className="group rounded-[20px] sm:rounded-[22px] bg-white border border-black/[0.05] p-5 sm:p-6 shadow-[0_2px_16px_-6px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_28px_-8px_rgba(0,0,0,0.1)] sm:hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#0071e3]/[0.08] flex items-center justify-center mb-3.5 sm:mb-4 group-hover:bg-[#0071e3]/[0.12] transition-colors">
                <Icon className="h-[18px] w-[18px] sm:h-5 sm:w-5 text-[#0071e3]" strokeWidth={1.75} />
              </div>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#1d1d1f] tracking-[-0.02em] mb-1.5 sm:mb-2">
                {title}
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[#6e6e73] leading-relaxed">
                {description}
              </p>
              {"cities" in rest && rest.cities && (
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {rest.cities.map((city) => (
                    <span
                      key={city}
                      className="text-[10px] sm:text-[11px] font-medium text-[#86868b] bg-[#f5f5f7] px-2 py-0.5 rounded-full"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </motion.div>
      </div>
    </LandingSection>
  )
}
