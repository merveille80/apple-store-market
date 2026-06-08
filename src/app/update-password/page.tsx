"use client"

import { useState, useEffect, Suspense } from "react"
import { motion } from "framer-motion"
import { Lock, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

function UpdatePasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Supabase client automatically handles the #access_token fragment from the recovery email
    // and establishes a session. We just need to wait for the user to submit their new password.
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // If they visit this URL without a recovery token, they shouldn't be here
        // We'll let them try anyway, but it will probably fail if there's no active session.
      }
    }
    checkSession()
  }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "Les mots de passe ne correspondent pas." })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: "Le mot de passe doit faire au moins 6 caractères." })
      setIsLoading(false)
      return
    }

    if (!supabase) {
      setMessage({ type: 'error', text: "Erreur de configuration." })
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: "Mot de passe mis à jour avec succès !" })
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-[80vh] bg-[#f5f5f7] flex justify-center items-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6"
      >
        <div className="text-center mb-6">
          <h1 className="font-sf-display text-[28px] font-semibold text-[#1d1d1f] tracking-[-0.03em]">Nouveau mot de passe</h1>
          <p className="text-[#6e6e73] text-[15px] mt-2">Créez un mot de passe pour accéder à votre boutique.</p>
        </div>

        <Card className="bg-white border-black/5 rounded-[28px] overflow-hidden shadow-sm">
          <form onSubmit={handleUpdate}>
            <CardHeader>
              <CardTitle className="font-sf-display text-xl font-semibold text-[#1d1d1f]">Sécurisez votre compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {message && (
                <div className={`p-3 rounded-lg border text-sm ${
                  message.type === 'error' 
                    ? 'bg-red-500/10 border-red-500/20 text-red-600' 
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700'
                }`}>
                  {message.text}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-[#86868b]">Nouveau mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-zinc-50 border-black/10 h-12 rounded-xl text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-[#86868b]">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-zinc-50 border-black/10 h-12 rounded-xl text-black"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full h-11 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-full"
                disabled={isLoading || !password || !confirmPassword || message?.type === 'success'}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sauvegarder"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      </div>
    }>
      <UpdatePasswordContent />
    </Suspense>
  )
}
