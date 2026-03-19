"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, SlidersHorizontal, ChevronDown, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useSearchParams } from "next/navigation"

function CatalogContent() {
  const searchParams = useSearchParams()
  const storeFilter = searchParams.get('store')

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      const supabase = createClient()

      if (!supabase) {
        setIsConfigured(false)
        setProducts([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          stores (name, city),
          product_images (image_url)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        setProducts([])
      } else {
        // Map DB data to UI structure
        const formattedData = data.map(p => ({
          id: p.id,
          model: p.model_name,
          price: Number(p.price_usd),
          storage: `${p.storage_gb}GB`,
          condition: p.condition,
          color: p.color,
          image: p.product_images?.[0]?.image_url || "/placeholder.svg",
          battery: p.battery_health,
          storeId: p.store_id
        }))
        setProducts(formattedData)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.model.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition)
    const matchesStore = !storeFilter || product.storeId === storeFilter
    return matchesSearch && matchesPrice && matchesCondition && matchesStore
  })

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Catalogue iPhone</h1>
            <p className="text-zinc-400">Trouvez le compagnon idéal parmi notre sélection à Kolwezi.</p>
          </div>
          {!isConfigured && (
            <Badge variant="outline" className="border-amber-500/50 text-amber-500 px-4 py-2 text-xs bg-amber-500/5 w-fit h-fit">
              Mode Démo activé (Données fictives)
            </Badge>
          )}
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-white/10 backdrop-blur-sm sticky top-20 z-40">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Rechercher un modèle..."
              className="pl-10 bg-black/50 border-white/10 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" className="border-white/10 bg-black/50 rounded-xl">
                  Prix: {priceRange[0]}$ - {priceRange[1]}$ <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              } />
              <DropdownMenuContent className="w-80 p-6 bg-zinc-900 border-white/10 text-white">
                <div className="space-y-4">
                  <h4 className="font-bold">Tranche de prix</h4>
                  <Slider
                    defaultValue={[0, 2000]}
                    max={2000}
                    step={50}
                    value={priceRange}
                    onValueChange={(val) => setPriceRange(Array.isArray(val) ? val : [val, val])}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-zinc-400">
                    <span>{priceRange[0]}$</span>
                    <span>{priceRange[1]}$</span>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" className="border-white/10 bg-black/50 rounded-xl">
                  État <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              } />
              <DropdownMenuContent className="w-56 bg-zinc-900 border-white/10 text-white p-2">
                <div className="space-y-2 p-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="box"
                      checked={selectedConditions.includes("box")}
                      onCheckedChange={() => toggleCondition("box")}
                    />
                    <label htmlFor="box" className="text-sm font-medium">Box / Neuf</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pre-owned"
                      checked={selectedConditions.includes("pre-owned")}
                      onCheckedChange={() => toggleCondition("pre-owned")}
                    />
                    <label htmlFor="pre-owned" className="text-sm font-medium">Occasion</label>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" className="border-white/10 bg-black/50 rounded-xl">
                  Trier par <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              } />
              <DropdownMenuContent className="bg-zinc-900 border-white/10 text-white">
                <DropdownMenuItem onClick={() => setSortBy("recent")}>Plus récents</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-low")}>Prix: Croissant</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("price-high")}>Prix: Décroissant</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            <p className="text-zinc-400 animate-pulse">Chargement des iPhones...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-zinc-900 border-white/10 overflow-hidden group hover:border-blue-500/50 transition-colors h-full flex flex-col">
                    <div className="aspect-square relative overflow-hidden bg-zinc-800">
                      <img
                        src={product.image}
                        alt={product.model}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className={`absolute top-2 right-2 font-black text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 border-0 shadow-lg ${product.condition === 'box' ? 'bg-blue-600' : 'bg-zinc-700'
                        }`}>
                        {product.condition === 'box' ? '✦ Neuf' : 'Occasion'}
                      </Badge>
                    </div>
                    <CardContent className="p-3 sm:p-5 flex-1">
                      <div className="mb-2">
                        <h3 className="text-sm sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-tight truncate">
                          {product.model}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-zinc-500 truncate">{product.color} • {product.storage}</p>
                      </div>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-lg sm:text-2xl font-black text-white">{product.price}$</span>
                        <span className="text-[10px] sm:text-xs text-zinc-500 font-medium">USD</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-3 pt-0 sm:p-5 sm:pt-0">
                      <Link href={`/product/${product.id}`} className="w-full">
                        <Button className="w-full bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-sm h-10 sm:h-12">
                          Commander
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-zinc-900 border border-white/10">
              <Search className="h-8 w-8 text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold text-white">Aucun produit trouvé</h3>
            <p className="text-zinc-400 max-w-sm mx-auto">
              Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
            </p>
            <Button variant="link" className="text-blue-500" onClick={() => {
              setSearchQuery("")
              setPriceRange([0, 2000])
              setSelectedConditions([])
            }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CatalogContent />
    </Suspense>
  )
}
