"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Zap, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      let { data } = await supabase
        .from('products')
        .select('*, product_images (image_url)')
        .eq('status', 'available')
        .eq('is_featured', true)
        .limit(6)

      if (!data || data.length === 0) {
        const { data: recentData } = await supabase
          .from('products')
          .select('*, product_images (image_url)')
          .eq('status', 'available')
          .order('created_at', { ascending: false })
          .limit(6)
        data = recentData
      }

      if (data && data.length > 0) {
        setFeaturedProducts(data.map(p => ({
          id: p.id,
          model: p.model_name,
          price: Number(p.price_usd),
          condition: p.condition === 'box' ? 'Neuf' : 'Occasion',
          isNew: p.condition === 'box',
          color: p.color,
          storage: `${p.storage_gb}GB`,
          image: p.product_images?.[0]?.image_url || "/placeholder.svg",
        })))
      }
      setLoading(false)
    }
    fetchFeatured()
  }, [])

  return (
    <div className="flex flex-col bg-[#F5F5F7]">

      {/* ── HERO ───────────────────────────── */}
      <section className="relative min-h-[88svh] flex flex-col items-center justify-center text-center px-5 overflow-hidden">
        
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 border border-black/10 bg-white/50 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-black/50 tracking-[0.1em] uppercase">
              Marketplace iPhone · Kolwezi, RDC
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-[clamp(2.8rem,8vw,5.5rem)] font-bold text-black leading-[1.04] tracking-[-0.03em] mb-6"
          >
            L'iPhone de vos rêves,{" "}
            <span className="text-black/40">
              livré sur WhatsApp.
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="text-[clamp(1rem,2.5vw,1.25rem)] text-black/60 mb-10 max-w-xl mx-auto leading-relaxed"
          >
            iPhones neufs et d'occasion certifiés. Vendeurs vérifiés à Kolwezi. 
            Commandez en quelques secondes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/catalog">
              <button className="h-12 px-8 text-[15px] font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-blue-600/20 flex items-center gap-2 w-full sm:w-auto justify-center">
                Voir le Catalogue
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/login?tab=register">
              <button className="h-12 px-8 text-[15px] font-semibold text-black/70 border border-black/15 bg-white rounded-full hover:text-black hover:border-black/30 hover:bg-zinc-50 active:scale-[0.97] transition-all duration-200 w-full sm:w-auto shadow-sm shadow-black/5">
                Devenir Vendeur
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        >
          <div className="w-[1px] h-8 bg-gradient-to-b from-black/0 via-black/20 to-black/0 animate-pulse" />
        </motion.div>
      </section>

      {/* ── TRUST BADGES ─────────────────── */}
      <section className="bg-white border-y border-black/5">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            {[
              { icon: ShieldCheck, label: "Vendeurs Vérifiés" },
              { icon: MessageCircle, label: "WhatsApp Direct" },
              { icon: Zap, label: "Commande Rapide" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-black/50 hover:text-black/80 transition-colors">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                <span className="text-[13px] font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────── */}
      <section className="py-20 bg-[#F5F5F7]">
        <div className="container mx-auto px-5">
          
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-semibold text-black/40 uppercase tracking-[0.15em] mb-2">
                Sélection
              </p>
              <h2 className="text-[clamp(1.6rem,4vw,2.5rem)] font-bold text-black tracking-[-0.025em] leading-tight">
                Arrivages Récents
              </h2>
            </div>
            <Link href="/catalog" className="flex items-center gap-1.5 text-[13px] font-medium text-black/50 hover:text-black transition-colors group pb-1">
              Tout voir
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            /* Skeleton */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-white/3">
                  <div className="aspect-[3/4] skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-2/3 skeleton rounded-full" />
                    <div className="h-4 w-full skeleton rounded-full" />
                    <div className="h-4 w-1/2 skeleton rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              {/* Mobile : horizontal scroll */}
              <div className="md:hidden -mx-5 px-5">
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                  {featuredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-shrink-0 w-[175px] snap-start"
                    >
                      <Link href={`/product/${product.id}`}>
                        <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm active:scale-[0.97] transition-transform">
                          <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100 p-5 flex flex-col justify-between">
                            <div className="flex justify-between items-start z-10 relative">
                              <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                                product.condition === 'Neuf' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-white/90 text-black/80 backdrop-blur-md'
                              }`}>
                                {product.condition}
                              </div>
                            </div>
                            <img src={product.image} alt={product.model} className="absolute inset-0 object-cover w-full h-full" />
                          </div>
                          <div className="p-4">
                            <p className="text-[10px] text-black/30 uppercase tracking-wider truncate mb-1">
                              {product.color} · {product.storage}
                            </p>
                            <h3 className="text-[13px] font-semibold text-black truncate leading-snug">
                              {product.model}
                            </h3>
                            <p className="text-[16px] font-bold text-black mt-1.5">
                              {product.price}$<span className="text-[11px] font-normal text-black/30 ml-1">USD</span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  <div className="flex-shrink-0 w-[175px] snap-start">
                    <Link 
                      href="/catalog"
                      className="group flex flex-col items-center justify-center gap-3 aspect-[3/4] bg-white border border-black/10 rounded-3xl hover:bg-zinc-50 transition-all shadow-sm"
                    >
                      <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowRight className="h-5 w-5 text-black/50 group-hover:text-black transition-colors" />
                      </div>
                      <span className="text-[14px] font-medium text-black/50 group-hover:text-black transition-colors">
                        Voir tout
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Desktop: grid */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                {featuredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6 }}
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm group">
                        <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100 p-5 flex flex-col justify-between">
                          <div className="flex justify-between items-start z-10 relative">
                            <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                              product.condition === 'Neuf' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-white/90 text-black/80 backdrop-blur-md'
                            }`}>
                              {product.condition}
                            </div>
                          </div>
                          <img src={product.image} alt={product.model} className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] text-black/30 uppercase tracking-wider truncate mb-1">
                            {product.color} · {product.storage}
                          </p>
                          <h3 className="text-[13px] font-semibold text-black truncate leading-snug">
                            {product.model}
                          </h3>
                          <p className="text-[16px] font-bold text-black mt-1.5">
                            {product.price}$<span className="text-[11px] font-normal text-black/30 ml-1">USD</span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-24 text-center">
              <p className="text-black/25 text-[14px]">Aucun produit disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA SELLER ─────────────────────── */}
      <section className="py-24 bg-white border-y border-black/5">
        <div className="container mx-auto px-5">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-[0.15em] mb-3">
                  Pour les professionnels
                </p>
                <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold text-black tracking-[-0.02em] leading-[1.1]">
                  Ouvrez votre store.<br />
                  <span className="text-black/40">Vendez plus.</span>
                </h2>
              </div>
              
              <p className="text-[15px] text-black/60 leading-relaxed max-w-md mx-auto md:mx-0">
                Rejoignez le premier marché digital d'iPhones à Kolwezi. 
                Gérez votre inventaire, recevez les commandes directement sur WhatsApp et développez votre clientèle.
              </p>
              
              <div className="pt-2">
                <Link href="/login?tab=register">
                  <button className="h-12 px-8 text-[15px] font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 active:scale-[0.97] transition-all duration-200 shadow-lg shadow-blue-600/20">
                    Créer mon store gratuitement
                  </button>
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-sm">
              <div className="aspect-square rounded-3xl bg-[#F5F5F7] border border-black/5 relative overflow-hidden flex items-center justify-center p-8 shadow-inner">
                {/* Abstract illustration for seller dashboard */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent" />
                <div className="relative w-full h-full border border-black/10 rounded-xl bg-white shadow-sm flex flex-col overflow-hidden">
                  <div className="h-10 border-b border-black/5 flex items-center px-4 gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-black/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-black/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-black/10" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="h-6 w-1/3 bg-black/5 rounded-md" />
                    <div className="h-24 w-full bg-black/5 rounded-md mt-2" />
                    <div className="flex gap-2 mt-auto">
                      <div className="h-8 flex-1 bg-black/5 rounded-md" />
                      <div className="h-8 flex-1 bg-black/5 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
