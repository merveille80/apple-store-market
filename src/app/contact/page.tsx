"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <section className="py-20 lg:py-32 bg-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-16">
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight mb-8 italic uppercase">
              Contactez <span className="text-blue-500">Nous</span>
            </h1>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Une question sur un produit ou sur notre plateforme ? Notre équipe est là pour vous aider à Kolwezi.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div className="grid gap-8">
                <Card className="bg-zinc-900 border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-colors">
                  <div className="flex gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Email</h3>
                      <p className="text-zinc-500">support@applestorekolwezi.com</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-zinc-900 border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-colors">
                  <div className="flex gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">WhatsApp Support</h3>
                      <p className="text-zinc-500">+243 000 000 000</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-zinc-900 border-white/5 rounded-3xl p-8 hover:border-blue-500/30 transition-colors">
                  <div className="flex gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">Bureau</h3>
                      <p className="text-zinc-500">Avenue du Commerce, Kolwezi, Lualaba</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-zinc-900 border-white/5 rounded-[2.5rem] p-10 lg:p-12">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Nom</label>
                    <Input className="bg-black border-white/5 h-14 rounded-2xl" placeholder="Votre nom" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Email</label>
                    <Input className="bg-black border-white/5 h-14 rounded-2xl" placeholder="votre@email.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Sujet</label>
                  <Input className="bg-black border-white/5 h-14 rounded-2xl" placeholder="Comment pouvons-nous vous aider ?" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Message</label>
                  <Textarea className="bg-black border-white/5 min-h-[150px] rounded-2xl p-6" placeholder="Votre message..." />
                </div>
                <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-lg shadow-xl shadow-blue-500/20">
                  Envoyer le Message <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
