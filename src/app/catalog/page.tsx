"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ChevronDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"

function CatalogContent() {
  const searchParams = useSearchParams()
  const storeFilter = searchParams.get('store')

  const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"]
  const COLOR_OPTIONS = ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium", "Deep Purple", "Space Black", "Silver", "Gold", "Midnight", "Starlight", "Blue", "Pink", "Yellow"]
  const SORT_LABELS: Record<string, string> = {
    recent: "Plus récents",
    "price-low": "Prix croissant",
    "price-high": "Prix décroissant",
  }

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [selectedStorages, setSelectedStorages] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const supabase = createClient()
      if (!supabase) { setLoading(false); return }

      const { data, error } = await supabase
        .from('products')
        .select(`*, stores (name, city), product_images (image_url)`)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setProducts(data.map(p => ({
          id: p.id,
          model: p.model_name,
          price: Number(p.price_usd),
          storage: `${p.storage_gb}GB`,
          condition: p.condition,
          isNew: p.condition === 'box',
          color: p.color,
          image: p.product_images?.[0]?.image_url || "/placeholder.svg",
          battery: p.battery_health,
          storeId: p.store_id,
          createdAt: p.created_at,
        })))
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products
    .filter(p => {
      const matchSearch = p.model.toLowerCase().includes(searchQuery.toLowerCase())
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
      const matchCond = selectedConditions.length === 0 || selectedConditions.includes(p.condition)
      const matchStore = selectedStorages.length === 0 || selectedStorages.includes(p.storage)
      const matchColor = selectedColors.length === 0 || selectedColors.includes(p.color)
      const matchShop = !storeFilter || p.storeId === storeFilter
      return matchSearch && matchPrice && matchCond && matchStore && matchColor && matchShop
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price
      if (sortBy === "price-high") return b.price - a.price
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

  const toggleFilter = (list: string[], setList: (v: string[]) => void, item: string) =>
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item])

  const activeFiltersCount = selectedConditions.length + selectedStorages.length + selectedColors.length +
    (priceRange[0] > 0 || priceRange[1] < 2000 ? 1 : 0)

  const resetFilters = () => {
    setSearchQuery("")
    setPriceRange([0, 2000])
    setSelectedConditions([])
    setSelectedStorages([])
    setSelectedColors([])
    setSortBy("recent")
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="container mx-auto px-5 py-12 md:py-16">

        {/* Page header */}
        <div className="mb-10">
          <p className="text-[11px] font-semibold text-black/40 uppercase tracking-[0.15em] mb-2">Kolwezi, RDC</p>
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold text-black tracking-[-0.03em] leading-tight">
            Catalogue iPhone
          </h1>
          {!loading && (
            <p className="text-[14px] text-black/50 mt-2">
              {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} disponible{filteredProducts.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* ── Sticky filter bar ── */}
        <div className="sticky top-[56px] md:top-[60px] z-40 -mx-5 px-5 py-3 bg-white/90 backdrop-blur-2xl border-b border-black/5 mb-8">
          <div className="flex gap-2.5 items-center overflow-x-auto scrollbar-hide">
            
            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black/40 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 bg-black/5 border border-black/10 rounded-full text-[13px] text-black placeholder:text-black/40 outline-none focus:border-black/20 focus:bg-black/10 transition-all w-[160px] sm:w-[200px]"
              />
            </div>

            <div className="w-[1px] h-5 bg-black/10 flex-shrink-0" />

            {/* Prix */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className={`pill-filter flex-shrink-0 ${priceRange[0] > 0 || priceRange[1] < 2000 ? "active" : ""}`}>
                  Prix
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              } />
              <DropdownMenuContent className="w-72 p-5 bg-white border-black/10 text-black rounded-2xl shadow-2xl">
                <p className="text-[12px] font-semibold text-black/50 uppercase tracking-wider mb-4">Tranche de prix</p>
                <Slider
                  max={2000} step={50}
                  value={priceRange}
                  onValueChange={val => setPriceRange(Array.isArray(val) ? val : [val, val])}
                  className="py-3"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[13px] font-semibold text-black">{priceRange[0]}$</span>
                  <span className="text-[13px] font-semibold text-black">{priceRange[1]}$</span>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* État */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className={`pill-filter flex-shrink-0 ${selectedConditions.length > 0 ? "active" : ""}`}>
                  {selectedConditions.length > 0 ? (selectedConditions.includes("box") && selectedConditions.includes("pre-owned") ? "Tous états" : selectedConditions.includes("box") ? "Neuf" : "Occasion") : "État"}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              } />
              <DropdownMenuContent className="bg-white border-black/10 text-black p-2 rounded-2xl shadow-2xl">
                {[{ id: "box", label: "Neuf / Box" }, { id: "pre-owned", label: "Occasion" }].map(opt => (
                  <DropdownMenuItem
                    key={opt.id}
                    onClick={() => toggleFilter(selectedConditions, setSelectedConditions, opt.id)}
                    className="flex items-center gap-3 rounded-xl focus:bg-black/5 py-2.5 cursor-pointer"
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedConditions.includes(opt.id) ? "border-blue-600 bg-blue-600" : "border-black/20"
                    }`}>
                      {selectedConditions.includes(opt.id) && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-[13px] font-medium">{opt.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Stockage */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className={`pill-filter flex-shrink-0 ${selectedStorages.length > 0 ? "active" : ""}`}>
                  {selectedStorages.length > 0 ? `${selectedStorages.length} Stockage` : "Stockage"}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              } />
              <DropdownMenuContent className="bg-white border-black/10 text-black p-2 rounded-2xl shadow-2xl">
                {STORAGE_OPTIONS.map(opt => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => toggleFilter(selectedStorages, setSelectedStorages, opt)}
                    className="flex items-center gap-3 rounded-xl focus:bg-black/5 py-2.5 cursor-pointer"
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedStorages.includes(opt) ? "border-blue-600 bg-blue-600" : "border-black/20"
                    }`}>
                      {selectedStorages.includes(opt) && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-[13px] font-medium">{opt}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Couleur */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className={`pill-filter flex-shrink-0 ${selectedColors.length > 0 ? "active" : ""}`}>
                  {selectedColors.length > 0 ? `${selectedColors.length} Couleur` : "Couleur"}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              } />
              <DropdownMenuContent className="bg-white border-black/10 text-black p-2 rounded-2xl shadow-2xl max-h-72 overflow-y-auto">
                {COLOR_OPTIONS.map(opt => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => toggleFilter(selectedColors, setSelectedColors, opt)}
                    className="flex items-center gap-3 rounded-xl focus:bg-black/5 py-2.5 cursor-pointer"
                  >
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColors.includes(opt) ? "border-blue-600 bg-blue-600" : "border-black/20"
                    }`}>
                      {selectedColors.includes(opt) && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-[13px] font-medium">{opt}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-[1px] h-5 bg-black/10 flex-shrink-0" />

            {/* Tri */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className="pill-filter flex-shrink-0 text-black/50">
                  {SORT_LABELS[sortBy]}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              } />
              <DropdownMenuContent className="bg-white border-black/10 text-black rounded-2xl shadow-2xl p-1.5">
                {Object.entries(SORT_LABELS).map(([key, label]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setSortBy(key)}
                    className={`rounded-xl focus:bg-black/5 py-2.5 px-4 text-[13px] cursor-pointer ${
                      sortBy === key ? "text-blue-600 font-semibold" : "text-black/60"
                    }`}
                  >
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Reset */}
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex-shrink-0 flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[12px] font-semibold text-black/50 hover:text-black bg-black/5 hover:bg-black/10 border border-black/10 transition-all"
              >
                <X className="h-3 w-3" />
                Reset ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* ── Product Grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-white shadow-sm border border-black/5">
                <div className="aspect-[3/4] skeleton bg-black/5" />
                <div className="p-4 space-y-2">
                  <div className="h-2.5 w-2/3 skeleton bg-black/5 rounded-full" />
                  <div className="h-3.5 w-full skeleton bg-black/5 rounded-full" />
                  <div className="h-4 w-1/2 skeleton bg-black/5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm group">
                      {/* Image */}
                      <div className="aspect-[3/4] relative overflow-hidden bg-zinc-100 p-5 flex flex-col justify-between">
                        <img
                          src={product.image}
                          alt={product.model}
                          className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Condition badge */}
                        <div className="flex justify-between items-start z-10 relative">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider uppercase ${
                            product.isNew
                              ? "bg-blue-600 text-white"
                              : "bg-white/90 text-black/80 backdrop-blur-md"
                          }`}>
                            {product.isNew ? "Neuf" : "Occasion"}
                          </span>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <p className="text-[10px] text-black/40 uppercase tracking-wider truncate mb-1">
                          {product.color} · {product.storage}
                        </p>
                        <h3 className="text-[13px] font-semibold text-black truncate leading-snug">
                          {product.model}
                        </h3>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-[16px] font-bold text-black">
                            {product.price}$
                            <span className="text-[11px] font-normal text-black/40 ml-1">USD</span>
                          </p>
                          <div className="h-7 w-7 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-200">
                            <svg className="h-3.5 w-3.5 text-black/40 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-28 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/5 border border-black/10 mb-5">
              <Search className="h-6 w-6 text-black/40" />
            </div>
            <h3 className="text-[18px] font-semibold text-black mb-2">Aucun produit trouvé</h3>
            <p className="text-[14px] text-black/50 max-w-sm mx-auto mb-6">
              Modifiez vos filtres ou réinitialisez pour voir tous les iPhones disponibles.
            </p>
            <button
              onClick={resetFilters}
              className="h-10 px-6 text-[13px] font-semibold text-black border border-black/15 rounded-full hover:bg-black/5 transition-all"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F7]">
        <div className="h-6 w-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}
