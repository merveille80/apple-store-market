"use client"

import { motion } from "framer-motion"

const steps = [
  { n: 1, label: "Inscription", hint: "Email, nom du store, WhatsApp" },
  { n: 2, label: "Boutique", hint: "Logo, ville, contact" },
  { n: 3, label: "Annonces", hint: "Photos, prix, état du téléphone" },
  { n: 4, label: "Commandes", hint: "Clients sur WhatsApp, leads dashboard" },
]

export function SellerStoreGuide() {
  return (
    <div className="w-full max-w-[340px] mx-auto md:mx-0 md:ml-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full aspect-square rounded-[32px] bg-[#f5f5f7] border border-black/5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0071e3]/5 to-transparent pointer-events-none" />

        {/* Fenêtre dashboard — remplit tout le carré avec padding fixe */}
        <div className="absolute inset-6 md:inset-7 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 w-full border border-black/10 rounded-2xl bg-white shadow-sm flex flex-col overflow-hidden">
            {/* Barre macOS */}
            <div className="h-9 shrink-0 border-b border-black/5 flex items-center px-3.5 gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <div className="h-2.5 w-2.5 rounded-full bg-black/10" />
              <span className="ml-1.5 text-[10px] font-medium text-[#86868b] tracking-tight truncate">
                Dashboard vendeur
              </span>
            </div>

            <div className="flex-1 min-h-0 p-3.5 flex flex-col gap-2.5">
              <div className="h-5 w-[48%] shrink-0 rounded-md bg-black/5 flex items-center px-2">
                <span className="text-[9px] font-semibold text-black/40 tracking-tight">
                  Ouvrir votre store
                </span>
              </div>

              <div className="flex-1 min-h-0 rounded-xl bg-[#f5f5f7] border border-black/5 p-3 flex flex-col justify-center gap-2 overflow-hidden">
                {steps.map((step) => (
                  <div key={step.n} className="flex items-start gap-2">
                    <span className="h-5 w-5 shrink-0 rounded-full bg-[#0071e3]/10 text-[#0071e3] text-[10px] font-semibold flex items-center justify-center mt-px">
                      {step.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-[#1d1d1f] leading-tight">
                        {step.label}
                      </p>
                      <p className="text-[9px] text-[#86868b] leading-snug line-clamp-2">
                        {step.hint}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 shrink-0">
                <div className="h-7 flex-1 rounded-lg bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center px-1">
                  <span className="text-[9px] font-semibold text-[#0071e3] text-center leading-none">
                    Créer mon store
                  </span>
                </div>
                <div className="h-7 flex-1 rounded-lg bg-black/5 border border-black/5 flex items-center justify-center">
                  <span className="text-[9px] font-medium text-[#86868b]">+ iPhone</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
