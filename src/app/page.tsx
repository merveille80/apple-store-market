"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ShieldCheck, Zap, MessageCircle, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
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
          condition: p.condition === 'box' ? 'Box / Neuf' : 'Occasion',
          color: p.color,
          image: p.product_images?.[0]?.image_url || "/placeholder.svg",
        })))
      }
      setLoading(false)
    }
    fetchFeatured()
  }, [])

  return (
    <div className="flex flex-col">

      {/* ── HERO MOBILE-FIRST ─────────────────────── */}
      <section className="relative overflow-hidden bg-black pt-8 pb-10 px-4">
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/15 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-blue-900/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="container mx-auto relative z-10 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            
            {/* Badge pill */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-5">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="text-xs font-bold text-blue-400 tracking-wide">Marketplace iPhone • Kolwezi</span>
            </div>

            <h1 className="text-[2.6rem] leading-[1.1] font-black tracking-tight text-white mb-4">
              L'iPhone de<br />vos rêves,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                livré sur WhatsApp.
              </span>
            </h1>

            <p className="text-base text-zinc-400 mb-7 leading-relaxed">
              iPhones neufs et d'occasion certifiés, vendeurs vérifiés à Kolwezi. Commandez en quelques secondes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/catalog" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl h-14 px-8 text-base shadow-xl shadow-blue-600/30"
                >
                  Voir le Catalogue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login?tab=register" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/15 bg-white/5 text-white hover:bg-white/10 rounded-2xl h-14 px-8 text-base font-bold"
                >
                  Devenir Vendeur
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BADGES ────────────────────────────── */}
      <section className="bg-zinc-950 py-5 px-4 border-y border-white/5">
        <div className="container mx-auto">
          <div className="flex items-center justify-around gap-2">
            {[
              { icon: ShieldCheck, text: "Vendeurs Vérifiés" },
              { icon: MessageCircle, text: "WhatsApp Direct" },
              { icon: Zap, text: "Commande Rapide" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                <div className="h-9 w-9 rounded-xl bg-blue-600/10 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-blue-500" />
                </div>
                <span className="text-[10px] font-bold text-zinc-400 leading-tight">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────── */}
      <section className="py-8 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Arrivages Récents</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Meilleures offres à Kolwezi</p>
            </div>
            <Link href="/catalog" className="flex items-center gap-1 text-blue-500 font-bold text-sm">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-zinc-600 text-sm animate-pulse">Chargement...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <>
              {/* Mobile: horizontal scroll */}
              <div className="md:hidden -mx-4 px-4">
                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
                  {featuredProducts.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex-shrink-0 w-[200px] snap-start"
                    >
                      <Link href={`/product/${product.id}`}>
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden active:scale-95 transition-transform">
                          <div className="aspect-square relative overflow-hidden bg-zinc-800">
                            <img
                              src={product.image}
                              alt={product.model}
                              className="object-cover w-full h-full"
                            />
                            <Badge className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 bg-black/60 backdrop-blur-md border-white/20 text-white">
                              {product.condition}
                            </Badge>
                          </div>
                          <div className="p-3">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">{product.color}</p>
                            <h3 className="text-sm font-black text-white truncate leading-tight mt-0.5">{product.model}</h3>
                            <div className="flex items-baseline gap-1 mt-1.5">
                              <span className="text-lg font-black text-blue-500">{product.price}$</span>
                              <span className="text-[10px] text-zinc-600">USD</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                  {/* See all card */}
                  <div className="flex-shrink-0 w-[120px] snap-start">
                    <Link href="/catalog" className="h-full flex">
                      <div className="flex-1 bg-zinc-900/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 min-h-[220px] active:scale-95 transition-transform">
                        <div className="h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-blue-500" />
                        </div>
                        <span className="text-xs font-bold text-blue-500 text-center px-2">Voir tout</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Desktop: grid */}
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product, i) => (
                  <motion.div key={product.id} whileHover={{ y: -8 }} transition={{ duration: 0.25 }}>
                    <Link href={`/product/${product.id}`}>
                      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden group hover:border-blue-500/30 transition-colors">
                        <div className="aspect-[4/3] relative overflow-hidden bg-zinc-800">
                          <img
                            src={product.image}
                            alt={product.model}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          />
                          <Badge className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border-white/20 text-white">
                            {product.condition}
                          </Badge>
                        </div>
                        <div className="p-5">
                          <p className="text-xs text-zinc-500 uppercase tracking-widest">{product.color}</p>
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{product.model}</h3>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-2xl font-black text-blue-500">{product.price}$</span>
                            <span className="text-xs text-zinc-500">USD</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="text-zinc-600 italic text-sm">Aucun produit disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA VENDEUR ─────────────────────────────── */}
      <section className="mx-4 mb-6 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-8 text-center">
        <div className="mb-2">
          <span className="text-3xl">📱</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-3 leading-tight">
          Vous vendez des iPhones ?
        </h2>
        <p className="text-blue-100 mb-6 text-sm leading-relaxed max-w-sm mx-auto">
          Créez votre boutique gratuitement et vendez directement sur WhatsApp à Kolwezi.
        </p>
        <Link href="/login?tab=register">
          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-zinc-100 font-black rounded-2xl h-13 px-8 text-base shadow-xl shadow-blue-900/40 w-full sm:w-auto"
          >
            Créer mon Store Gratuitement
          </Button>
        </Link>
      </section>

    </div>
  )
}
