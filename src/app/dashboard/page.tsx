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
  TrendingDown,
  Clock,
  Flame,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsSkeleton } from "@/components/ui/skeletons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import {
  RevenueAreaChart,
  StockDonut,
  type RevenuePoint,
  type DonutSlice,
} from "@/components/dashboard/sales-chart"

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

const DAY = 86400000
const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : n.toString()
const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"]

const RANGES = {
  "30j": { label: "30 derniers jours", days: 30, mode: "day" as const },
  "6mois": { label: "6 derniers mois", months: 6, mode: "month" as const },
  "12mois": { label: "12 derniers mois", months: 12, mode: "month" as const },
}
type RangeKey = keyof typeof RANGES

function waReply(phone: string | null, model: string | null) {
  const clean = (phone || "").replace(/[^0-9]/g, "")
  const text = encodeURIComponent(
    `Bonjour 👋, merci pour votre intérêt${model ? ` pour le ${model}` : ""} chez Apple Store Market. Est-il toujours disponible pour vous ?`
  )
  return `https://wa.me/${clean}?text=${text}`
}

/** Variation période-sur-période */
function delta(cur: number, prev: number) {
  if (prev === 0) return { pct: cur > 0 ? 100 : 0, up: cur >= 0 }
  const pct = Math.round(((cur - prev) / prev) * 100)
  return { pct: Math.abs(pct), up: cur >= prev }
}

/** Style carte — blanc pur avec bordure fine */
const CARD = "bg-white border border-black/[0.06] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"

function DeltaBadge({ cur, prev, suffix }: { cur: number; prev: number; suffix: string }) {
  const d = delta(cur, prev)
  if (d.pct === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#86868b]">
        — <span className="font-normal">{suffix}</span>
      </span>
    )
  }
  const Icon = d.up ? TrendingUp : TrendingDown
  return (
    <span className={`inline-flex items-center gap-1 text-[12px] font-medium ${d.up ? "text-emerald-600" : "text-rose-500"}`}>
      <Icon className="h-3.5 w-3.5" />
      {d.pct}% <span className="text-[#86868b] font-normal">{suffix}</span>
    </span>
  )
}

