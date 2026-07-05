"use client"

import { motion } from "framer-motion"
import { Mail, MapPin, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  return (
    <div className="flex flex-col bg-white">
      <section className="pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="container mx-auto px-5 max-w-[980px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-14 md:mb-20"
          >
            <p className="text-[13px] font-medium text-[#0071e3] tracking-tight mb-3">
              Contact
            </p>
            <h1 className="font-sf-display text-[clamp(2rem,5vw,3.5rem)] font-semibold tracking-[-0.03em] text-[#1d1d1f] mb-5">
              Nous contacter
            </h1>
            <p className="text-[17px] md:text-[19px] text-[#6e6e73] leading-relaxed max-w-[600px] mx-auto">
              Une question sur un produit ou sur notre plateforme ? Notre équipe est là pour vous aider à Kolwezi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-[1100px] mx-auto">
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "support@applestorekolwezi.com",
                  color: "text-[#0071e3]",
                  bg: "bg-[#0071e3]/10",
                },
                {
                  icon: MessageSquare,
                  title: "WhatsApp Support",
                  value: "+243 000 000 000",
                  color: "text-emerald-600",
                  bg: "bg-emerald-500/10",
                },
                {
                  icon: MapPin,
                  title: "Bureau",
                  value: "Avenue du Commerce, Kolwezi, Lualaba",
                  color: "text-[#0071e3]",
                  bg: "bg-[#0071e3]/10",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card-apple p-6 md:p-7 flex gap-5"
                >
                  <div className={`h-11 w-11 rounded-2xl ${item.bg} flex items-center justify-center shrink-0`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-[15px] text-[#1d1d1f] mb-1">{item.title}</h3>
                    <p className="text-[14px] text-[#6e6e73]">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card-apple p-8 md:p-10"
            >
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#86868b]">Nom</label>
                    <Input
                      className="bg-white border-black/10 h-12 rounded-xl text-[15px] placeholder:text-[#86868b]"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#86868b]">Email</label>
                    <Input
                      className="bg-white border-black/10 h-12 rounded-xl text-[15px] placeholder:text-[#86868b]"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#86868b]">Sujet</label>
                  <Input
                    className="bg-white border-black/10 h-12 rounded-xl text-[15px] placeholder:text-[#86868b]"
                    placeholder="Comment pouvons-nous vous aider ?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#86868b]">Message</label>
                  <Textarea
                    className="bg-white border-black/10 min-h-[140px] rounded-xl p-4 text-[15px] placeholder:text-[#86868b] resize-none"
                    placeholder="Votre message..."
                  />
                </div>
                <Button className="w-full h-11 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-full text-[15px]">
                  Envoyer le message <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
