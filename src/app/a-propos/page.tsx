"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Apple, ShieldCheck, Zap, Heart, MapPin, MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: "Vendeurs certifiés", value: "...", icon: ShieldCheck },
    { label: "iPhones disponibles", value: "...", icon: Apple },
    { label: "Leads générés", value: "...", icon: Zap },
    { label: "Clients satisfaits", value: "100%", icon: Heart },
  ])

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) {
        setLoading(false)
        return
      }

      const { count: storesCount } = await supabase
        .from("stores")
        .select("*", { count: "exact", head: true })
        .eq("is_verified", true)

      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("status", "available")

      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })

      setStats([
        { label: "Vendeurs certifiés", value: (storesCount || 0).toString(), icon: ShieldCheck },
        { label: "iPhones disponibles", value: (productsCount || 0).toString(), icon: Apple },
        { label: "Leads générés", value: (leadsCount || 0).toString(), icon: Zap },
        { label: "Clients satisfaits", value: "100%", icon: Heart },
      ])
      setLoading(false)
    }

    fetchStats()
  }, [])

  const values = [
    {
      title: "Authenticité garantie",
      description:
        "Chaque iPhone listé par nos vendeurs vérifiés est soumis à une charte de qualité stricte.",
      icon: ShieldCheck,
    },
    {
      title: "Vitesse Kolwezi",
      description:
        "Évitez l'attente des commandes internationales. Achetez localement et récupérez le jour même.",
      icon: Zap,
    },
    {
      title: "Support direct",
      description:
        "Contactez directement le vendeur via WhatsApp pour négocier et finaliser l'achat.",
      icon: MessageSquare,
    },
  ]

  return (
    <div className="flex flex-col bg-[#f5f5f7]">
      <section className="pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="container mx-auto px-5 max-w-[980px] text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[13px] font-medium text-[#0071e3] tracking-tight mb-3">
              À propos
            </p>
            <h1 className="font-sf-display text-[clamp(2.25rem,5.5vw,3.5rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-tight">
              L&apos;excellence Apple,
              <br />
              <span className="text-[#6e6e73]">origine Kolwezi</span>
            </h1>
            <p className="mt-5 text-[17px] text-[#6e6e73] leading-[1.5] tracking-[-0.01em] max-w-2xl mx-auto">
              Apple Store Kolwezi est la première marketplace du Lualaba dédiée à l&apos;écosystème
              Apple — iPhones neufs et d&apos;occasion, vendeurs vérifiés, commande via WhatsApp.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-[14px] text-[#86868b]">
              <MapPin className="h-4 w-4" />
              Kolwezi, République Démocratique du Congo
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white border-y border-black/[0.04] py-14 md:py-16">
        <div className="container mx-auto px-5 max-w-[980px]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center"
              >
                <stat.icon className="h-5 w-5 text-[#0071e3] mx-auto mb-3" strokeWidth={1.5} />
                {loading && stat.value === "..." ? (
                  <div className="h-9 w-14 skeleton rounded-lg mx-auto mb-2" />
                ) : (
                  <p className="font-sf-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">
                    {stat.value}
                  </p>
                )}
                <p className="mt-1 text-[12px] text-[#86868b] font-medium tracking-tight">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-5 max-w-[980px]">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="font-sf-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">
              Pourquoi nous choisir ?
            </h2>
            <p className="mt-3 text-[17px] text-[#6e6e73] max-w-lg mx-auto">
              Une expérience simple, locale et fiable pour acheter ou vendre un iPhone à Kolwezi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-apple p-8 md:p-9 space-y-4"
              >
                <div className="h-11 w-11 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                  <v.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-sf-display text-[19px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                  {v.title}
                </h3>
                <p className="text-[15px] text-[#6e6e73] leading-[1.5]">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-t border-black/[0.04]">
        <div className="container mx-auto px-5 max-w-[980px] text-center">
          <h2 className="font-sf-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em] mb-6">
            Prêt à passer au niveau supérieur ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center h-[44px] px-6 text-[15px] font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors"
            >
              Découvrir le catalogue
            </Link>
            <Link
              href="/login?tab=register"
              className="inline-flex items-center justify-center gap-2 h-[44px] px-6 text-[15px] font-medium text-[#0071e3] border border-[#0071e3] rounded-full hover:bg-[#0071e3]/5 transition-colors"
            >
              Vendre un iPhone
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
