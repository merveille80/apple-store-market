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
  Smartphone
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

      // Fetch store id first
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (!store) {
        setLeads([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          products (model_name)
        `)
        .eq('store_id', store.id)
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setLeads([])
      } else {
        const formatted = data.map(l => ({
          id: l.id,
          customerName: l.customer_name || "Client Anonyme",
          customerPhone: l.customer_phone || "N/A",
          product: l.products?.model_name || "Produit supprimé",
          date: new Date(l.created_at).toLocaleDateString('fr-FR', { 
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
          }),
          status: l.status
        }))
        setLeads(formatted)
      }
      setLoading(false)
    }

    fetchLeads()
  }, [router])

  const filteredLeads = leads.filter(l => 
    l.customerName.toLowerCase().includes(search.toLowerCase()) ||
    l.product.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Leads WhatsApp</h1>
          <p className="text-zinc-500">Suivez les clients qui vous ont contacté via la plateforme.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Rechercher un client..." 
            className="pl-10 bg-zinc-900 border-white/5 h-12 rounded-xl text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-white/5 bg-zinc-900 h-12 rounded-xl px-4 text-zinc-400">
          <Filter className="mr-2 h-4 w-4" /> Statut
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="text-zinc-500 animate-pulse">Chargement de vos leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <Card className="bg-zinc-900 border-white/5 rounded-3xl p-20 text-center">
            <div className="h-20 w-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-10 w-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pas encore de leads</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">
              Dès qu'un client cliquera sur "Commander" sur l'une de vos annonces, vous verrez ses informations ici.
            </p>
          </Card>
        ) : (
          filteredLeads.map((lead) => (
            <Card key={lead.id} className="bg-zinc-900 border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{lead.customerName}</h3>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Phone className="h-3 w-3" /> {lead.customerPhone}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xs text-zinc-600 uppercase font-black tracking-widest mb-1">Produit concerné</p>
                  <p className="text-sm font-medium text-white">{lead.product}</p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs text-zinc-600 uppercase font-black tracking-widest mb-1">Date du contact</p>
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="h-3 w-3" /> {lead.date}
                    </div>
                  </div>

                  <Badge 
                    className={cn(
                      "rounded-full px-4 py-1.5",
                      lead.status === 'new' ? 'bg-blue-500 text-white border-none' : 'bg-transparent text-zinc-500 border-white/10'
                    )}
                    variant="outline"
                  >
                    {lead.status === 'new' ? 'Nouveau' : 'Contacté'}
                  </Badge>

                  <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white">
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
