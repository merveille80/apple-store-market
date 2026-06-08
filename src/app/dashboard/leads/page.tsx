"use client"

import { useState, useEffect } from "react"
import {
  MessageSquare,
  User,
  Phone,
  Calendar,
  ChevronRight,
  Filter,
  Search,
  Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

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
        .select(`*, products (model_name)`)
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })

      if (error || !data || data.length === 0) {
        setLeads([])
      } else {
        setLeads(
          data.map((l) => ({
            id: l.id,
            customerName: l.customer_name || "Client anonyme",
            customerPhone: l.customer_phone || "N/A",
            product: l.products?.model_name || "Produit supprimé",
            date: new Date(l.created_at).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
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

  const toggleLeadStatus = async (leadId: string, currentStatus: string) => {
    const newStatus = currentStatus === "new" ? "contacted" : "new"
    setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)))

    const supabase = createClient()
    if (!supabase) return

    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId)
    if (error) {
      setLeads(leads.map((l) => (l.id === leadId ? { ...l, status: currentStatus } : l)))
    }
  }

  const filteredLeads = leads.filter(
    (l) =>
      l.customerName.toLowerCase().includes(search.toLowerCase()) ||
      l.product.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">
          Leads WhatsApp
        </h1>
        <p className="text-[#6e6e73] text-[15px] mt-1">
          Clients qui vous ont contacté via la plateforme.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
          <Input
            placeholder="Rechercher un client…"
            className="pl-10 bg-white border-black/10 h-11 rounded-full text-[#1d1d1f]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-black/10 bg-white h-11 rounded-full px-4 text-[#86868b]">
          <Filter className="mr-2 h-4 w-4" /> Statut
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-8 w-8 text-[#0071e3] animate-spin" />
            <p className="text-[#86868b] text-[14px]">Chargement de vos leads…</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card className="bg-white border-black/5 rounded-3xl p-16 text-center shadow-sm">
            <div className="h-16 w-16 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-5">
              <MessageSquare className="h-8 w-8 text-[#86868b]" />
            </div>
            <h3 className="font-sf-display text-[20px] font-semibold text-[#1d1d1f] mb-2">Pas encore de leads</h3>
            <p className="text-[#6e6e73] text-[14px] max-w-sm mx-auto">
              Dès qu&apos;un client clique sur « Commander », ses informations apparaîtront ici.
            </p>
          </Card>
        ) : (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className="bg-white border-black/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-full bg-[#0071e3]/10 flex items-center justify-center text-[#0071e3]">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#1d1d1f] text-[16px]">{lead.customerName}</h3>
                    <div className="flex items-center gap-2 text-[#86868b] text-[13px] mt-0.5">
                      <Phone className="h-3 w-3" /> {lead.customerPhone}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#86868b] mb-0.5">Produit</p>
                  <p className="text-[14px] font-medium text-[#1d1d1f] truncate">{lead.product}</p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right hidden lg:block">
                    <p className="text-[11px] text-[#86868b] mb-0.5">Date</p>
                    <div className="flex items-center gap-1.5 text-[13px] text-[#6e6e73]">
                      <Calendar className="h-3 w-3" /> {lead.date}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLeadStatus(lead.id, lead.status)}
                    className="flex items-center gap-2 group cursor-pointer transition-opacity hover:opacity-80"
                  >
                    <Badge
                      className={cn(
                        "rounded-full px-3 py-1 font-medium text-[12px]",
                        lead.status === "new"
                          ? "bg-[#0071e3] text-white border-none"
                          : "bg-[#f5f5f7] text-[#86868b] border-none"
                      )}
                    >
                      {lead.status === "new" ? "Nouveau" : "Contacté"}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-[#86868b] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
