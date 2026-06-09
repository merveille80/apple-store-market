"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { HeroLineup } from "@/components/home/hero-lineup"

const WHATSAPP_URL =
  "https://wa.me/243970299448?text=Bonjour%2C%20je%20souhaite%20commander%20un%20iPhone%20chez%20Apple%20Store%20Market."

const EASE = [0.25, 0.1, 0.25, 1] as const

export function LandingHero() {
  return (
    <section className="relative bg-[#f5f5f7] overflow-hidden">
      {/* Halo doux derrière les iPhones */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(0,113,227,0.06),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1060px] px-5 sm:px-6 lg:px-8">
        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="pt-14 sm:pt-16 md:pt-20 text-center"
        >
          <p className="text-[12px] font-medium tracking-wide text-[#0071e3] uppercase mb-4">
            Apple Store Kolwezi
          </p>

          <h1 className="font-sf-display text-[clamp(2rem,6vw,3.5rem)] font-semibold text-[#1d1d1f] tracking-[-0.045em] leading-[1.06] max-w-[720px] mx-auto">
            Achetez votre iPhone en toute confiance.
          </h1>

          <p className="mt-4 sm:mt-5 text-[17px] sm:text-[19px] text-[#6e6e73] leading-[1.47] max-w-[520px] mx-auto tracking-[-0.01em]">
            Commandez, achetez ou échangez votre iPhone chez Apple Store Kolwezi.
            Modèles du XR au 17 Pro Max.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center justify-center gap-1.5 sm:gap-3">
            <a
              href={WHATSAPP_URL}
              className="inline-flex h-9 sm:h-12 items-center justify-center rounded-full bg-[#0071e3] px-4 sm:px-7 text-[12px] sm:text-[15px] font-medium tracking-[-0.01em] text-white hover:bg-[#0077ed] active:scale-[0.98] transition-all shadow-[0_1px_6px_rgba(0,113,227,0.18)] sm:shadow-none"
            >
              Commander maintenant
            </a>
            <Link
              href="/catalog"
              className="inline-flex h-9 sm:h-12 items-center justify-center rounded-full border border-[#0071e3]/35 sm:border-[#0071e3] px-4 sm:px-7 text-[12px] sm:text-[15px] font-medium tracking-[-0.01em] text-[#0071e3] bg-white/80 sm:bg-white/60 hover:bg-white active:scale-[0.98] transition-all"
            >
              Voir les modèles
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13px] text-[#86868b]">
            <li>Troc possible</li>
            <li aria-hidden>·</li>
            <li>Livraison RDC</li>
            <li aria-hidden>·</li>
            <li>Qualité USA Box</li>
          </ul>
        </motion.div>

        {/* Mockup — pleine largeur, même gris que l'image = pas de boîte */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
          className="mt-6 sm:mt-10 md:mt-12 pb-4 sm:pb-6 md:pb-8 -mx-3 sm:mx-0"
        >
          <HeroLineup className="max-w-[1060px] mx-auto" />
        </motion.div>
      </div>
    </section>
  )
}
