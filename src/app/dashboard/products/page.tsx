"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Smartphone,
  Tag,
  CheckCircle2,
  RotateCcw,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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

type Product = {
  id: string
  model: string
  price: number
  status: string
  storage?: string | null
  date: string
  image?: string
}

type StatusFilter = "all" | "available" | "sold"

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "available", label: "En vente" },
  { key: "sold", label: "Vendus" },
]

const CARD = "bg-white border border-black/[0.06] rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]"

export default function MyProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<StatusFilter>("all")

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

      const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("profile_id", user.id)
        .single()

      if (!store) {
        setProducts([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("products")
        .select("*, product_images (image_url)")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false })

      if (error || !data) {
        setProducts([])
      } else {
        setProducts(
          data.map((p) => ({
            id: p.id,
            model: p.model_name,
            price: Number(p.price_usd),
            status: p.status,
            storage: p.storage,
            date: new Date(p.created_at).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            image: p.product_images?.[0]?.image_url,
          }))
        )
      }
      setLoading(false)
    }

    fetchMyProducts()
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return

    const supabase = createClient()
    if (!supabase) return

    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      toast.error("Erreur lors de la suppression")
    } else {
      toast.success("Annonce supprimée")
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    const supabase = createClient()
    if (!supabase) return

    const { error } = await supabase.from("products").update({ status: newStatus }).eq("id", id)

    if (error) {
      toast.error("Erreur lors de la mise à jour")
    } else {
      toast.success(newStatus === "sold" ? "Marqué comme vendu 🎉" : "Remis en vente")
      setProducts(products.map((p) => (p.id === id ? { ...p, status: newStatus } : p)))
    }
  }

  const availableCount = products.filter((p) => p.status === "available").length
  const soldCount = products.filter((p) => p.status === "sold").length

  const filtered = products.filter((p) => {
    const matchSearch = p.model.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "all" || p.status === filter
    return matchSearch && matchFilter
  })

  const countFor = (key: StatusFilter) =>
    key === "all" ? products.length : key === "available" ? availableCount : soldCount

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-sf-display text-[clamp(1.75rem,4vw,2.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em]">
            Mes annonces
          </h1>
          <p className="text-[#6e6e73] text-[15px] mt-1">
            {loading
              ? "Chargement de votre inventaire…"
              : `${availableCount} en vente · ${soldCount} vendu${soldCount > 1 ? "s" : ""}`}
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full h-11 px-6 font-medium w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle annonce
          </Button>
        </Link>
      </div>

      {/* Recherche + filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
          <input
            placeholder="Rechercher une annonce…"
            className="h-11 w-full pl-11 pr-4 bg-white border border-black/[0.08] rounded-full text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] outline-none focus:border-[#0071e3]/40 focus:ring-2 focus:ring-[#0071e3]/15 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-white border border-black/[0.08] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.04)] self-start sm:self-auto">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "relative h-9 px-4 rounded-full text-[13px] font-medium transition-colors whitespace-nowrap",
                filter === key ? "text-white" : "text-[#6e6e73] hover:text-[#1d1d1f]"
              )}
            >
              {filter === key && (
                <motion.span
                  layoutId="product-filter-pill"
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
            <div key={i} className={`${CARD} p-4 flex items-center gap-4`}>
              <Skeleton className="h-16 w-16 rounded-xl bg-black/5 shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40 rounded bg-black/5" />
                <Skeleton className="h-3 w-24 rounded bg-black/5" />
              </div>
              <Skeleton className="h-7 w-20 rounded-full bg-black/5" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${CARD} py-16 sm:py-20 text-center`}
          >
            <div className="h-14 w-14 rounded-2xl bg-[#0071e3]/[0.08] flex items-center justify-center mx-auto mb-4">
              <Package className="h-7 w-7 text-[#0071e3]" strokeWidth={1.5} />
            </div>
            <h3 className="font-sf-display text-[19px] font-semibold text-[#1d1d1f] mb-1.5">
              {search || filter !== "all" ? "Aucune annonce ne correspond" : "Aucune annonce pour le moment"}
            </h3>
            <p className="text-[#6e6e73] text-[14px] mb-6 max-w-sm mx-auto">
              {search || filter !== "all"
                ? "Essayez un autre mot-clé ou réinitialisez les filtres."
                : "Ajoutez votre premier iPhone pour commencer à vendre."}
            </p>
            {search || filter !== "all" ? (
              <button
                onClick={() => { setSearch(""); setFilter("all") }}
                className="inline-flex h-10 items-center rounded-full border border-black/[0.1] px-5 text-[14px] font-medium text-[#1d1d1f] hover:bg-black/[0.03] transition-colors"
              >
                Réinitialiser
              </button>
            ) : (
              <Link href="/dashboard/products/new">
                <Button className="bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full h-10 px-5 font-medium">
                  <Plus className="mr-2 h-4 w-4" /> Ajouter un iPhone
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className={`${CARD} group hover:border-black/[0.14] transition-colors`}
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Image */}
                  <div className="h-16 w-16 rounded-xl bg-black/[0.02] border border-black/[0.06] flex items-center justify-center overflow-hidden shrink-0">
                    {product.image ? (
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Smartphone className="h-7 w-7 text-[#c7c7cc]" strokeWidth={1.5} />
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-[15px] text-[#1d1d1f] truncate group-hover:text-[#0071e3] transition-colors">
                      {product.model}
                    </h3>
                    <div className="flex items-center gap-2.5 mt-1 text-[12px] text-[#86868b]">
                      <span className="font-semibold text-[15px] text-[#1d1d1f]">{product.price}$</span>
                      {product.storage && (
                        <span className="inline-flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {product.storage}
                        </span>
                      )}
                      <span className="hidden sm:inline">{product.date}</span>
                    </div>
                  </div>

                  {/* Statut */}
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold",
                      product.status === "available"
                        ? "bg-emerald-500/10 text-emerald-700"
                        : "bg-black/[0.05] text-[#6e6e73]"
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        product.status === "available" ? "bg-emerald-500" : "bg-[#aeaeb2]"
                      )}
                    />
                    {product.status === "available" ? "En vente" : "Vendu"}
                  </span>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] rounded-full"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    } />
                    <DropdownMenuContent
                      align="end"
                      className="bg-white border-black/10 shadow-xl text-black rounded-2xl p-1.5 min-w-[200px]"
                    >
                      <Link href={`/dashboard/products/${product.id}/edit`}>
                        <DropdownMenuItem className="gap-2.5 rounded-xl focus:bg-black/5 py-2.5 px-3 text-[13.5px] cursor-pointer">
                          <Pencil className="h-4 w-4 text-[#6e6e73]" /> Modifier
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        className="gap-2.5 rounded-xl focus:bg-black/5 py-2.5 px-3 text-[13.5px] cursor-pointer"
                        onClick={() =>
                          handleStatusChange(product.id, product.status === "available" ? "sold" : "available")
                        }
                      >
                        {product.status === "available" ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Marquer comme vendu
                          </>
                        ) : (
                          <>
                            <RotateCcw className="h-4 w-4 text-[#0071e3]" /> Remettre en vente
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-2.5 rounded-xl focus:bg-red-500/10 focus:text-red-600 text-red-600 py-2.5 px-3 text-[13.5px] cursor-pointer"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
