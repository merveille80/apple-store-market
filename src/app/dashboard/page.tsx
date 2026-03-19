"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  Smartphone, 
  MessageCircle, 
  Zap, 
  ArrowUpRight,
  Plus,
  Loader2,
  Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DashboardOverview() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { name: "Annonces Actives", value: "0", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Total Leads WhatsApp", value: "0", icon: MessageCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Vues de Profil", value: "---", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Boosts Actifs", value: "0", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ])
  const [recentProducts, setRecentProducts] = useState<any[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) {
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      // 1. Get Store ID
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (!store) {
        setLoading(false)
        return
      }

      // 2. Fetch Stats
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', store.id)
        .eq('status', 'available')

      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', store.id)

      setStats([
        { name: "Annonces Actives", value: (productsCount || 0).toString(), icon: Smartphone, color: "text-blue-500", bg: "bg-blue-500/10" },
        { name: "Total Leads WhatsApp", value: (leadsCount || 0).toString(), icon: MessageCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { name: "Vues de Profil", value: "---", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" },
        { name: "Boosts Actifs", value: "0", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
      ])

      // 3. Fetch Recent Products
      const { data: recent } = await supabase
        .from('products')
        .select(`
          *,
          product_images (image_url)
        `)
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })
        .limit(3)

      setRecentProducts(recent || [])
      setLoading(false)
    }

    fetchDashboardData()
  }, [router])

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Tableau de Bord</h1>
          <p className="text-zinc-500">Bienvenue dans votre espace store.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-6 font-bold">
            <Plus className="mr-2 h-5 w-5" /> Ajouter un iPhone
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-zinc-900 border-white/5 rounded-3xl group hover:border-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500">{stat.name}</p>
                  {loading ? (
                    <div className="h-9 w-12 bg-zinc-800 animate-pulse rounded-md mt-1" />
                  ) : (
                    <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-zinc-900 border-white/5 rounded-3xl overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5">
            <CardTitle className="text-lg font-bold">Activités Récentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              {loading ? (
                <div className="p-12 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>
              ) : recentProducts.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">Aucune activité pour le moment.</div>
              ) : (
                recentProducts.map((p) => (
                  <div key={p.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-zinc-800 overflow-hidden border border-white/5 flex items-center justify-center text-zinc-600">
                        {p.product_images?.[0]?.image_url ? (
                          <img src={p.product_images[0].image_url} className="w-full h-full object-cover" />
                        ) : (
                          <Smartphone className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{p.model_name}</h4>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Calendar className="h-3 w-3" />
                          <span>Ajouté le {new Date(p.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{p.price_usd}$</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-black">{p.status === 'available' ? 'En vente' : 'Vendu'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-white/5 rounded-3xl flex flex-col justify-center text-center p-8 bg-gradient-to-br from-zinc-900 to-blue-900/20 border-blue-500/10">
          <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40">
            <Zap className="h-8 w-8 text-white fill-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Booster vos ventes</h3>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Mettez vos iPhones en avant pour apparaître en haut du catalogue et multipliez vos contacts par 5.
          </p>
          <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white rounded-xl h-12">
            Bientôt disponible
          </Button>
        </Card>
      </div>
    </div>
  )
}
