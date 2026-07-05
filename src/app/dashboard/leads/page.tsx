"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageCircle,
  Phone,
  Search,
  Inbox,
  Smartphone,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Lead = {
  id: string
  customerName: string
  customerPhone: string
  product: string
  date: string
  status: string
}

type StatusFilter = "all" | "new" | "contacted" | "closed"

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "new", label: "Nouveaux" },
  { key: "contacted", label: "En cours" },
  { key: "closed", label: "Conclus" },
]

const STATUS_META: Record<string, { label: string; className: string; dot: string }> = {
  new: { label: "Nouveau", className: "bg-[#0071e3]/10 text-[#0071e3]", dot: "bg-[#0071e3]" },
  contacted: { label: "En cours", className: "bg-amber-500/10 text-amber-600", dot: "bg-amber-500" },
  closed: { label: "Conclu", className: "bg-emerald-500/10 text-emerald-700", dot: "bg-emerald-500" },
}

/** Cycle de suivi : nouveau → en cours → conclu → nouveau */
const NEXT_STATUS: Record<string, string> = {
  new: "contacted",
  contacted: "closed",
  closed: "new",
}

const CARD = "bg-white border border-black/[0.06] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"

function waReply(phone: string, model: string) {
  const clean = phone.replace(/[^0-9]/g, "")
  const text = encodeURIComponent(
    `Bonjour 👋, merci pour votre intérêt${model ? ` pour le ${model}` : ""} chez Apple Store Market. Est-il toujours disponible pour vous ?`
  )
  return `https://wa.me/${clean}?text=${text}`
}

/** Initiales pour l'avatar (max 2 lettres) */
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "?"
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<StatusFilter>("all")

  useEffect(() => {
    async function fetchLeads() {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) {
        setLeads([])
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
        setLeads([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("leads")
        .select("*, products (model_name)")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })

      if (error || !data) {
        setLeads([])
      } else {
        setLeads(
          data.map((l) => ({
            id: l.id,
            customerName: l.customer_name || "Client anonyme",
            customerPhone: l.customer_phone || "",
            product: l.products?.model_name || "Produit supprimé",
            date: new Date(l.created_at).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: l.status,
          }))
        )
      }
      setLoading(false)
    }

    fetchLeads()
  }, [router])

  const cycleStatus = async (leadId: string, currentStatus: string) => {
    const newStatus = NEXT_STATUS[currentStatus] || "new"
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)))

    const supabase = createClient()
    if (!supabase) return

    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId)
    if (error) {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: currentStatus } : l)))
      toast.error("Erreur lors de la mise à jour du statut")
    }
  }

  const countFor = (key: StatusFilter) =>
    key === "all" ? leads.length : leads.filter((l) => l.status === key).length

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.product.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || l.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">
          Leads WhatsApp
        </h1>
        <p className="text-[#6e6e73] text-[15px] mt-1">
          {loading
            ? "Chargement de vos contacts…"
            : `${countFor("new")} nouveau${countFor("new") > 1 ? "x" : ""} · ${countFor("contacted")} en cours · ${countFor("closed")} conclu${countFor("closed") > 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Recherche + filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
          <input
            placeholder="Rechercher un client ou un modèle…"
            className="h-11 w-full pl-11 pr-4 bg-white border border-black/[0.08] rounded-full text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none focus:border-[#0071e3]/40 focus:ring-2 focus:ring-[#0071e3]/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-white border border-black/[0.08] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.04)] self-start sm:self-auto overflow-x-auto scrollbar-hide">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "relative h-9 px-3.5 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap",
                filter === key ? "text-white" : "text-[#6e6e73] hover:text-[#1d1d1f]"
              )}
            >
              {filter === key && (
                <motion.span
                  layoutId="lead-filter-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#0071e3]"
                />
              )}
              <span className="relative">
                {label}
                {!loading && (
                  <span className={cn("ml-1.5 text-[11px]", filter === key ? "text-white/70" : "text-[#aeaeb2]")}>
                    {countFor(key)}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className={`${CARD} p-5 flex items-center gap-4`}>
              <Skeleton className="h-11 w-11 rounded-full bg-black/5 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36 rounded bg-black/5" />
                <Skeleton className="h-3 w-52 rounded bg-black/5" />
              </div>
              <Skeleton className="h-9 w-28 rounded-full bg-black/5" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${CARD} py-16 sm:py-20 text-center`}
          >
            <div className="h-14 w-14 rounded-2xl bg-[#0071e3]/[0.08] flex items-center justify-center mx-auto mb-4">
              <Inbox className="h-7 w-7 text-[#0071e3]" strokeWidth={1.5} />
            </div>
            <h3 className="font-sf-display text-[19px] font-semibold text-[#1d1d1f] mb-1.5">
              {search || filter !== "all" ? "Aucun lead ne correspond" : "Pas encore de leads"}
            </h3>
            <p className="text-[#6e6e73] text-[14px] max-w-sm mx-auto">
              {search || filter !== "all"
                ? "Essayez un autre mot-clé ou réinitialisez les filtres."
                : "Dès qu'un client clique sur « Commander », ses informations apparaîtront ici."}
            </p>
            {(search || filter !== "all") && (
              <button
                onClick={() => { setSearch(""); setFilter("all") }}
                className="mt-6 inline-flex h-10 items-center rounded-full border border-black/[0.1] px-5 text-[14px] font-medium text-[#1d1d1f] hover:bg-black/[0.03] transition-colors"
              >
                Réinitialiser
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((lead, i) => {
              const meta = STATUS_META[lead.status] || STATUS_META.new
              return (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`${CARD} hover:border-black/[0.14] transition-colors`}
                >
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Client */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <span className="h-11 w-11 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[13px] font-semibold flex items-center justify-center shrink-0">
                        {initials(lead.customerName)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-medium text-[15px] text-[#1d1d1f] truncate">{lead.customerName}</h3>
                        <div className="flex items-center gap-2.5 mt-0.5 text-[12px] text-[#86868b]">
                          {lead.customerPhone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {lead.customerPhone}
                            </span>
                          )}
                          <span className="hidden sm:inline">{lead.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Produit */}
                    <div className="flex items-center gap-2 sm:w-[200px] shrink-0 min-w-0">
                      <Smartphone className="h-4 w-4 text-[#aeaeb2] shrink-0" strokeWidth={1.75} />
                      <span className="text-[13.5px] font-medium text-[#1d1d1f] truncate">{lead.product}</span>
                    </div>

                    {/* Statut + WhatsApp */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => cycleStatus(lead.id, lead.status)}
                        title="Changer le statut"
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-transform active:scale-95 cursor-pointer",
                          meta.className
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
                        {meta.label}
                      </button>
                      {lead.customerPhone && (
                        <a
                          href={waReply(lead.customerPhone, lead.product)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[13px] font-medium transition-all active:scale-95"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> Répondre
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
