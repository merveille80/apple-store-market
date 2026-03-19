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
        <h1 className="text-3xl font-black text-white tracking-tight italic">Gestion des Vendeurs</h1>
        <p className="text-zinc-500">Modérez et gérez les boutiques actives sur la plateforme.</p>
      </div>

      <div className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="text-zinc-500 animate-pulse">Chargement des vendeurs...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-white/5">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="py-6 px-8 text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">Store</TableHead>
                <TableHead className="py-6 text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">Ville / Contact</TableHead>
                <TableHead className="py-6 text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">Annonces</TableHead>
                <TableHead className="py-6 text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">Statut</TableHead>
                <TableHead className="py-6 px-8 text-right text-zinc-400 uppercase text-[10px] font-black tracking-[0.2em]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center text-zinc-500">
                    Aucun vendeur trouvé.
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-700 border border-white/5">
                          <ShieldCheck className={cn("h-5 w-5", store.status === 'verified' ? "text-blue-500" : "text-zinc-600")} />
                        </div>
                        <span className="font-bold text-white">{store.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <MapPin className="h-3 w-3" /> {store.city}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                          <Phone className="h-3 w-3" /> {store.whatsapp}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-6">
                      <span className="text-sm font-bold text-zinc-300">{store.listings}</span>
                    </TableCell>
                    <TableCell className="py-6">
                      <Badge 
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px] font-black uppercase",
                          store.status === 'verified' ? 'bg-blue-600/20 text-blue-400 border-none' : 
                          store.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400 border-none' :
                          'bg-red-600/20 text-red-400 border-none'
                        )}
                      >
                        {store.status === 'verified' ? 'Vérifié' : 
                        store.status === 'pending' ? 'En Attente' : 'Suspendu'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white rounded-xl">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white rounded-2xl p-2 min-w-[180px]">
                          <DropdownMenuItem 
                            className="gap-2 rounded-xl focus:bg-white/5 cursor-pointer"
                            onClick={() => toggleVerification(store.id, store.status)}
                          >
                            {store.status === 'verified' ? (
                              <><XCircle className="h-4 w-4 text-yellow-500" /> Retirer Vérification</>
                            ) : (
                              <><CheckCircle className="h-4 w-4 text-blue-500" /> Vérifier le Store</>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-xl focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer">
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
