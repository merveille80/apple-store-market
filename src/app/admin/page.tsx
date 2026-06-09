"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Smartphone, 
  MessageSquare, 
  TrendingUp,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsSkeleton } from "@/components/ui/skeletons"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { name: "Vendeurs", value: "0", icon: Users, color: "text-[#0071e3]" },
    { name: "Produits en Ligne", value: "0", icon: Smartphone, color: "text-purple-500" },
    { name: "Total Leads", value: "0", icon: MessageSquare, color: "text-emerald-500" },
    { name: "Ventes Estimées", value: "0$", icon: TrendingUp, color: "text-yellow-500" },
  ])
  const [pendingStores, setPendingStores] = useState<any[]>([])
  const [recentProducts, setRecentProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAdminData() {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) {
        setLoading(false)
        return
      }

      // 1. Fetch Stats
      const { count: storesCount } = await supabase.from('stores').select('*', { count: 'exact', head: true })
      const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'available')
      const { count: leadsCount } = await supabase.from('leads').select('*', { count: 'exact', head: true })
      
      setStats([
        { name: "Vendeurs", value: (storesCount || 0).toString(), icon: Users, color: "text-[#0071e3]" },
        { name: "Produits en Ligne", value: (productsCount || 0).toString(), icon: Smartphone, color: "text-purple-500" },
        { name: "Total Leads", value: (leadsCount || 0).toString(), icon: MessageSquare, color: "text-emerald-500" },
        { name: "Ventes Estimées", value: `${(productsCount || 0) * 800}$`, icon: TrendingUp, color: "text-yellow-500" },
      ])

      // 2. Fetch Pending Stores
      const { data: pending } = await supabase
        .from('stores')
        .select('*')
        .eq('is_verified', false)
        .limit(5)
      setPendingStores(pending || [])

      // 3. Fetch Recent Products
      const { data: recent } = await supabase
        .from('products')
        .select(`
          *,
          stores (name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentProducts(recent || [])

      setLoading(false)
    }

    fetchAdminData()
  }, [])

  const approveStore = async (id: string) => {
    const supabase = createClient()
    if (!supabase) return

    const { error } = await supabase
      .from('stores')
      .update({ is_verified: true })
      .eq('id', id)

    if (error) {
      toast.error("Erreur lors de l'approbation")
    } else {
      toast.success("Boutique approuvée !")
      setPendingStores(pendingStores.filter(s => s.id !== id))
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">Vue d&apos;ensemble</h1>
        <p className="text-[#6e6e73] text-[15px] mt-1">Statistiques globales et activités récentes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => <StatsSkeleton key={i} />)
        ) : (
          stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-white border-black/5 shadow-sm rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className={`p-2 rounded-lg bg-black/5 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="text-sm font-medium text-black/50">{stat.name}</p>
                  <p className="font-sf-display text-3xl font-semibold text-[#1d1d1f] mt-1 tracking-[-0.02em]">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white border-black/5 shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="text-[17px] font-semibold flex items-center gap-2 text-[#1d1d1f]">
              <Clock className="h-5 w-5 text-[#0071e3]" /> Vendeurs à valider
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-black/5">
                {loading ? (
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-16 w-full rounded-2xl" />
                    <Skeleton className="h-16 w-full rounded-2xl" />
                  </div>
                ) : pendingStores.length === 0 ? (
                  <p className="p-10 text-center text-black/50 text-sm">Aucun vendeur en attente.</p>
                ) : (
                  pendingStores.map((store) => (
                    <div key={store.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-50 border border-black/5 flex items-center justify-center">
                          <Users className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-bold text-black leading-none mb-1">{store.name}</p>
                          <p className="text-xs text-black/50">{store.city || "Kolwezi"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => approveStore(store.id)}
                          className="text-xs font-medium px-4 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full transition-colors"
                        >
                          Approuver
                        </button>
                      </div>
                    </div>
                  ))
                )}
             </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/5 shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-black">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Annonces Récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-black/5">
                {loading ? (
                  <div className="p-6 space-y-4">
                     <Skeleton className="h-16 w-full rounded-2xl" />
                     <Skeleton className="h-16 w-full rounded-2xl" />
                  </div>
                ) : recentProducts.length === 0 ? (
                  <p className="p-10 text-center text-black/50 text-sm">Aucune annonce récente.</p>
                ) : (
                  recentProducts.map((product) => (
                    <div key={product.id} className="p-6 flex items-center justify-between hover:bg-black/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-zinc-50 border border-black/5 flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1d1d1f] leading-none mb-1 text-sm tracking-tight">{product.model_name}</p>
                          <p className="text-[10px] text-black/50 font-medium">Par {product.stores?.name || "Vendeur"}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#86868b]">
                        {new Date(product.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
