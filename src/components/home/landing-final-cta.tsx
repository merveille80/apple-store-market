"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  LandingSection,
  blurReveal,
  fadeUpStagger,
  fadeUpChild,
  landingCtaWhatsapp,
  landingCtaOutline,
} from "@/components/home/landing-motion"

const WHATSAPP_URL =
  "https://wa.me/243970299448?text=Bonjour%2C%20je%20souhaite%20commander%20un%20iPhone%20chez%20Apple%20Store%20Market."

const SPRING = { type: "spring", stiffness: 400, damping: 22 } as const

export function LandingFinalCta() {
  const reduceMotion = useReducedMotion()
  return (
    <LandingSection className="relative bg-[#f5f5f7] overflow-hidden">
      {/* Halo qui respire derrière le titre */}
      <motion.div
        aria-hidden
        animate={reduceMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[420px] w-[680px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,113,227,0.09),transparent_70%)]"
      />
      <motion.div
        variants={fadeUpStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-70px" }}
        className="container-pro relative py-12 sm:py-20 md:py-24 text-center"
      >
        <motion.p
          variants={fadeUpChild}
          className="text-[12px] font-medium tracking-wide text-[#0071e3] uppercase mb-3"
        >
          Prêt à commander ?
        </motion.p>
        <motion.h2
          variants={blurReveal}
          className="font-sf-display text-[clamp(1.5rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-tight max-w-2xl mx-auto"
        >
          Prêt à passer à un nouvel iPhone ?
        </motion.h2>
        <motion.p
          variants={fadeUpChild}
          className="text-[14px] sm:text-[17px] text-[#6e6e73] mt-3 sm:mt-4 max-w-xl mx-auto leading-relaxed"
        >
          Commandez maintenant, échangez votre ancien téléphone ou demandez un
          modèle précis chez Apple Store Kolwezi.
        </motion.p>
        <motion.div
          variants={fadeUpChild}
          className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center justify-center gap-1.5 sm:gap-3"
        >
          <motion.a
            href={WHATSAPP_URL}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={SPRING}
            className={`${landingCtaWhatsapp} shadow-[0_4px_18px_rgba(37,211,102,0.3)]`}
          >
            Commander sur WhatsApp
          </motion.a>
          <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={SPRING} className="inline-flex">
            <Link href="/#promotions" className={landingCtaOutline}>
              Voir les promotions
            </Link>
          </motion.span>
        </motion.div>
      </motion.div>
    </LandingSection>
  )
}
