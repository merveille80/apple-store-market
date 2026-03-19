"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Smartphone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function MyProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchMyProducts() {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) {
        setProducts([])
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (image_url)
        `)
        .eq('store_id', (await supabase.from('stores').select('id').eq('profile_id', user.id).single()).data?.id) // Filter by current store
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setProducts([])
      } else {
        const formatted = data.map(p => ({
          id: p.id,
          model: p.model_name,
          price: Number(p.price_usd),
          status: p.status,
          views: 0,
          clicks: 0,
          date: new Date(p.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }),
          image: p.product_images?.[0]?.image_url
        }))
        setProducts(formatted)
      }
      setLoading(false)
    }

    fetchMyProducts()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return
    
    const supabase = createClient()
    if (!supabase) return

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error("Erreur lors de la suppression")
    } else {
      toast.success("Annonce supprimée")
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const supabase = createClient()
    if (!supabase) return

    const { error } = await supabase
      .from('products')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      toast.error("Erreur lors de la mise à jour")
    } else {
      toast.success("Statut mis à jour !")
      setProducts(products.map(p => p.id === id ? { ...p, status: newStatus } : p))
    }
  }

  const filteredProducts = products.filter(p => 
    p.model.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Mes Annonces</h1>
          <p className="text-zinc-500">Gérez vos iPhones listés sur la plateforme.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-6 font-bold w-full sm:w-auto">
            <Plus className="mr-2 h-5 w-5" /> Nouvelle Annonce
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Rechercher une annonce..." 
            className="pl-10 bg-zinc-900 border-white/5 h-12 rounded-xl text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="border-white/5 bg-zinc-900 h-12 rounded-xl px-4 text-zinc-400">
          <Filter className="mr-2 h-4 w-4" /> Filtres
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
            <p className="text-zinc-500 animate-pulse">Chargement de vos annonces...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/5">
            <Smartphone className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucune annonce trouvée</h3>
            <p className="text-zinc-500 mb-6">Commencez par ajouter votre premier iPhone à vendre.</p>
            <Link href="/dashboard/products/new">
              <Button className="bg-blue-600">Ajouter un iPhone</Button>
            </Link>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="bg-zinc-900 border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-16 w-16 bg-black rounded-xl border border-white/5 flex items-center justify-center text-zinc-700 overflow-hidden">
                  {product.image ? (
                    <img src={product.image} className="w-full h-full object-cover" />
                  ) : (
                    <Smartphone className="h-8 w-8" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate uppercase tracking-tight">{product.model}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-blue-500 font-black">{product.price}$</span>
                    <span className="text-zinc-600 text-[10px] tracking-widest uppercase font-bold">{product.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter mb-0.5">Performance</p>
                    <p className="text-xs font-bold text-white">{product.views} vues • {product.clicks} clics</p>
                  </div>

                  <Badge 
                    className={cn(
                      "rounded-full px-3 py-1 font-bold text-[10px] uppercase tracking-wider",
                      product.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                    )}
                    variant="outline"
                  >
                    {product.status === 'available' ? 'En Vente' : 'Vendu'}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end" className="bg-zinc-900 border-white/10 text-white rounded-2xl p-2 min-w-[180px]">
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <DropdownMenuItem className="gap-2 rounded-xl focus:bg-white/5 cursor-pointer">
                          <Edit2 className="h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem 
                        className="gap-2 rounded-xl focus:bg-white/5 cursor-pointer"
                        onClick={() => handleStatusChange(product.id, product.status === 'available' ? 'sold' : 'available')}
                      >
                         <Smartphone className="h-4 w-4" /> {product.status === 'available' ? 'Marquer comme vendu' : 'Remettre en vente'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="gap-2 rounded-xl focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
