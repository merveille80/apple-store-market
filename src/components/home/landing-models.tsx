"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion"
import {
  LandingSection,
  SectionHeader,
  fadeUpStagger,
  fadeUpChild,
  landingCtaPrimary,
} from "@/components/home/landing-motion"

export type LandingModel = {
  name: string
  storage: string
  priceFrom: number
  badge: "Disponible" | "Promo" | "Troc possible"
  image: string
}

/** Photos officielles Apple (PNG alpha) — style cohérent front + back */
export const LANDING_MODELS: LandingModel[] = [
  { name: "iPhone XR", storage: "64 Go", priceFrom: 199, badge: "Disponible", image: "/phones/landing/iphone-xr.png" },
  { name: "iPhone 11", storage: "64 Go", priceFrom: 249, badge: "Disponible", image: "/phones/landing/iphone-11.png" },
  { name: "iPhone 12 Pro", storage: "128 Go", priceFrom: 399, badge: "Promo", image: "/phones/landing/iphone-12-pro.png" },
  { name: "iPhone 13 Pro Max", storage: "256 Go", priceFrom: 549, badge: "Disponible", image: "/phones/landing/iphone-13-pro-max.png" },
  { name: "iPhone 14 Pro Max", storage: "256 Go", priceFrom: 699, badge: "Promo", image: "/phones/landing/iphone-14-pro-max.png" },
  { name: "iPhone 15 Pro Max", storage: "256 Go", priceFrom: 899, badge: "Troc possible", image: "/phones/landing/iphone-15-pro-max.png" },
  { name: "iPhone 16 Pro Max", storage: "256 Go", priceFrom: 1099, badge: "Disponible", image: "/phones/landing/iphone-16-pro-max.png" },
  { name: "iPhone 17 Pro Max", storage: "256 Go", priceFrom: 1299, badge: "Disponible", image: "/phones/landing/iphone-17-pro-max.png" },
]

const BADGE_STYLES: Record<LandingModel["badge"], string> = {
  Disponible: "bg-black/[0.02] text-[#1d1d1f] border border-black/[0.06]",
  Promo: "bg-[#0071e3] text-white",
  "Troc possible": "bg-white text-[#0071e3] border border-[#0071e3]/30",
}

const WHATSAPP_BASE = "https://wa.me/243970299448?text="

function modelWhatsApp(name: string) {
  return `${WHATSAPP_BASE}${encodeURIComponent(`Bonjour, je souhaite commander un ${name} chez Apple Store Market.`)}`
}

function ModelCard({ model }: { model: LandingModel }) {
  const cardRef = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 260, damping: 24 })
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 260, damping: 24 })

  // Spotlight qui suit le curseur (en % de la carte)
  const spotX = useTransform(mx, (v) => `${(v + 0.5) * 100}%`)
  const spotY = useTransform(my, (v) => `${(v + 0.5) * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${spotX} ${spotY}, rgba(0,113,227,0.07), transparent 65%)`

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative rounded-[18px] sm:rounded-[22px] bg-white p-3.5 sm:p-5 shadow-[0_4px_18px_-6px_rgba(0,0,0,0.1)] flex flex-col hover:shadow-[0_16px_44px_-12px_rgba(0,0,0,0.2)] transition-shadow duration-300 will-change-transform"
    >
      {/* Spotlight curseur */}
      <motion.div
        aria-hidden
        style={{ background: spotlight }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <div className="relative aspect-[4/5] rounded-2xl bg-black/[0.02] mb-3 sm:mb-4 flex items-center justify-center overflow-hidden px-1 sm:px-2 py-3 sm:py-4">
        {/* Reflet qui balaie l'image au hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 -translate-x-[120%] group-hover:translate-x-[120%] transition-transform duration-[900ms] ease-out bg-gradient-to-r from-transparent via-white/45 to-transparent skew-x-[-18deg]"
        />
        <img
          src={model.image}
          alt={model.name}
          loading="lazy"
          className="max-h-full max-w-full w-auto object-contain transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:-translate-y-1 drop-shadow-[0_12px_28px_rgba(0,0,0,0.14)]"
        />
      </div>
      <span
        className={`inline-flex self-start text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full mb-1.5 sm:mb-2 ${BADGE_STYLES[model.badge]}`}
      >
        {model.badge}
      </span>
      <h3 className="text-[13px] sm:text-[15px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-snug">
        {model.name}
      </h3>
      <p className="text-[11px] sm:text-[13px] text-[#86868b] mt-0.5">{model.storage}</p>
      <p className="mt-2.5 sm:mt-3 text-[16px] sm:text-[20px] font-semibold text-[#1d1d1f] tracking-[-0.03em]">
        {model.priceFrom}$
        <span className="text-[10px] sm:text-[11px] font-normal text-[#86868b] ml-1">USD</span>
      </p>
      <a href={modelWhatsApp(model.name)} className={`mt-3 sm:mt-4 w-full ${landingCtaPrimary}`}>
        Commander
      </a>
    </motion.article>
  )
}

export function LandingModels() {
  return (
    <LandingSection id="iphones" className="bg-white border-t border-black/[0.06]">
      <div className="container-pro section-y !py-12 sm:!py-20">
        <SectionHeader
          eyebrow="Catalogue"
          title="Des iPhones pour tous les budgets."
          description="Du XR au 17 Pro Max — trouvez le modèle adapté à vos besoins et à votre budget."
        />

        <motion.div
          variants={fadeUpStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {LANDING_MODELS.map((model) => (
            <motion.div key={model.name} variants={fadeUpChild}>
              <ModelCard model={model} />
            </motion.div>
          ))}
        </motion.div>

        <p className="text-center mt-8 sm:mt-10">
          <Link href="/catalog" className="link-apple text-[14px] sm:text-[15px]">
            Voir tout le catalogue en ligne →
          </Link>
        </p>
      </div>
    </LandingSection>
  )
}
