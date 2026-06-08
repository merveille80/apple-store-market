"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (!supabase) {
      setMessage({ type: 'error', text: "Erreur de configuration Supabase." })
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: "Lien envoyé. Vérifiez votre boîte mail (et les spams)." })
      setEmail("")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-[80vh] bg-[#f5f5f7] flex justify-center items-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        <Link href="/login" className="inline-flex items-center text-[14px] font-medium text-[#0071e3] hover:text-[#0077ed] transition-colors">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Retour à la connexion
        </Link>
        
        <div className="text-center mb-6">
          <h1 className="font-sf-display text-[28px] font-semibold text-[#1d1d1f] tracking-[-0.03em]">Mot de passe oublié</h1>
          <p className="text-[#6e6e73] text-[15px] mt-2">Recevez un lien pour créer un nouveau mot de passe.</p>
        </div>

        <Card className="bg-white border-black/5 shadow-sm rounded-[28px] overflow-hidden">
          <form onSubmit={handleReset}>
            <CardHeader>
              <CardTitle className="font-sf-display text-xl font-semibold text-[#1d1d1f]">Réinitialisation</CardTitle>
              <CardDescription className="text-[#6e6e73]">Saisissez l&apos;email de votre compte vendeur.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {message && (
                <div className={`p-3 rounded-xl border text-[14px] ${
                  message.type === 'error' 
                    ? 'bg-red-500/10 border-red-500/20 text-red-600' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700'
                }`}>
                  {message.text}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-[#86868b]">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#86868b]" />
                  <Input 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="pl-10 bg-white border-black/10 h-12 rounded-xl text-[#1d1d1f]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full h-11 bg-[#0071e3] text-white hover:bg-[#0077ed] font-medium rounded-full"
                disabled={isLoading || !email}
              >
                {isLoading ? "Envoi en cours…" : "Envoyer le lien"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
