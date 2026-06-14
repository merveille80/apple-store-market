"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Smartphone, ArrowRight, Store, Phone, LayoutGrid } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type ProductHit = {
  id: string
  model: string
  price: number
  storage: string
  color: string | null
  image: string
}

const QUICK_LINKS = [
  { href: "/catalog", label: "Voir tout le catalogue", icon: LayoutGrid },
  { href: "/vendeurs", label: "Nos vendeurs", icon: Store },
  { href: "/contact", label: "Nous contacter", icon: Phone },
] as const

export function CommandSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<ProductHit[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const fetchedRef = useRef(false)

  // Raccourci clavier ⌘K / Ctrl+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  // Chargement des produits à la première ouverture
  useEffect(() => {
    if (!open || fetchedRef.current) return
    fetchedRef.current = true
    const supabase = createClient()
    if (!supabase) return
    setLoading(true)
    supabase
      .from("products")
      .select("id, model_name, price_usd, storage_gb, color, product_images (image_url)")
      .eq("status", "available")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setProducts(
          (data ?? []).map((p: any) => ({
            id: p.id,
            model: p.model_name,
            price: Number(p.price_usd),
            storage: `${p.storage_gb}GB`,
            color: p.color,
            image: p.product_images?.[0]?.image_url || "/placeholder.svg",
          }))
        )
        setLoading(false)
      })
  }, [open])

  useEffect(() => {
    if (open) {
      setQuery("")
      setActiveIndex(0)
      // focus après le montage du dialog
      requestAnimationFrame(() => inputRef.current?.focus())
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const hits = useMemo(() => {
    if (!products) return []
    const q = query.trim().toLowerCase()
    const list = q
      ? products.filter(
          (p) =>
            p.model.toLowerCase().includes(q) ||
            p.storage.toLowerCase().includes(q) ||
            (p.color ?? "").toLowerCase().includes(q)
        )
      : products
    return list.slice(0, 6)
  }, [products, query])

  const totalItems = hits.length + QUICK_LINKS.length

  const navigate = useCallback(
    (index: number) => {
      if (index < hits.length) {
        router.push(`/product/${hits[index].id}`)
      } else {
        router.push(QUICK_LINKS[index - hits.length].href)
      }
      setOpen(false)
    },
    [hits, router]
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false)
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % totalItems)
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + totalItems) % totalItems)
    }
    if (e.key === "Enter" && totalItems > 0) {
      e.preventDefault()
      navigate(activeIndex)
    }
  }

  useEffect(() => setActiveIndex(0), [query])

  return (
    <>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Rechercher un iPhone"
        className="flex items-center justify-center gap-2 h-10 w-10 md:h-9 md:w-auto md:px-3.5 rounded-full bg-black/[0.04] hover:bg-black/[0.07] active:bg-black/[0.09] border border-black/[0.06] text-[#6e6e73] transition-colors"
      >
        <Search className="h-[16px] w-[16px] md:h-[15px] md:w-[15px]" />
        <span className="hidden md:inline text-[13px] tracking-[-0.01em]">Rechercher</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 rounded-md bg-white border border-black/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-[#86868b]">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm flex items-start justify-center pt-[6vh] sm:pt-[12vh] px-3 sm:px-4"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setOpen(false)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-[560px] rounded-[20px] bg-white shadow-[0_24px_80px_-12px_rgba(0,0,0,0.35)] border border-black/[0.06] overflow-hidden"
              role="dialog"
              aria-label="Recherche"
            >
              {/* Input */}
              <div className="flex items-center gap-3 px-4 sm:px-5 h-[52px] sm:h-14 border-b border-black/[0.06]">
                <Search className="h-[18px] w-[18px] text-[#86868b] shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Rechercher un iPhone…"
                  // 16px mini sur mobile pour éviter le zoom automatique iOS
                  className="flex-1 min-w-0 bg-transparent outline-none text-[16px] sm:text-[15px] text-[#1d1d1f] placeholder:text-[#86868b]"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="sm:hidden text-[13px] font-medium text-[#0071e3] px-1 py-2"
                >
                  Fermer
                </button>
                <kbd className="hidden sm:inline rounded-md bg-black/[0.04] border border-black/[0.08] px-1.5 py-0.5 text-[10px] font-medium text-[#86868b]">
                  ESC
                </kbd>
              </div>

              {/* Résultats */}
              <div className="max-h-[58vh] sm:max-h-[52vh] overflow-y-auto overscroll-contain p-2">
                {loading && (
                  <div className="py-10 text-center text-[13px] text-[#86868b]">
                    Chargement du catalogue…
                  </div>
                )}

                {!loading && hits.length > 0 && (
                  <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#86868b]">
                    iPhones disponibles
                  </p>
                )}

                {!loading &&
                  hits.map((p, i) => (
                    <button
                      key={p.id}
                      onClick={() => navigate(i)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full flex items-center gap-3.5 rounded-[14px] px-3 py-3 sm:py-2.5 min-h-[56px] sm:min-h-0 text-left transition-colors active:bg-[#0071e3]/[0.1] ${
                        activeIndex === i ? "bg-[#0071e3]/[0.07]" : ""
                      }`}
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f7] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="h-9 w-9 object-contain" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[14px] font-medium text-[#1d1d1f] truncate">
                          {p.model}
                        </span>
                        <span className="block text-[12px] text-[#86868b]">
                          {p.storage}
                          {p.color ? ` · ${p.color}` : ""}
                        </span>
                      </span>
                      <span className="text-[14px] font-semibold text-[#1d1d1f] tabular-nums">
                        {p.price}$
                      </span>
                      <ArrowRight
                        className={`h-4 w-4 text-[#0071e3] transition-opacity ${
                          activeIndex === i ? "opacity-100" : "opacity-0"
                        }`}
                      />
                    </button>
                  ))}

                {!loading && query.trim() && hits.length === 0 && (
                  <div className="py-10 text-center">
                    <Smartphone className="h-6 w-6 text-[#86868b] mx-auto mb-2" />
                    <p className="text-[14px] text-[#6e6e73]">
                      Aucun iPhone ne correspond à « {query} »
                    </p>
                  </div>
                )}

                {/* Liens rapides */}
                <p className="px-3 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#86868b]">
                  Navigation
                </p>
                {QUICK_LINKS.map((link, j) => {
                  const idx = hits.length + j
                  const Icon = link.icon
                  return (
                    <button
                      key={link.href}
                      onClick={() => navigate(idx)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-center gap-3.5 rounded-[14px] px-3 py-3 sm:py-2.5 min-h-[48px] sm:min-h-0 text-left transition-colors active:bg-[#0071e3]/[0.1] ${
                        activeIndex === idx ? "bg-[#0071e3]/[0.07]" : ""
                      }`}
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5f5f7]">
                        <Icon className="h-4 w-4 text-[#6e6e73]" />
                      </span>
                      <span className="text-[14px] text-[#1d1d1f]">{link.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="hidden sm:flex items-center gap-4 px-5 py-2.5 border-t border-black/[0.06] bg-[#fafafa] text-[11px] text-[#86868b]">
                <span><kbd className="font-medium">↑↓</kbd> naviguer</span>
                <span><kbd className="font-medium">↵</kbd> ouvrir</span>
                <span className="ml-auto">Apple Store Kolwezi</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
