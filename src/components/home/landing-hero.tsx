"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { HeroLineup } from "@/components/home/hero-lineup"

const WHATSAPP_URL =
  "https://wa.me/243970299448?text=Bonjour%2C%20je%20souhaite%20commander%20un%20iPhone%20chez%20Apple%20Store%20Market."

const EASE = [0.25, 0.1, 0.25, 1] as const

const HEADLINE_WORDS = ["Achetez", "votre", "iPhone", "en", "toute", "confiance."]

export function LandingHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  // Parallax : le lineup recule et grossit légèrement quand on scrolle
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const lineupY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const lineupScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={sectionRef} className="relative bg-[#f5f5f7] overflow-hidden">
      {/* Halo doux derrière les iPhones */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(0,113,227,0.08),transparent_70%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1060px] px-5 sm:px-6 lg:px-8">
        {/* Texte */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="pt-14 sm:pt-16 md:pt-20 text-center"
        >
          {/* Badge shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-5 flex justify-center"
          >
            <Link
              href="/catalog"
              className="group relative inline-flex max-w-full items-center gap-1.5 sm:gap-2 rounded-full border border-[#0071e3]/20 bg-white/70 backdrop-blur px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-[12px] font-medium text-[#1d1d1f] shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-hidden hover:border-[#0071e3]/40 transition-colors whitespace-nowrap"
            >
              {/* sweep lumineux */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full animate-[hero-shimmer_2.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#0071e3]/10 to-transparent"
              />
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0071e3] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0071e3]" />
              </span>
              <span className="relative">
                Nouveau — iPhone 17 Pro Max<span className="hidden sm:inline"> disponible</span>
              </span>
              <span className="relative text-[#0071e3] transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          </motion.div>

          {/* Headline mot par mot */}
          <h1 className="font-sf-display text-[clamp(2rem,6vw,3.5rem)] font-semibold text-[#1d1d1f] tracking-[-0.045em] leading-[1.06] max-w-[720px] mx-auto">
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.07, ease: EASE }}
                className="inline-block mr-[0.24em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-3"
          >
            <motion.a
              href={WHATSAPP_URL}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-flex h-11 sm:h-12 items-center justify-center rounded-full bg-[#0071e3] px-5 sm:px-7 text-[14px] sm:text-[15px] font-medium tracking-[-0.01em] text-white hover:bg-[#0077ed] shadow-[0_4px_20px_rgba(0,113,227,0.35)]"
            >
              Commander maintenant
            </motion.a>
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="inline-flex"
            >
              <Link
                href="/catalog"
                className="inline-flex h-11 sm:h-12 items-center justify-center rounded-full border border-[#0071e3]/35 sm:border-[#0071e3] px-5 sm:px-7 text-[14px] sm:text-[15px] font-medium tracking-[-0.01em] text-[#0071e3] bg-white/80 sm:bg-white/60 hover:bg-white transition-colors"
              >
                Voir les modèles
              </Link>
            </motion.span>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9, ease: EASE }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[13px] text-[#86868b]"
          >
            <li>Troc possible</li>
            <li aria-hidden>·</li>
            <li>Livraison RDC</li>
            <li aria-hidden>·</li>
            <li>Qualité USA Box</li>
          </motion.ul>
        </motion.div>

        {/* Mockup — parallax au scroll */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          className="mt-6 sm:mt-10 md:mt-12 pb-4 sm:pb-6 md:pb-8 -mx-3 sm:mx-0"
        >
          <motion.div style={reduceMotion ? undefined : { y: lineupY, scale: lineupScale }}>
            <HeroLineup className="max-w-[1060px] mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
