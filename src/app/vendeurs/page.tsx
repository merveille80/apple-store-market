"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShieldCheck, MapPin, Phone, Store, ArrowRight, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { StoreCardSkeleton } from "@/components/ui/skeletons"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function VendeursPage() {
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isConfigured, setIsConfigured] = useState(true)

  useEffect(() => {
    async function fetchStores() {
      setLoading(true)
      const supabase = createClient()

      if (!supabase) {
        setIsConfigured(false)
        setStores([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("stores")
        .select(`*, products (count)`)
        .order("is_verified", { ascending: false })
        .order("name")

      if (error || !data) {
        setStores([])
      } else {
        const formatted = data.map((s) => ({
          id: s.id,
          name: s.name,
          city: s.city || "Kolwezi",
          listings: s.products?.[0]?.count || 0,
          verified: s.is_verified,
          whatsapp: s.whatsapp_number,
          logo: s.logo_url || null,
          slug: s.slug,
        }))
        setStores(formatted)
      }
      setLoading(false)
    }

    fetchStores()
  }, [])

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-5 py-16 lg:py-24 max-w-[980px]">
          <Skeleton className="h-10 w-56 mb-4 rounded-lg" />
          <Skeleton className="h-5 w-full max-w-lg mb-12 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <StoreCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-16">
      <section className="pt-14 pb-10 md:pt-20 md:pb-12">
        <div className="container mx-auto px-5 max-w-[980px]">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <p className="text-[13px] font-medium text-[#0071e3] tracking-tight">Vendeurs</p>
            {!isConfigured && (
              <Badge
                variant="outline"
                className="border-amber-500/40 text-amber-600 px-2.5 py-0.5 text-[11px] font-medium bg-amber-500/5 rounded-full"
              >
                Mode démo
              </Badge>
            )}
          </div>
          <h1 className="font-sf-display text-[clamp(2rem,5vw,3.25rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-tight">
            Nos vendeurs
          </h1>
          <p className="mt-4 text-[17px] text-[#6e6e73] leading-[1.5] max-w-2xl tracking-[-0.01em]">
            Des professionnels certifiés à Kolwezi. Découvrez les boutiques qui proposent des
            iPhones vérifiés et un contact WhatsApp direct.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-5 max-w-[980px] pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {stores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <div className="card-apple h-full flex flex-col p-7 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-black/[0.02] border border-black/[0.04] flex items-center justify-center overflow-hidden">
                    {store.logo ? (
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Store className="h-6 w-6 text-[#86868b]" strokeWidth={1.5} />
                    )}
                  </div>
                  {store.verified ? (
                    <Badge className="bg-[#0071e3] text-white border-none rounded-full px-2.5 py-1 flex items-center gap-1 text-[11px] font-medium">
                      <ShieldCheck className="h-3 w-3" /> Vérifié
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[#86868b] border-black/10 rounded-full px-2.5 py-1 text-[11px] font-medium"
                    >
                      En attente
                    </Badge>
                  )}
                </div>

                <h3 className="font-sf-display text-[18px] font-semibold text-[#1d1d1f] tracking-[-0.02em] mb-3 group-hover:text-[#0071e3] transition-colors">
                  {store.name}
                </h3>

                <div className="space-y-2 mb-8 flex-1">
                  <div className="flex items-center gap-2 text-[14px] text-[#6e6e73]">
                    <MapPin className="h-4 w-4 text-[#86868b]" strokeWidth={1.5} />
                    {store.city}, RDC
                  </div>
                  <div className="flex items-center gap-2 text-[14px] text-[#6e6e73]">
                    <Smartphone className="h-4 w-4 text-[#86868b]" strokeWidth={1.5} />
                    {store.listings} annonce{store.listings !== 1 ? "s" : ""} active
                  </div>
                </div>

                <div className="pt-5 border-t border-black/[0.06] flex items-center justify-between">
                  <a
                    href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                    aria-label={`WhatsApp ${store.name}`}
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                  <Link
                    href={`/vendeur/${store.slug}`}
                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0071e3] hover:underline underline-offset-4"
                  >
                    Voir la boutique
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {stores.length === 0 && !loading && (
          <div className="py-24 text-center">
            <p className="text-[15px] text-[#86868b]">Aucun vendeur certifié pour le moment.</p>
          </div>
        )}
      </section>
    </div>
  )
}
