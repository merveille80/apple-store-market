"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "framer-motion"
import { ShieldCheck, MessageCircle } from "lucide-react"

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
    <section className="relative bg-black/[0.02] overflow-hidden">
      <div className="container-pro pt-8 sm:pt-12 md:pt-16 pb-0 text-center">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-[12px] sm:text-[13px] font-medium text-[#0071e3] tracking-tight mb-3 sm:mb-4"
        >
          Marketplace iPhone · Kolwezi, RDC
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-sf-display text-[clamp(1.75rem,7.5vw,3.75rem)] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-[1.08] max-w-[720px] mx-auto px-1"
        >
          L&apos;iPhone que vous voulez.
          <br />
          <span className="text-[#86868b]">Commandé en un clic.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-[#6e6e73] leading-[1.5] max-w-[480px] mx-auto tracking-[-0.01em] px-2"
        >
          Vendeurs vérifiés, prix clairs, commande directe sur WhatsApp.
          Remise à Kolwezi.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-[320px] sm:max-w-none mx-auto sm:mx-0 px-4 sm:px-0"
        >
          <Link href="/catalog" className="btn-buy w-full sm:w-auto sm:min-w-[200px]">
            Voir le catalogue
          </Link>
          <Link
            href="/login?tab=register"
            className="inline-flex items-center justify-center w-full sm:w-auto sm:min-w-[200px] min-h-[48px] sm:h-11 px-6 text-[15px] sm:text-[15px] font-medium text-[#0071e3] border border-[#0071e3]/40 rounded-full hover:bg-[#0071e3]/5 transition-colors active:scale-[0.98]"
          >
            Ouvrir mon store
          </Link>
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[13px] text-[#86868b] px-4"
        >
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#0071e3] shrink-0" strokeWidth={2} />
            Vendeurs certifiés
          </span>
          <span className="inline-flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-[#25d366] shrink-0" strokeWidth={2} />
            WhatsApp instantané
          </span>
        </motion.div>
      </div>

      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="container-pro mt-8 sm:mt-10 md:mt-14 pb-2 sm:pb-4"
      >
        <div className="flex justify-center -mx-2 sm:mx-0">
          <Image
            src="/iphone-lineup.png"
            alt="Gamme iPhone — plusieurs modèles et coloris"
            width={1200}
            height={630}
            priority
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1060px) 100vw, 1060px"
            draggable={false}
            className="w-full max-w-[900px] h-auto select-none pointer-events-none"
          />
        </div>
      </motion.div>
    </section>
  )
}
