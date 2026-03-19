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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="text-zinc-500 animate-pulse">Chargement de la boutique...</p>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold text-white">Boutique non trouvée</h1>
        <Link href="/vendeurs">
          <Button className="bg-blue-600">Voir tous les vendeurs</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-64 bg-zinc-900 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8">
           <Link href="/vendeurs" className="absolute top-8 left-4 inline-flex items-center text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="mr-1 h-4 w-4" /> Tous les vendeurs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-black border-2 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden shrink-0">
              {store.logo_url ? (
                <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="h-12 w-12 text-zinc-700" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">{store.name}</h1>
                {store.is_verified && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 gap-1 px-4 py-1.5 rounded-full">
                    <CheckCircle2 className="h-4 w-4" /> Vérifié
                  </Badge>
                )}
              </div>
              <p className="text-zinc-400 max-w-2xl text-sm md:text-base line-clamp-2">
                {store.description || "Aucune description fournie par le vendeur."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-zinc-900/50 border-white/5 p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Localisation</p>
              <p className="text-white font-medium">{store.city || 'Kolwezi'}, RDC</p>
            </div>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Contact Direct</p>
              <p className="text-emerald-400 font-bold">{store.whatsapp_number}</p>
            </div>
          </Card>
          <Card className="bg-zinc-900/50 border-white/5 p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Stock Actuel</p>
              <p className="text-white font-bold">{products.length} iPhones disponibles</p>
            </div>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white tracking-tight">Le Catalogue de {store.name}</h2>
            <p className="text-sm text-zinc-500">{products.length} annonces</p>
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center bg-zinc-900/30 rounded-3xl border border-dashed border-white/5">
              <Smartphone className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">Ce vendeur n'a pas encore de produits en ligne.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`} className="group">
                  <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden bg-zinc-950">
                      <img 
                        src={product.product_images?.[0]?.image_url || "/placeholder.svg"} 
                        alt={product.model_name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border hover:bg-black/80">
                        {product.condition === 'box' ? 'Box' : 'Occasion'}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-white text-lg mb-1 truncate">{product.model_name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-500 font-black text-xl">{product.price_usd}$</span>
                        <span className="text-xs text-zinc-500 font-bold">{product.storage_gb}GB</span>
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
