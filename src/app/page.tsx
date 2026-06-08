"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Zap, MessageCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { HeroSection } from "@/components/home/hero-section"
import { SellerStoreGuide } from "@/components/home/seller-store-guide"
import { ProductCard } from "@/components/product-card"

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
    <div className="flex flex-col bg-[#f5f5f7]">

      <HeroSection />

      {/* ── TRUST BADGES ─────────────────── */}
      <section className="bg-white border-y border-black/[0.04]">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-center gap-10 md:gap-20 flex-wrap">
            {[
              { icon: ShieldCheck, label: "Vendeurs vérifiés" },
              { icon: MessageCircle, label: "WhatsApp direct" },
              { icon: Zap, label: "Commande rapide" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[#86868b] hover:text-[#1d1d1f] transition-colors">
                <Icon className="h-[15px] w-[15px]" strokeWidth={1.5} />
                <span className="text-[13px] font-medium tracking-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────── */}
      <section className="py-20 md:py-28 bg-[#f5f5f7]">
        <div className="container mx-auto px-5">
          
          {/* Section header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[13px] font-medium text-[#0071e3] tracking-tight mb-2">
                Sélection du moment
              </p>
              <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-tight">
                Arrivages récents
              </h2>
            </div>
            <Link href="/catalog" className="link-apple flex items-center gap-1 text-[15px] group pb-1">
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
                      <ProductCard
                        id={product.id}
                        model={product.model}
                        price={product.price}
                        storage={product.storage}
                        color={product.color}
                        image={product.image}
                        isNew={product.isNew}
                        conditionLabel={product.condition}
                      />
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
                    <ProductCard
                      id={product.id}
                      model={product.model}
                      price={product.price}
                      storage={product.storage}
                      color={product.color}
                      image={product.image}
                      isNew={product.isNew}
                      conditionLabel={product.condition}
                    />
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
      <section className="py-24 md:py-32 bg-white border-y border-black/[0.04]">
        <div className="container mx-auto px-5">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center gap-12 md:gap-16">
            
            <div className="flex-1 space-y-7 text-center md:text-left">
              <div>
                <p className="text-[13px] font-medium text-[#0071e3] tracking-tight mb-3">
                  Pour les professionnels
                </p>
                <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.04em] leading-[1.08]">
                  Ouvrez votre store.
                  <br />
                  <span className="text-[#86868b]">Vendez plus.</span>
                </h2>
              </div>
              
              <p className="text-[17px] text-[#6e6e73] leading-[1.5] tracking-[-0.01em] max-w-md mx-auto md:mx-0">
                Rejoignez le premier marché digital d'iPhones à Kolwezi.
                Gérez votre inventaire et recevez les commandes sur WhatsApp.
              </p>
              
              <div className="pt-1">
                <Link href="/login?tab=register" className="btn-apple">
                  Créer mon store
                </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full flex justify-center md:justify-end">
              <SellerStoreGuide />
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
