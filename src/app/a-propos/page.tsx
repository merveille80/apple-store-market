"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Apple, ShieldCheck, Zap, Heart, MapPin, MessageSquare, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: "Vendeurs Certifiés", value: "...", icon: ShieldCheck },
    { label: "iPhones Disponibles", value: "...", icon: Apple },
    { label: "Leads Générés", value: "...", icon: Zap },
    { label: "Clients Satisfaits", value: "100%", icon: Heart },
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
        .from('stores')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true)

      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available')

      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })

      setStats([
        { label: "Vendeurs Certifiés", value: (storesCount || 0).toString(), icon: ShieldCheck },
        { label: "iPhones Disponibles", value: (productsCount || 0).toString(), icon: Apple },
        { label: "Leads Générés", value: (leadsCount || 0).toString(), icon: Zap },
        { label: "Clients Satisfaits", value: "100%", icon: Heart },
      ])
      setLoading(false)
    }

    fetchStats()
  }, [])

  const values = [
    {
      title: "Authenticité Garantie",
      description: "Chaque iPhone listé par nos vendeurs vérifiés est soumis à une charte de qualité stricte.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Vitesse Kolwezi",
      description: "Évitez l'attente des commandes internationales. Achetez localement et récupérez le jour même.",
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    {
      title: "Support Direct",
      description: "Contactez directement le vendeur via WhatsApp pour négocier et finaliser l'achat.",
      icon: MessageSquare,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-black">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight mb-8 italic">
              L'excellence Apple, <br />
              <span className="text-blue-500 flex items-center gap-4">
                Origine Kolwezi <MapPin className="h-10 w-10 md:h-16 md:w-16" />
              </span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed mb-10 max-w-2xl">
              Apple Store Kolwezi n'est pas seulement une boutique, c'est la première marketplace haut de gamme du Lualaba dédiée exclusivement à l'écosystème Apple.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="py-20 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-center space-y-2"
              >
                <stat.icon className="h-6 w-6 text-blue-500 mx-auto mb-4" />
                {loading && stat.value === "..." ? (
                  <div className="h-10 w-16 bg-zinc-900 animate-pulse mx-auto rounded-lg" />
                ) : (
                  <p className="text-4xl font-black text-white italic tracking-tighter">{stat.value}</p>
                )}
                <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tight mb-4">Pourquoi nous choisir ?</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2.5rem] bg-zinc-900 border border-white/5 space-y-6"
              >
                <div className={`h-14 w-14 rounded-2xl ${v.bg} flex items-center justify-center ${v.color}`}>
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-tight italic">{v.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tight mb-8">
            Prêt à passer au niveau supérieur ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-zinc-100 h-14 px-10 rounded-2xl font-black text-lg">
                Découvrir le Catalogue
              </Button>
            </Link>
            <Link href="/login?tab=register">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 h-14 px-10 rounded-2xl font-black text-lg">
                Vendre un iPhone <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
