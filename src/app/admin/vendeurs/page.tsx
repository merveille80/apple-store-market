"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ShieldCheck, Phone, MapPin, Loader2, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminSellersPage() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchStores() {
    setLoading(true)
    const supabase = createClient()
    if (!supabase) return

    const { data, error } = await supabase
      .from('stores')
      .select(`
        *,
        products (count)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error("Erreur lors du chargement des vendeurs")
    } else {
      const formatted = data.map(s => ({
        id: s.id,
        name: s.name,
        city: s.city || "Kolwezi",
        listings: s.products?.[0]?.count || 0,
        status: s.is_verified ? 'verified' : 'pending',
        whatsapp: s.whatsapp_number
      }))
      setStores(formatted)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStores()
  }, [])

  const toggleVerification = async (id: string, currentStatus: string) => {
    const supabase = createClient()
    if (!supabase) return

    const newStatus = currentStatus === 'verified' ? false : true
    const { error } = await supabase
      .from('stores')
      .update({ is_verified: newStatus })
      .eq('id', id)

    if (error) {
      toast.error("Erreur lors de la modification du statut")
    } else {
      toast.success(newStatus ? "Vendeur vérifié !" : "Vérification retirée")
      setStores(stores.map(s => s.id === id ? { ...s, status: newStatus ? 'verified' : 'pending' } : s))
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">Gestion des vendeurs</h1>
        <p className="text-[#6e6e73] text-[15px] mt-1">Modérez et gérez les boutiques actives sur la plateforme.</p>
      </div>

      <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-[#0071e3] animate-spin" />
            <p className="text-[#86868b] animate-pulse">Chargement des vendeurs...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#f5f5f7]">
              <TableRow className="border-black/5 hover:bg-transparent">
                <TableHead className="py-5 px-8 text-[#86868b] text-[12px] font-medium">Store</TableHead>
                <TableHead className="py-5 text-[#86868b] text-[12px] font-medium">Ville / Contact</TableHead>
                <TableHead className="py-5 text-[#86868b] text-[12px] font-medium">Annonces</TableHead>
                <TableHead className="py-5 text-[#86868b] text-[12px] font-medium">Statut</TableHead>
                <TableHead className="py-5 px-8 text-right text-[#86868b] text-[12px] font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center text-[#86868b]">
                    Aucun vendeur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store.id} className="border-black/5 hover:bg-black/[0.02] transition-colors">
                    <TableCell className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#f5f5f7] flex items-center justify-center border border-black/5">
                          <ShieldCheck className={cn("h-5 w-5", store.status === 'verified' ? "text-[#0071e3]" : "text-[#86868b]")} />
                        </div>
                        <span className="font-medium text-[#1d1d1f]">{store.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
                          <MapPin className="h-3 w-3" /> {store.city}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
                          <Phone className="h-3 w-3" /> {store.whatsapp}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-5">
                      <span className="text-sm font-medium text-[#1d1d1f]">{store.listings}</span>
                    </TableCell>
                    <TableCell className="py-5">
                      <Badge 
                        className={cn(
                          "rounded-full px-3 py-1 text-[11px] font-medium",
                          store.status === 'verified' ? 'bg-[#0071e3]/10 text-[#0071e3] border-none' : 
                          store.status === 'pending' ? 'bg-amber-500/10 text-amber-700 border-none' :
                          'bg-red-500/10 text-red-600 border-none'
                        )}
                      >
                        {store.status === 'verified' ? 'Vérifié' : 
                        store.status === 'pending' ? 'En attente' : 'Suspendu'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 px-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="text-[#86868b] hover:text-[#1d1d1f] rounded-xl">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="bg-white border-black/10 text-[#1d1d1f] rounded-2xl p-2 min-w-[180px] shadow-lg">
                          <DropdownMenuItem 
                            className="gap-2 rounded-xl focus:bg-black/5 cursor-pointer"
                            onClick={() => toggleVerification(store.id, store.status)}
                          >
                            {store.status === 'verified' ? (
                              <><XCircle className="h-4 w-4 text-amber-600" /> Retirer vérification</>
                            ) : (
                              <><CheckCircle className="h-4 w-4 text-[#0071e3]" /> Vérifier le store</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-xl focus:bg-red-500/10 focus:text-red-600 text-red-600 cursor-pointer">
                            <XCircle className="h-4 w-4" /> Suspendre
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
