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
    <div className={`text-center max-w-2xl mx-auto mb-10 sm:mb-14 ${className}`}>
      {eyebrow && (
        <p className="text-[13px] font-medium text-[#0071e3] tracking-tight mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="font-sf-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-[15px] sm:text-[17px] text-[#6e6e73] mt-3 leading-relaxed tracking-[-0.01em]">
          {description}
        </p>
      )}
    </div>
  )
}
