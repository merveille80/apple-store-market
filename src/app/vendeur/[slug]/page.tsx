"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Store, 
  MapPin, 
  MessageSquare, 
  ChevronLeft,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ProductCard } from "@/components/product-card"

export default function StoreDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [store, setStore] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStoreData() {
      setLoading(true)
      const supabase = createClient()
      if (!supabase || !slug) return

      // Fetch store
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single()

      if (storeError || !storeData) {
        setStore(null)
        setLoading(false)
        return
      }

      setStore(storeData)

      // Fetch store products
      const { data: productsData } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*)
        `)
        .eq('store_id', storeData.id)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      setProducts(productsData || [])
      setLoading(false)
    }

    fetchStoreData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F5F5F7]">
        <Loader2 className="h-12 w-12 text-[#0071e3] animate-spin" />
        <p className="text-black/50 animate-pulse">Chargement de la boutique...</p>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F5F5F7]">
        <h1 className="font-sf-display text-2xl font-semibold text-[#1d1d1f] tracking-[-0.02em]">Boutique non trouvée</h1>
        <Link href="/vendeurs">
          <Button className="bg-[#0071e3] text-white font-medium rounded-full h-11 px-6 hover:bg-[#0077ed]">Voir tous les vendeurs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 bg-[#F5F5F7]">
      {/* Hero Header */}
      <div className="relative h-64 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0071e3]/8 to-transparent" />
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
           <Link href="/vendeurs" className="absolute top-8 left-4 inline-flex items-center transition-colors text-[#86868b] hover:text-[#0071e3]">
            <ChevronLeft className="mr-1 h-4 w-4" /> Tous les vendeurs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6 relative z-10">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-white shadow-[0_8px_28px_-8px_rgba(0,0,0,0.18)] flex items-center justify-center overflow-hidden shrink-0">
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="h-10 w-10 text-black/20" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">{store.name}</h1>
                {store.is_verified && (
                  <Badge className="bg-[#0071e3] text-white border-none gap-1 px-3 py-1 rounded-full text-[11px] font-medium">
                    <CheckCircle2 className="h-3 w-3" /> Vérifié
                  </Badge>
                )}
              </div>
              <p className="max-w-2xl text-sm md:text-base line-clamp-2 text-[#6e6e73]">
                {store.description || "Aucune description fournie par le vendeur."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 bg-white p-6 flex items-center gap-4 rounded-3xl shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]">
            <div className="h-12 w-12 rounded-2xl bg-black/5 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-black/50" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-tight mb-0.5 text-[#86868b]">Localisation</p>
              <p className="font-medium text-[15px] text-[#1d1d1f]">{store.city || 'Kolwezi'}, RDC</p>
            </div>
          </Card>
          
          <Card className="border-0 bg-white p-6 flex items-center gap-4 rounded-3xl shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-tight mb-0.5 text-[#86868b]">Contact direct</p>
              <p className="font-medium text-[15px] text-emerald-600">{store.whatsapp_number}</p>
            </div>
          </Card>
          
          <Card className="border-0 bg-white p-6 flex items-center gap-4 rounded-3xl shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]">
            <div className="h-12 w-12 rounded-2xl bg-[#0071e3]/10 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-[#0071e3]" />
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-tight mb-0.5 text-[#86868b]">Stock actuel</p>
              <p className="font-medium text-[15px] text-[#1d1d1f]">{products.length} iPhone{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-sf-display text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f]">Catalogue de {store.name}</h2>
            <p className="text-sm text-[#86868b]">{products.length} annonces</p>
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-white shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]">
              <Smartphone className="h-12 w-12 text-black/20 mx-auto mb-4" />
              <p className="text-[#6e6e73] text-[15px]">Ce vendeur n&apos;a pas encore de produits en ligne.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  model={product.model_name}
                  price={Number(product.price_usd)}
                  storage={`${product.storage_gb} Go`}
                  color={product.color}
                  image={product.product_images?.[0]?.image_url || "/placeholder.svg"}
                  isNew={product.condition === "box"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
