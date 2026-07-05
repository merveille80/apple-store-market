"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

const EASE = [0.25, 0.1, 0.25, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE },
  },
}

export const fadeUpStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

export const fadeUpChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
}

/** Révélation douce avec flou — pour les titres de section */
export const blurReveal: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE },
  },
}

/** Pop avec léger rebond — pour badges, numéros d'étape, coches */
export const springPop: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 380, damping: 18 },
  },
}

export { landingCtaPrimary, landingCtaOutline, landingCtaWhatsapp } from "./landing-styles"

export function LandingSection({
  id,
  className = "",
  children,
}: {
  id?: string
  className?: string
  children: ReactNode
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className = "",
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-70px" }}
      variants={fadeUpStagger}
      className={`text-center max-w-2xl mx-auto mb-10 sm:mb-14 ${className}`}
    >
      {eyebrow && (
        <motion.p
          variants={fadeUpChild}
          className="text-[13px] font-medium text-[#0071e3] tracking-tight mb-2"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={blurReveal}
        className="font-sf-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-tight"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUpChild}
          className="text-[15px] sm:text-[17px] text-[#6e6e73] mt-3 leading-relaxed tracking-[-0.01em]"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
