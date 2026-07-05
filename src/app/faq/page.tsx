"use client"

import { motion } from "framer-motion"
import { HelpCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "Comment puis-je acheter un iPhone sur la plateforme ?",
      answer:
        "Parcourez le catalogue, choisissez le modèle qui vous intéresse, puis cliquez sur « Commander ». Vous serez redirigé vers le WhatsApp du vendeur pour finaliser l'achat et convenir du mode de remise à Kolwezi.",
    },
    {
      question: "Les vendeurs sont-ils de confiance ?",
      answer:
        "Nous vérifions manuellement l'identité et le stock de chaque vendeur avant de leur accorder le badge « Vérifié ». Privilégiez les vendeurs vérifiés pour une sécurité maximale.",
    },
    {
      question: "Puis-je vendre mon propre iPhone ?",
      answer:
        "Oui. Cliquez sur « Devenir vendeur » pour créer votre boutique. Une fois votre compte créé, vous pourrez lister vos produits. Votre boutique devra être validée par notre administration pour apparaître comme vérifiée.",
    },
    {
      question: "Quels sont les frais pour les vendeurs ?",
      answer:
        "L'inscription et la mise en ligne d'annonces sont actuellement gratuites pour tous les vendeurs de Kolwezi. Des options de mise en avant payantes seront bientôt disponibles.",
    },
    {
      question: "Où se font les remises de produits ?",
      answer:
        "Les transactions se font localement à Kolwezi. Chaque vendeur possède son propre point de vente ou propose des lieux de rendez-vous sécurisés au centre-ville.",
    },
  ]

  return (
    <div className="flex flex-col bg-white">
      <section className="pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="container mx-auto px-5 max-w-[980px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14 md:mb-16"
          >
            <p className="text-[13px] font-medium text-[#0071e3] tracking-tight mb-3">
              FAQ
            </p>
            <h1 className="font-sf-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f] mb-5">
              Questions fréquentes
            </h1>
            <p className="text-[17px] md:text-[19px] text-[#6e6e73] leading-relaxed max-w-[600px] mx-auto">
              Tout ce que vous devez savoir pour acheter ou vendre en toute sécurité sur Apple Store Kolwezi.
            </p>
          </motion.div>

          <div className="max-w-[720px] mx-auto space-y-10">
            <Accordion multiple={false} className="w-full space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <AccordionItem
                    value={`item-${i}`}
                    className="card-apple border-none px-6 md:px-8 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-5 md:py-6">
                      <span className="text-left font-medium text-[#1d1d1f] text-[15px] md:text-[17px] pr-4 leading-snug">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-[#6e6e73] leading-relaxed text-[15px]">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="card-apple p-8 md:p-10 text-center space-y-5"
            >
              <HelpCircle className="h-10 w-10 text-[#0071e3] mx-auto" />
              <h3 className="font-sf-display text-[22px] md:text-[24px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                Vous ne trouvez pas votre réponse ?
              </h3>
              <p className="text-[15px] text-[#6e6e73] max-w-sm mx-auto">
                Notre équipe support est disponible par WhatsApp pour vous aider dans vos démarches.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-white font-medium bg-[#0071e3] hover:bg-[#0077ed] px-6 h-11 rounded-full transition-colors text-[15px]"
              >
                Nous contacter <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
