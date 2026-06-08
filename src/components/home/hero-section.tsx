"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"

const EASE = [0.25, 0.1, 0.25, 1] as const

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: EASE },
  }),
}

export function HeroSection() {
  return (
    <section className="relative bg-[#f5f5f7] overflow-hidden">
      <div className="mx-auto max-w-[980px] px-5 pt-14 md:pt-[72px] pb-0 text-center">
        <motion.h1
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-sf-display text-[clamp(2.5rem,6.5vw,3.5rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-none"
        >
          iPhone
        </motion.h1>

        <motion.p
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-2 text-[clamp(1.125rem,2.5vw,1.75rem)] font-normal text-[#1d1d1f] tracking-[-0.02em] leading-snug"
        >
          Découvrez la toute dernière gamme d&apos;iPhone.
        </motion.p>

        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-5 flex flex-wrap items-center justify-center gap-3 md:gap-4"
        >
          <Link
            href="/a-propos"
            className="inline-flex items-center justify-center min-w-[140px] h-[36px] px-5 text-[17px] font-normal text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] active:opacity-80 transition-colors"
          >
            En savoir plus
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center min-w-[140px] h-[36px] px-5 text-[17px] font-normal text-[#0071e3] border border-[#0071e3] rounded-full hover:bg-[#0071e3]/5 active:opacity-80 transition-colors"
          >
            Acheter un iPhone
          </Link>
        </motion.div>
      </div>

      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="relative mx-auto w-full max-w-[980px] mt-8 md:mt-10 px-5 md:px-0"
      >
        <div className="flex justify-center">
          <Image
            src="/iphone-lineup.png"
            alt="Gamme iPhone — plusieurs modèles et coloris"
            width={1200}
            height={630}
            priority
            unoptimized
            sizes="(max-width: 980px) 100vw, 980px"
            draggable={false}
            className="w-full max-w-[980px] h-auto select-none pointer-events-none"
          />
        </div>
      </motion.div>
    </section>
  )
}
