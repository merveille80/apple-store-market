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
  Calendar,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsSkeleton } from "@/components/ui/skeletons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DashboardOverview() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState([
    { name: "Annonces actives", value: "0", icon: Smartphone, color: "text-[#0071e3]", bg: "bg-[#0071e3]/10" },
    { name: "Leads WhatsApp", value: "0", icon: MessageCircle, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { name: "Vues de profil", value: "—", icon: BarChart3, color: "text-[#86868b]", bg: "bg-black/5" },
    { name: "Boosts actifs", value: "0", icon: Zap, color: "text-amber-600", bg: "bg-amber-500/10" },
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

      const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("profile_id", user.id)
        .single()

      if (!store) {
        setLoading(false)
        return
      }

      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id)
        .eq("status", "available")

      const { count: leadsCount } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("store_id", store.id)

      setStats([
        { name: "Annonces actives", value: (productsCount || 0).toString(), icon: Smartphone, color: "text-[#0071e3]", bg: "bg-[#0071e3]/10" },
        { name: "Leads WhatsApp", value: (leadsCount || 0).toString(), icon: MessageCircle, color: "text-emerald-600", bg: "bg-emerald-500/10" },
        { name: "Vues de profil", value: "—", icon: BarChart3, color: "text-[#86868b]", bg: "bg-black/5" },
        { name: "Boosts actifs", value: "0", icon: Zap, color: "text-amber-600", bg: "bg-amber-500/10" },
      ])

      const { data: recent } = await supabase
        .from("products")
        .select(`*, product_images (image_url)`)
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })
        .limit(3)

      setRecentProducts(recent || [])
      setLoading(false)
    }

    fetchDashboardData()
  }, [router])

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">
            Tableau de bord
          </h1>
          <p className="text-[#6e6e73] text-[15px] mt-1">Bienvenue dans votre espace store.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full h-11 px-6 font-medium">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un iPhone
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => <StatsSkeleton key={i} />)
        ) : (
          stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="bg-white border-black/5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#86868b]" />
                  </div>
                  <p className="text-[13px] font-medium text-[#86868b]">{stat.name}</p>
                  <p className="font-sf-display text-3xl font-semibold text-[#1d1d1f] mt-1 tracking-[-0.02em]">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border-black/5 rounded-3xl overflow-hidden shadow-sm">
          <CardHeader className="p-6 border-b border-black/5">
            <CardTitle className="text-[17px] font-semibold text-[#1d1d1f]">Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-black/5">
              {loading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-16 w-full rounded-2xl bg-black/5" />
                  <Skeleton className="h-16 w-full rounded-2xl bg-black/5" />
                </div>
              ) : recentProducts.length === 0 ? (
                <div className="p-12 text-center text-[#6e6e73] text-[15px]">
                  Aucune activité pour le moment.
                </div>
              ) : (
                recentProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/products/${p.id}/edit`}
                    className="p-5 flex items-center justify-between hover:bg-[#f5f5f7] transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-[#f5f5f7] overflow-hidden border border-black/5 flex items-center justify-center">
                        {p.product_images?.[0]?.image_url ? (
                          <img src={p.product_images[0].image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Smartphone className="h-5 w-5 text-[#86868b]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                          {p.model_name}
                        </h4>
                        <div className="flex items-center gap-2 text-[12px] text-[#86868b] mt-0.5">
                          <Calendar className="h-3 w-3" />
                          <span>Ajouté le {new Date(p.created_at).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#1d1d1f]">{p.price_usd}$</p>
                      <p className="text-[11px] text-[#86868b]">
                        {p.status === "available" ? "En vente" : "Vendu"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-black/5 rounded-3xl flex flex-col justify-center text-center p-8 shadow-sm">
          <div className="h-14 w-14 bg-[#0071e3]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Zap className="h-7 w-7 text-[#0071e3]" />
          </div>
          <h3 className="font-sf-display text-[20px] font-semibold text-[#1d1d1f] mb-2">Booster vos ventes</h3>
          <p className="text-[#6e6e73] text-[14px] mb-6 leading-relaxed">
            Mettez vos iPhones en avant pour apparaître en haut du catalogue.
          </p>
          <Button variant="outline" className="border-[#0071e3]/25 text-[#0071e3] hover:bg-[#0071e3] hover:text-white rounded-full h-11">
            Bientôt disponible
          </Button>
        </Card>
      </div>
    </div>
  )
}
