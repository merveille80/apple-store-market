"use client"

import { motion } from "framer-motion"
import { HelpCircle, ChevronRight } from "lucide-react"
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
      answer: "C'est très simple ! Parcourez le catalogue, choisissez le modèle qui vous intéresse, et cliquez sur 'Commander'. Vous serez redirigé vers le WhatsApp du vendeur pour finaliser l'achat et convenir du mode de remise (en main propre à Kolwezi)."
    },
    {
      question: "Les vendeurs sont-ils de confiance ?",
      answer: "Nous vérifions manuellement l'identité et le stock de chaque vendeur avant de leur accorder le badge 'Vérifié'. Nous vous conseillons de privilégier les vendeurs vérifiés pour une sécurité maximale."
    },
    {
      question: "Puis-je vendre mon propre iPhone ?",
      answer: "Oui ! Cliquez sur 'Devenir Vendeur' pour créer votre store. Une fois votre compte créé, vous pourrez lister vos produits. Notez que votre store devra être validé par notre administration pour apparaître publiquement comme vérifié."
    },
    {
      question: "Quels sont les frais pour les vendeurs ?",
      answer: "L'inscription et la mise en ligne d'annonces sont actuellement gratuites pour tous les vendeurs de Kolwezi. Des options de 'Boost' payantes seront bientôt disponibles pour mettre en avant vos produits."
    },
    {
      question: "Où se font les remises de produits ?",
      answer: "Les transactions se font localement à Kolwezi. Chaque vendeur possède son propre point de vente ou propose des lieux de rendez-vous sécurisés au centre-ville."
    }
  ]

  return (
    <div className="flex flex-col">
      <section className="py-20 lg:py-32 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-16">
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight mb-8 italic uppercase">
              Questions <span className="text-blue-500">Fréquentes</span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Tout ce que vous devez savoir pour acheter ou vendre en toute sécurité sur Apple Store Kolwezi.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
             <div className="grid gap-6">
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border border-white/5 bg-zinc-900 px-8 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-colors">
                      <AccordionTrigger className="hover:no-underline py-6">
                        <span className="text-left font-bold text-white text-lg pr-4">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-8 text-zinc-500 leading-relaxed text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
             </div>

             <div className="p-10 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 text-center space-y-6">
                <HelpCircle className="h-12 w-12 text-blue-500 mx-auto" />
                <h3 className="text-2xl font-black text-white italic uppercase">Vous ne trouvez pas votre réponse ?</h3>
                <p className="text-zinc-400 max-w-sm mx-auto">Notre équipe support est disponible par WhatsApp pour vous aider dans vos démarches.</p>
                <div className="pt-4">
                   <a 
                    href="/contact" 
                    className="inline-flex items-center gap-2 text-white font-bold bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20"
                   >
                    Nous Contacter <ChevronRight className="h-5 w-5" />
                   </a>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
