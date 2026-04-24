"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, MapPin, Phone, MessageSquare, Store, Loader2, ArrowRight, Smartphone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { StoreCardSkeleton } from "@/components/ui/skeletons"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function VendeursPage() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(true)

  useEffect(() => {
    async function fetchStores() {
      setLoading(true)
      const supabase = createClient()
      
      if (!supabase) {
        setIsConfigured(false)
        setStores([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          products (count)
        `)
        .order('is_verified', { ascending: false })
        .order('name')

      if (error || !data) {
        setStores([])
      } else {
        const formatted = data.map(s => ({
          id: s.id,
          name: s.name,
          city: s.city || "Kolwezi",
          listings: s.products?.[0]?.count || 0,
          verified: s.is_verified,
          whatsapp: s.whatsapp_number,
          logo: s.logo_url || null,
          slug: s.slug
        }))
        setStores(formatted)
      }
      setLoading(false)
    }

    fetchStores()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-3xl mb-16">
          <Skeleton className="h-12 w-64 mb-4" />
          <Skeleton className="h-6 w-full max-w-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <StoreCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="max-w-3xl mb-16">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl lg:text-5xl font-black text-black tracking-tight italic">Nos Vendeurs</h1>
          {!isConfigured && (
            <Badge variant="outline" className="border-amber-500/50 text-amber-500 px-3 py-1 text-[10px] uppercase bg-amber-500/5">
              Mode Démo
            </Badge>
          )}
        </div>
        <p className="text-xl text-black/60 leading-relaxed">
          Travailler avec des professionnels certifiés. Découvrez les meilleurs vendeurs d'iPhones à Kolwezi.
        </p>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stores.map((store, index) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white border-black/5 shadow-sm rounded-[2.5rem] overflow-hidden group hover:border-blue-500/30 transition-all duration-500">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-zinc-50 border border-black/5 flex items-center justify-center text-zinc-400 overflow-hidden shadow-sm">
                    {store.logo ? (
                      <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                    ) : (
                      <Store className="h-8 w-8 text-zinc-400" />
                    )}
                  </div>
                  {store.verified ? (
                    <Badge className="bg-blue-600 text-white border-none rounded-full px-3 py-1 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
                      <ShieldCheck className="h-3 w-3" /> Vérifié
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-black/50 border-black/10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                      En attente
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight italic">
                  {store.name}
                </h3>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-2 text-sm text-black/50">
                    <MapPin className="h-4 w-4 text-black/30" /> {store.city}, RDC
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/50">
                    <Smartphone className="h-4 w-4 text-black/30" /> {store.listings} Annonces actives
                  </div>
                </div>

                <div className="pt-6 border-t border-black/5 flex items-center justify-between">
                   <div className="flex gap-2">
                    <a 
                      href={`https://wa.me/${store.whatsapp.replace(/\D/g, '')}`} 
                      target="_blank"
                      className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/5"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                  <Link href={`/vendeur/${store.slug}`}>
                    <Button variant="ghost" className="text-black hover:bg-black/5 group/btn rounded-xl font-bold italic text-sm">
                      Voir Boutique <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {stores.length === 0 && !loading && (
        <div className="py-20 text-center">
          <p className="text-black/50">Aucun vendeur certifié pour le moment.</p>
        </div>
      )}
    </div>
  )
}