export default function DashboardOverview() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [range, setRange] = useState<RangeKey>("6mois")

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
  const now = Date.now()
  const available = products.filter((p) => p.status === "available")
  const sold = products.filter((p) => p.status === "sold")

  const stockValue = available.reduce((s, p) => s + Number(p.price_usd) * (p.stock_quantity || 1), 0)
  const revenue = sold.reduce((s, p) => s + Number(p.price_usd), 0)
  const newLeads = leads.filter((l) => l.status === "new")
  const closedLeads = leads.filter((l) => l.status === "closed")
  const conversion = leads.length > 0 ? Math.round((closedLeads.length / leads.length) * 100) : 0

  // ---- Variations période-sur-période ----
  const inWindow = (ts: string, start: number, end: number) => {
    const t = new Date(ts).getTime()
    return t >= start && t < end
  }
  // Annonces : nouvelles 30j vs 30j précédents
  const listings30 = available.filter((p) => inWindow(p.created_at, now - 30 * DAY, now)).length
  const listingsPrev30 = available.filter((p) => inWindow(p.created_at, now - 60 * DAY, now - 30 * DAY)).length
  // Valeur du stock ajoutée 30j vs préc.
  const stockAdd30 = available.filter((p) => inWindow(p.created_at, now - 30 * DAY, now)).reduce((s, p) => s + Number(p.price_usd) * (p.stock_quantity || 1), 0)
  const stockAddPrev30 = available.filter((p) => inWindow(p.created_at, now - 60 * DAY, now - 30 * DAY)).reduce((s, p) => s + Number(p.price_usd) * (p.stock_quantity || 1), 0)
  // CA 30j vs préc. (date de vente = updated_at)
  const rev30 = sold.filter((p) => inWindow(p.updated_at || p.created_at, now - 30 * DAY, now)).reduce((s, p) => s + Number(p.price_usd), 0)
  const revPrev30 = sold.filter((p) => inWindow(p.updated_at || p.created_at, now - 60 * DAY, now - 30 * DAY)).reduce((s, p) => s + Number(p.price_usd), 0)
  // Leads 7j vs préc.
  const leads7 = leads.filter((l) => inWindow(l.created_at, now - 7 * DAY, now)).length
  const leadsPrev7 = leads.filter((l) => inWindow(l.created_at, now - 14 * DAY, now - 7 * DAY)).length

  // ---- Série du graphique (selon la période choisie) ----
  const cfg = RANGES[range]
  let series: RevenuePoint[] = []
  if (cfg.mode === "day") {
    const buckets = new Map<string, RevenuePoint>()
    const order: string[] = []
    for (let i = cfg.days - 1; i >= 0; i--) {
      const d = new Date(now - i * DAY)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      order.push(key)
      buckets.set(key, { label: `${d.getDate()}/${d.getMonth() + 1}`, revenue: 0, units: 0 })
    }
    sold.forEach((p) => {
      const d = new Date(p.updated_at || p.created_at)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      const b = buckets.get(key)
      if (b) { b.revenue += Number(p.price_usd); b.units += 1 }
    })
    series = order.map((k) => buckets.get(k)!)
  } else {
    const buckets = new Map<string, RevenuePoint>()
    const order: string[] = []
    const ref = new Date()
    for (let i = cfg.months - 1; i >= 0; i--) {
      const d = new Date(ref.getFullYear(), ref.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      order.push(key)
      buckets.set(key, { label: MONTHS_FR[d.getMonth()], revenue: 0, units: 0 })
    }
    sold.forEach((p) => {
      const d = new Date(p.updated_at || p.created_at)
      const key = `${d.getFullYear()}-${d.getMonth()}`
      const b = buckets.get(key)
      if (b) { b.revenue += Number(p.price_usd); b.units += 1 }
    })
    series = order.map((k) => buckets.get(k)!)
  }

  // ---- Donut : valeur du stock par modèle (top 4 + Autres) ----
  const stockByModel = new Map<string, number>()
  available.forEach((p) => {
    const v = Number(p.price_usd) * (p.stock_quantity || 1)
    stockByModel.set(p.model_name, (stockByModel.get(p.model_name) || 0) + v)
  })
  const sortedStock = [...stockByModel.entries()].sort((a, b) => b[1] - a[1])
  const donutData: DonutSlice[] = sortedStock.slice(0, 4).map(([name, value]) => ({ name, value }))
  const rest = sortedStock.slice(4).reduce((s, [, v]) => s + v, 0)
  if (rest > 0) donutData.push({ name: "Autres", value: rest })

  // ---- Demande & stock vieillissant ----
  const demandMap = new Map<string, number>()
  leads.forEach((l) => {
    const name = l.products?.model_name
    if (name) demandMap.set(name, (demandMap.get(name) || 0) + 1)
  })
  const topDemanded = [...demandMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)
  const maxDemand = topDemanded[0]?.[1] || 1

  const agingStock = available
    .filter((p) => (now - new Date(p.created_at).getTime()) / DAY > 30)
    .map((p) => ({ ...p, days: Math.floor((now - new Date(p.created_at).getTime()) / DAY) }))
    .sort((a, b) => b.days - a.days)
    .slice(0, 4)

  const recentProducts = products.slice(0, 3)

  const stats = [
    { name: "Annonces actives", value: available.length.toString(), icon: Smartphone, cur: listings30, prev: listingsPrev30, suffix: "vs 30j préc." },
    { name: "Valeur du stock", value: `$${fmt(Math.round(stockValue))}`, icon: Package, cur: stockAdd30, prev: stockAddPrev30, suffix: "ajouté vs 30j" },
    { name: "CA réalisé", value: `$${fmt(Math.round(revenue))}`, icon: Wallet, cur: rev30, prev: revPrev30, suffix: "vs 30j préc." },
    { name: "Leads à relancer", value: newLeads.length.toString(), icon: Bell, cur: leads7, prev: leadsPrev7, suffix: "vs 7j préc.", highlight: newLeads.length > 0 },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
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

      {/* Stats avec variations */}
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
              <Card className={`${CARD} transition-colors ${stat.highlight ? "ring-1 ring-amber-300/60" : "hover:border-black/[0.14]"}`}>
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] sm:text-[13px] font-medium text-[#86868b]">{stat.name}</p>
                    {stat.highlight ? (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        À traiter
                      </span>
                    ) : (
                      <stat.icon className="h-4 w-4 text-[#c7c7cc]" />
                    )}
                  </div>
                  <p className="font-sf-display text-[26px] sm:text-[32px] font-semibold text-[#1d1d1f] mt-2 tracking-[-0.02em] leading-none">
                    {stat.value}
                  </p>
                  <div className="mt-3">
                    <DeltaBadge cur={stat.cur} prev={stat.prev} suffix={stat.suffix} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Aire (CA) + Donut (répartition stock) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 bg-white border border-black/[0.06] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardHeader className="p-5 sm:p-6 pb-0 flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-[16px] sm:text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#0071e3]" /> Chiffre d&apos;affaires
              </CardTitle>
              <p className="text-[13px] text-[#86868b] mt-1">Évolution de vos ventes encaissées.</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-black/[0.03] hover:bg-black/[0.06] text-[13px] font-medium text-[#1d1d1f] transition-colors border border-black/[0.06]">
                  {RANGES[range].label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </button>
              } />
              <DropdownMenuContent className="bg-white border-black/10 text-black rounded-2xl shadow-2xl p-1.5">
                {(Object.keys(RANGES) as RangeKey[]).map((k) => (
                  <DropdownMenuItem
                    key={k}
                    onClick={() => setRange(k)}
                    className={`rounded-xl focus:bg-black/5 py-2.5 px-4 text-[13px] cursor-pointer ${range === k ? "text-[#0071e3] font-semibold" : "text-black/60"}`}
                  >
                    {RANGES[k].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-3 sm:p-4">
            {loading ? (
              <Skeleton className="h-[260px] w-full rounded-2xl bg-black/5" />
            ) : (
              <RevenueAreaChart data={series} />
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <CardHeader className="p-5 sm:p-6 pb-2">
            <CardTitle className="text-[16px] sm:text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2">
              <Package className="h-4 w-4 text-violet-600" /> Répartition du stock
            </CardTitle>
            <p className="text-[13px] text-[#86868b] mt-1">Valeur immobilisée par modèle.</p>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pt-2">
            {loading ? (
              <Skeleton className="h-[220px] w-full rounded-2xl bg-black/5" />
            ) : (
              <StockDonut data={donutData} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leads à relancer + Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 bg-white border border-black/[0.08] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
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

        <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
                <div key={b.label} className="rounded-2xl bg-black/[0.02] border border-black/[0.04] py-3">
                  <p className={`font-sf-display text-xl font-semibold ${b.c}`}>{b.val}</p>
                  <p className="text-[11px] text-[#86868b] mt-0.5">{b.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente + Demande + Stock vieillissant */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="bg-white border border-black/[0.08] rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
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
                <div className="p-10 text-center text-[#6e6e73] text-[14px]">Aucune activité pour le moment.</div>
              ) : (
                recentProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/products/${p.id}/edit`}
                    className="p-4 sm:p-5 flex items-center justify-between hover:bg-black/[0.02] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-black/[0.02] overflow-hidden border border-black/[0.06] flex items-center justify-center shrink-0">
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

        <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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

        <Card className="bg-white border border-black/[0.06] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-black/[0.02] transition-colors group"
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
