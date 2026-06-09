"use client"

import { motion } from "framer-motion"
import { Smartphone, MessageSquare, BarChart3, Package, ChevronRight } from "lucide-react"

const steps = [
  { n: 1, label: "Inscription", hint: "Email & WhatsApp" },
  { n: 2, label: "Boutique", hint: "Logo & ville" },
  { n: 3, label: "Annonces", hint: "Photos & prix" },
  { n: 4, label: "Ventes", hint: "Leads WhatsApp" },
]

export function SellerStoreGuide() {
  return (
    <div className="w-full max-w-[380px] mx-auto md:mx-0 md:ml-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="rounded-[24px] bg-white border border-black/[0.06] shadow-[0_24px_64px_-28px_rgba(0,0,0,0.18)] overflow-hidden"
      >
        {/* Barre macOS */}
        <div className="h-10 bg-[#f5f5f7] border-b border-black/5 flex items-center px-4 gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="size-[10px] rounded-full bg-[#ff5f57]/90" />
            <span className="size-[10px] rounded-full bg-[#febc2e]/90" />
            <span className="size-[10px] rounded-full bg-[#28c840]/90" />
          </div>
          <span className="text-[11px] font-medium text-[#86868b] truncate">
            Dashboard vendeur
          </span>
        </div>

        <div className="flex min-h-[300px]">
          {/* Mini sidebar */}
          <aside className="w-[68px] shrink-0 bg-[#fafafa] border-r border-black/5 py-4 px-2.5 flex flex-col gap-2">
            <div className="h-8 rounded-xl bg-[#0071e3] flex items-center justify-center">
              <BarChart3 className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="h-7 rounded-lg bg-black/[0.04]" />
            <div className="h-7 rounded-lg bg-black/[0.04]" />
            <div className="h-7 rounded-lg bg-black/[0.04]" />
          </aside>

          {/* Contenu */}
          <div className="flex-1 min-w-0 p-4 flex flex-col gap-3 bg-white">
            <div>
              <p className="text-[13px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                Mon store
              </p>
              <p className="text-[11px] text-[#86868b] mt-0.5">Kolwezi · Vérifié</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Leads", value: "12", icon: MessageSquare },
                { label: "Stock", value: "8", icon: Package },
                { label: "Vues", value: "240", icon: BarChart3 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-[#f5f5f7] border border-black/[0.04] px-2 py-2"
                >
                  <stat.icon className="h-3 w-3 text-[#0071e3] mb-1" />
                  <p className="text-[13px] font-semibold text-[#1d1d1f] leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[9px] text-[#86868b] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Produit */}
            <div className="rounded-xl border border-black/[0.06] bg-white px-2.5 py-2 flex items-center gap-2.5 shadow-sm">
              <div className="h-10 w-10 rounded-lg bg-[#f5f5f7] border border-black/[0.04] flex items-center justify-center shrink-0">
                <Smartphone className="h-4 w-4 text-[#1d1d1f]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-[#1d1d1f] truncate">
                  iPhone 16 Pro · 256 Go
                </p>
                <p className="text-[10px] text-[#86868b]">Neuf · Face ID OK</p>
              </div>
              <p className="text-[11px] font-semibold text-[#0071e3] shrink-0">$1 050</p>
            </div>

            {/* Notification lead */}
            <div className="rounded-xl bg-[#0071e3]/[0.07] border border-[#0071e3]/15 px-3 py-2 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[#0071e3] flex items-center justify-center shrink-0">
                <MessageSquare className="h-3 w-3 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-[#1d1d1f]">Nouveau lead</p>
                <p className="text-[9px] text-[#6e6e73] truncate">Client intéressé par iPhone 16</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-[#0071e3] shrink-0" />
            </div>

            {/* Étapes */}
            <div className="grid grid-cols-2 gap-1.5 mt-auto pt-1">
              {steps.map((step) => (
                <div
                  key={step.n}
                  className="flex items-center gap-1.5 rounded-lg bg-[#f5f5f7] px-2 py-1.5 border border-black/[0.03]"
                >
                  <span className="h-4 w-4 shrink-0 rounded-full bg-[#0071e3] text-white text-[8px] font-semibold flex items-center justify-center">
                    {step.n}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold text-[#1d1d1f] leading-none">
                      {step.label}
                    </p>
                    <p className="text-[8px] text-[#86868b] truncate">{step.hint}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-0.5">
              <div className="h-8 flex-1 rounded-full bg-[#0071e3] flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-semibold text-white">Créer mon store</span>
              </div>
              <div className="h-8 px-3 rounded-full border border-black/10 bg-white flex items-center justify-center">
                <span className="text-[10px] font-medium text-[#1d1d1f]">+ iPhone</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
