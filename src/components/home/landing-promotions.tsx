"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Calendar, Package, ArrowRightLeft } from "lucide-react"
import {
  LandingSection,
  SectionHeader,
  fadeUpStagger,
  fadeUpChild,
  landingCtaPrimary,
} from "@/components/home/landing-motion"

const PROMOS = [
  {
    icon: Sparkles,
    title: "Promo du jour",
    description: "Réductions limitées sur une sélection d'iPhones certifiés.",
    accent: "from-[#0071e3]/8 to-transparent",
  },
  {
    icon: Calendar,
    title: "Promo week-end",
    description: "Offres spéciales chaque week-end sur les modèles Pro et Pro Max.",
    accent: "from-[#0071e3]/6 to-transparent",
  },
  {
    icon: Package,
    title: "Pack iPhone + glace + pochette",
    description: "Protection complète incluse avec certains modèles en promotion.",
    accent: "from-[#0071e3]/8 to-transparent",
  },
  {
    icon: ArrowRightLeft,
    title: "Offre spéciale troc",
    description: "Bonus de reprise pour les échanges vers un modèle supérieur.",
    accent: "from-[#0071e3]/6 to-transparent",
  },
] as const

export function LandingPromotions() {
  return (
    <LandingSection id="promotions" className="bg-white">
      <div className="container-pro section-y !py-12 sm:!py-20">
        <SectionHeader
          eyebrow="Offres"
          title="Promotions disponibles cette semaine."
        />
        <motion.div
          variants={fadeUpStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-4xl mx-auto"
        >
          {PROMOS.map(({ icon: Icon, title, description, accent }) => (
            <motion.article
              key={title}
              variants={fadeUpChild}
              className="group relative rounded-[20px] bg-white p-5 sm:p-6 overflow-hidden shadow-[0_4px_18px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.13)] transition-all duration-300"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity`}
                aria-hidden
              />
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-[#0071e3]/10 flex items-center justify-center mb-3">
                  <Icon className="h-[18px] w-[18px] text-[#0071e3]" strokeWidth={1.75} />
                </div>
                <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="text-[13px] sm:text-[14px] text-[#6e6e73] mt-2 leading-relaxed">
                  {description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
        <p className="text-center mt-8 sm:mt-10">
          <Link href="/catalog" className={landingCtaPrimary}>
            Voir les promotions
          </Link>
        </p>
      </div>
    </LandingSection>
  )
}
