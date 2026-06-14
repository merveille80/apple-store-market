"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Smartphone,
  MessageCircle,
  Plus,
  Calendar,
  Wallet,
  Package,
  Bell,
  TrendingUp,
  Clock,
  Flame,
  ArrowUpRight,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsSkeleton } from "@/components/ui/skeletons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { SalesChart, type MonthlyPoint } from "@/components/dashboard/sales-chart"

type Product = {
  id: string
  model_name: string
  price_usd: number
  status: string
  stock_quantity: number | null
  created_at: string
  updated_at: string
  product_images?: { image_url: string }[]
}

type Lead = {
  id: string
  status: string
  created_at: string
  customer_name: string | null
  customer_phone: string | null
  product_id: string | null
  products?: { model_name: string } | null
}

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : n.toString()

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"]

function waReply(phone: string | null, model: string | null) {
  const clean = (phone || "").replace(/[^0-9]/g, "")
  const text = encodeURIComponent(
    `Bonjour 👋, merci pour votre intérêt${model ? ` pour le ${model}` : ""} chez Apple Store Market. Est-il toujours disponible pour vous ?`
  )
  return `https://wa.me/${clean}?text=${text}`
}

export default function DashboardOverview() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [leads, setLeads] = useState<Lead[]>([])

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

      const [{ data: prods }, { data: lds }] = await Promise.all([
        supabase
          .from("products")
          .select("id, model_name, price_usd, status, stock_quantity, created_at, updated_at, product_images (image_url)")
          .eq("store_id", store.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("leads")
          .select("id, status, created_at, customer_name, customer_phone, product_id, products (model_name)")
          .eq("store_id", store.id)
          .order("created_at", { ascending: false }),
      ])

      setProducts((prods as Product[]) || [])
      setLeads((lds as unknown as Lead[]) || [])
      setLoading(false)
    }

    fetchDashboardData()
  }, [router])

  // ---- Dérivés métier ----
  const available = products.filter((p) => p.status === "available")
  const sold = products.filter((p) => p.status === "sold")

  const stockValue = available.reduce((s, p) => s + Number(p.price_usd) * (p.stock_quantity || 1), 0)
  const revenue = sold.reduce((s, p) => s + Number(p.price_usd), 0)
  const newLeads = leads.filter((l) => l.status === "new")
  const closedLeads = leads.filter((l) => l.status === "closed")
  const conversion = leads.length > 0 ? Math.round((closedLeads.length / leads.length) * 100) : 0

  // CA des 6 derniers mois (basé sur updated_at des produits vendus)
  const now = new Date()
  const monthly: MonthlyPoint[] = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { month: MONTHS_FR[d.getMonth()], revenue: 0, units: 0, _k: `${d.getFullYear()}-${d.getMonth()}` }
  }) as (MonthlyPoint & { _k: string })[]
  sold.forEach((p) => {
    const d = new Date(p.updated_at || p.created_at)
    const k = `${d.getFullYear()}-${d.getMonth()}`
    const bucket = (monthly as (MonthlyPoint & { _k: string })[]).find((m) => m._k === k)
    if (bucket) {
      bucket.revenue += Number(p.price_usd)
      bucket.units += 1
    }
  })

  // Top modèles demandés (par nombre de leads)
  const demandMap = new Map<string, number>()
  leads.forEach((l) => {
    const name = l.products?.model_name
    if (name) demandMap.set(name, (demandMap.get(name) || 0) + 1)
  })
  const topDemanded = [...demandMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
  const maxDemand = topDemanded[0]?.[1] || 1

  // Stock vieillissant : disponible depuis > 30 jours
  const agingStock = available
    .filter((p) => (now.getTime() - new Date(p.created_at).getTime()) / 86400000 > 30)
    .map((p) => ({ ...p, days: Math.floor((now.getTime() - new Date(p.created_at).getTime()) / 86400000) }))
    .sort((a, b) => b.days - a.days)
    .slice(0, 4)

  const recentProducts = products.slice(0, 3)

  const stats = [
    { name: "Annonces actives", value: available.length.toString(), icon: Smartphone, color: "text-[#0071e3]", bg: "bg-[#0071e3]/10" },
    { name: "Valeur du stock", value: `$${fmt(Math.round(stockValue))}`, icon: Package, color: "text-violet-600", bg: "bg-violet-500/10" },
    { name: "CA réalisé", value: `$${fmt(Math.round(revenue))}`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { name: "Leads à relancer", value: newLeads.length.toString(), icon: Bell, color: "text-amber-600", bg: "bg-amber-500/10", highlight: newLeads.length > 0 },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">
            Tableau de bord
          </h1>
          <p className="text-[#6e6e73] text-[15px] mt-1">Pilotez vos ventes et vos clients en un coup d&apos;œil.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full h-11 px-6 font-medium">
            <Plus className="mr-2 h-4 w-4" /> Ajouter un iPhone
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => <StatsSkeleton key={i} />)
        ) : (
          stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className={`bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow ${stat.highlight ? "ring-2 ring-amber-400/40 border-amber-200" : "border-black/5"}`}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className={`p-2.5 sm:p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    {stat.highlight && (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        À traiter
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] sm:text-[13px] font-medium text-[#86868b]">{stat.name}</p>
                  <p className="font-sf-display text-2xl sm:text-3xl font-semibold text-[#1d1d1f] mt-1 tracking-[-0.02em]">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Chart + Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 bg-white border-black/5 rounded-3xl shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-0 flex-row items-center justify-between">
            <CardTitle className="text-[16px] sm:text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#0071e3]" /> Chiffre d&apos;affaires
            </CardTitle>
            <span className="text-[12px] text-[#86868b]">6 derniers mois</span>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            {loading ? (
              <Skeleton className="h-[240px] w-full rounded-2xl bg-black/5" />
            ) : (
              <SalesChart data={monthly} />
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-black/5 rounded-3xl shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-2">
            <CardTitle className="text-[16px] sm:text-[17px] font-semibold text-[#1d1d1f]">Conversion clients</CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-2 space-y-5">
            <div>
              <div className="flex items-end gap-2">
                <span className="font-sf-display text-4xl font-semibold text-[#1d1d1f] tracking-[-0.02em]">{conversion}%</span>
                <span className="text-[13px] text-[#86868b] mb-1.5">de leads conclus</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-black/[0.06] overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${conversion}%` }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Nouveaux", val: newLeads.length, c: "text-amber-600" },
                { label: "En cours", val: leads.filter((l) => l.status === "contacted").length, c: "text-[#0071e3]" },
                { label: "Conclus", val: closedLeads.length, c: "text-emerald-600" },
              ].map((b) => (
                <div key={b.label} className="rounded-2xl bg-[#f5f5f7] py-3">
                  <p className={`font-sf-display text-xl font-semibold ${b.c}`}>{b.val}</p>
                  <p className="text-[11px] text-[#86868b] mt-0.5">{b.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads à relancer + Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Leads à relancer — actionnable */}
        <Card className="lg:col-span-2 bg-white border-black/5 rounded-3xl overflow-hidden shadow-sm">
          <CardHeader className="p-5 sm:p-6 border-b border-black/5 flex-row items-center justify-between">
            <CardTitle className="text-[16px] sm:text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-500" /> Clients à relancer
            </CardTitle>
            <Link href="/dashboard/leads" className="text-[13px] text-[#0071e3] hover:underline">Tout voir</Link>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-14 w-full rounded-2xl bg-black/5" />
                <Skeleton className="h-14 w-full rounded-2xl bg-black/5" />
              </div>
            ) : newLeads.length === 0 ? (
              <div className="p-10 text-center text-[#6e6e73] text-[14px]">
                🎉 Aucun lead en attente. Vous êtes à jour !
              </div>
            ) : (
              <div className="divide-y divide-black/5">
                {newLeads.slice(0, 5).map((l) => (
                  <div key={l.id} className="p-4 sm:p-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="font-medium text-[#1d1d1f] truncate">{l.customer_name || "Client anonyme"}</h4>
                      <p className="text-[12px] text-[#86868b] mt-0.5 truncate">
                        Intéressé par {l.products?.model_name || "un iPhone"} · {new Date(l.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <a
                      href={waReply(l.customer_phone, l.products?.model_name ?? null)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-medium transition-colors"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Répondre
                    </a>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activité récente (préservée) */}
        <Card className="bg-white border-black/5 rounded-3xl overflow-hidden shadow-sm">
          <CardHeader className="p-5 sm:p-6 border-b border-black/5">
            <CardTitle className="text-[16px] sm:text-[17px] font-semibold text-[#1d1d1f]">Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-black/5">
              {loading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-14 w-full rounded-2xl bg-black/5" />
                  <Skeleton className="h-14 w-full rounded-2xl bg-black/5" />
                </div>
              ) : recentProducts.length === 0 ? (
                <div className="p-10 text-center text-[#6e6e73] text-[14px]">
                  Aucune activité pour le moment.
                </div>
              ) : (
                recentProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/products/${p.id}/edit`}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-[#f5f5f7] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-[#f5f5f7] overflow-hidden border border-black/5 flex items-center justify-center shrink-0">
                        {p.product_images?.[0]?.image_url ? (
                          <img src={p.product_images[0].image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Smartphone className="h-5 w-5 text-[#86868b]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors truncate">
                          {p.model_name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#86868b] mt-0.5">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(p.created_at).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-[#1d1d1f]">{p.price_usd}$</p>
                      <p className="text-[11px] text-[#86868b]">{p.status === "available" ? "En vente" : "Vendu"}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top demandés + Stock vieillissant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-white border-black/5 rounded-3xl shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-2">
            <CardTitle className="text-[16px] sm:text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" /> Modèles les plus demandés
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-2">
            {loading ? (
              <Skeleton className="h-32 w-full rounded-2xl bg-black/5" />
            ) : topDemanded.length === 0 ? (
              <p className="text-[14px] text-[#6e6e73] py-6 text-center">Pas encore assez de données. Les modèles qui génèrent des contacts apparaîtront ici.</p>
            ) : (
              <div className="space-y-3">
                {topDemanded.map(([name, count]) => (
                  <div key={name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[14px] font-medium text-[#1d1d1f]">{name}</span>
                      <span className="text-[12px] text-[#86868b]">{count} contact{count > 1 ? "s" : ""}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-black/[0.06] overflow-hidden">
                      <div className="h-full rounded-full bg-[#0071e3]" style={{ width: `${(count / maxDemand) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-black/5 rounded-3xl shadow-sm">
          <CardHeader className="p-5 sm:p-6 pb-2">
            <CardTitle className="text-[16px] sm:text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Clock className="h-4 w-4 text-rose-500" /> Stock à dynamiser
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-2">
            {loading ? (
              <Skeleton className="h-32 w-full rounded-2xl bg-black/5" />
            ) : agingStock.length === 0 ? (
              <p className="text-[14px] text-[#6e6e73] py-6 text-center">Aucun iPhone en ligne depuis plus de 30 jours. Votre stock tourne bien 👌</p>
            ) : (
              <div className="space-y-1">
                <p className="text-[12px] text-[#86868b] mb-3">En ligne depuis longtemps — pensez à baisser le prix ou rafraîchir les photos.</p>
                {agingStock.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/products/${p.id}/edit`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#f5f5f7] transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-[#1d1d1f] truncate group-hover:text-[#0071e3]">{p.model_name}</p>
                      <p className="text-[11px] text-[#86868b]">{p.days} jours en ligne · {p.price_usd}$</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#86868b] shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
