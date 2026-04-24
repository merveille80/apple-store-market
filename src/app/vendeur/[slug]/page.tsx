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
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <p className="text-black/50 animate-pulse">Chargement de la boutique...</p>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[#F5F5F7]">
        <h1 className="text-2xl font-bold text-black">Boutique non trouvée</h1>
        <Link href="/vendeurs">
          <Button className="bg-blue-600 text-white font-bold rounded-xl h-12 px-6">Voir tous les vendeurs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 bg-[#F5F5F7]">
      {/* Hero Header */}
      <div className="relative h-64 border-b border-black/5 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
           <Link href="/vendeurs" className="absolute top-8 left-4 inline-flex items-center transition-colors text-black/50 hover:text-blue-600">
            <ChevronLeft className="mr-1 h-4 w-4" /> Tous les vendeurs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6 relative z-10">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl border border-black/5 bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0">
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="h-10 w-10 text-black/20" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-black">{store.name}</h1>
                {store.is_verified && (
                  <Badge className="bg-blue-600 text-white border-none gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    <CheckCircle2 className="h-3 w-3" /> Vérifié
                  </Badge>
                )}
              </div>
              <p className="max-w-2xl text-sm md:text-base line-clamp-2 text-black/60">
                {store.description || "Aucune description fournie par le vendeur."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border border-black/5 bg-white p-6 flex items-center gap-4 shadow-sm">
            <div className="h-12 w-12 rounded-2xl bg-black/5 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-black/50" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-black/40">Localisation</p>
              <p className="font-bold text-sm text-black">{store.city || 'Kolwezi'}, RDC</p>
            </div>
          </Card>
          
          <Card className="border border-black/5 bg-white p-6 flex items-center gap-4 shadow-sm">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-black/40">Contact Direct</p>
              <p className="font-bold text-sm text-emerald-600">{store.whatsapp_number}</p>
            </div>
          </Card>
          
          <Card className="border border-black/5 bg-white p-6 flex items-center gap-4 shadow-sm">
            <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-black/40">Stock Actuel</p>
              <p className="font-bold text-sm text-black">{products.length} iPhones disponibles</p>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-black">Le Catalogue de {store.name}</h2>
            <p className="text-sm text-black/50">{products.length} annonces</p>
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center rounded-3xl border border-dashed border-black/10 bg-white">
              <Smartphone className="h-12 w-12 text-black/20 mx-auto mb-4" />
              <p className="text-black/50">Ce vendeur n'a pas encore de produits en ligne.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="group">
                  <div className="bg-white border border-black/5 rounded-2xl md:rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-sm">
                    <div className="aspect-square relative overflow-hidden bg-zinc-100">
                      <img 
                        src={product.product_images?.[0]?.image_url || "/placeholder.svg"} 
                        alt={product.model_name}
                        className="absolute inset-0 object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className={`absolute top-2 right-2 md:top-3 md:right-3 font-black text-white text-[10px] md:text-xs px-2 py-0.5 border-0 shadow-lg ${product.condition === 'box' ? 'bg-blue-600' : 'bg-black/60 backdrop-blur-md'}`}>
                        {product.condition === 'box' ? '✦ Box / Neuf' : 'Occasion'}
                      </Badge>
                    </div>
                    <div className="p-3 md:p-5">
                      <h3 className="font-bold text-sm md:text-base mb-1 truncate text-black">{product.model_name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-600 font-black text-lg md:text-xl">{product.price_usd}$</span>
                        <span className="text-[10px] md:text-xs font-bold text-black/50">{product.storage_gb}GB</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
