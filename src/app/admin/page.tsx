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
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { name: "Vendeurs", value: "0", icon: Users, color: "text-blue-500" },
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
        { name: "Vendeurs", value: (storesCount || 0).toString(), icon: Users, color: "text-blue-500" },
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
        <h1 className="text-3xl font-black text-white tracking-tight italic">Platform Overview</h1>
        <p className="text-zinc-500">Statistiques globales et activités récentes sur ASK Market.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-zinc-900 border-white/5 rounded-3xl">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-sm font-medium text-zinc-500">{stat.name}</p>
                <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-zinc-900 border-white/5 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" /> Vendeurs à valider
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-white/5">
                {loading ? (
                  <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-zinc-700" /></div>
                ) : pendingStores.length === 0 ? (
                  <p className="p-10 text-center text-zinc-500 text-sm">Aucun vendeur en attente.</p>
                ) : (
                  pendingStores.map((store) => (
                    <div key={store.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center">
                          <Users className="h-4 w-4 text-zinc-600" />
                        </div>
                        <div>
                          <p className="font-bold text-white leading-none mb-1">{store.name}</p>
                          <p className="text-xs text-zinc-500">{store.city || "Kolwezi"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => approveStore(store.id)}
                          className="text-xs font-bold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
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

        <Card className="bg-zinc-900 border-white/5 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Annonces Récentes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-white/5">
                {loading ? (
                  <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-zinc-700" /></div>
                ) : recentProducts.length === 0 ? (
                  <p className="p-10 text-center text-zinc-500 text-sm">Aucune annonce récente.</p>
                ) : (
                  recentProducts.map((product) => (
                    <div key={product.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-white/5 flex items-center justify-center">
                          <Smartphone className="h-5 w-5 text-zinc-600" />
                        </div>
                        <div>
                          <p className="font-bold text-white leading-none mb-1 uppercase text-sm tracking-tight">{product.model_name}</p>
                          <p className="text-[10px] text-zinc-500 font-medium">Par {product.stores?.name || "Vendeur"}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-600 uppercase">
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
