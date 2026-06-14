"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Check, Repeat, Truck, ShieldCheck, BadgeCheck, MessageCircle, BatteryCharging } from "lucide-react"

const ITEMS = [
  { icon: BadgeCheck, label: "iPhone 17 Pro Max" },
  { icon: Repeat, label: "Troc accepté" },
  { icon: Truck, label: "Livraison partout en RDC" },
  { icon: Check, label: "Qualité USA Box" },
  { icon: BadgeCheck, label: "iPhone 16 Pro" },
  { icon: ShieldCheck, label: "Garantie vendeur" },
  { icon: Check, label: "Paiement à la livraison" },
  { icon: MessageCircle, label: "Commande WhatsApp en 1 clic" },
  { icon: BatteryCharging, label: "Batteries vérifiées" },
] as const

export function LandingMarquee() {
  const reduceMotion = useReducedMotion()
  return (
    <section
      aria-hidden
      className="relative py-5 sm:py-7 overflow-hidden select-none"
    >
      {/* fondu sur les bords — se fond dans le fond de page */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-[#f5f5f7] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-[#f5f5f7] to-transparent" />

      <motion.div
        className="flex w-max items-center"
        animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {ITEMS.map(({ icon: Icon, label }) => (
              <span
                key={`${copy}-${label}`}
                className="flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 text-[13px] sm:text-[14px] font-medium tracking-[-0.01em] text-[#6e6e73] whitespace-nowrap"
              >
                <Icon className="h-[15px] w-[15px] sm:h-4 sm:w-4 text-[#0071e3] shrink-0" strokeWidth={2.25} />
                {label}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  )
}
