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
      setMessage({ type: 'success', text: "Lien envoyé ! Vérifiez votre boîte mail (et les spams)." })
      setEmail("")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6"
      >
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la connexion
        </Link>
        
        <div className="text-center mb-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500 mb-6 font-black text-2xl">
            ASK
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Mot de passe oublié</h1>
          <p className="text-zinc-500 mt-2">Recevez un lien sécurisé pour créer un nouveau mot de passe.</p>
        </div>

        <Card className="bg-zinc-900 border-white/10 rounded-3xl overflow-hidden">
          <form onSubmit={handleReset}>
            <CardHeader>
              <CardTitle className="text-xl">Réinitialisation</CardTitle>
              <CardDescription className="text-zinc-500">Saisissez l'email associé à votre compte vendeur.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {message && (
                <div className={`p-3 rounded-lg border text-sm ${
                  message.type === 'error' 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                }`}>
                  {message.text}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                  <Input 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="pl-10 bg-black border-white/5 h-12 rounded-xl"
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
                className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl"
                disabled={isLoading || !email}
              >
                {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
