"use client"

import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import { Apple, Mail, Lock, Smartphone, ArrowRight, Store, Phone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [storeName, setStoreName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam === 'register' ? 'register' : 'login')

  useEffect(() => {
    if (tabParam === 'register') {
      setActiveTab('register')
    } else if (tabParam === 'login') {
      setActiveTab('login')
    }
  }, [tabParam])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    if (!supabase) {
      setError(`Configuration Supabase manquante ou invalide. Veuillez vérifier votre .env.local`)
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      toast.error("Échec de la connexion : " + error.message)
      setIsLoading(false)
    } else {
      toast.success("Bon retour !")
      router.push("/dashboard")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!supabase) {
      setError("Supabase n'est pas configuré. Veuillez vérifier votre fichier .env.local")
      setIsLoading(false)
      return
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: storeName,
          role: "seller",
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    if (data.user) {
      // Small delay to allow the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Create store entry
      const { error: storeError } = await supabase.from("stores").insert({
        profile_id: data.user.id,
        name: storeName,
        slug: storeName.toLowerCase().replace(/\s+/g, '-'),
        whatsapp_number: whatsappNumber,
        city: 'Kolwezi',
      })

      if (storeError) {
        console.error("Store Creation Error Full:", JSON.stringify(storeError, null, 2))
        const errorMessage = storeError.message || "Erreur inconnue"
        const errorCode = storeError.code || "N/A"
        
        if (errorCode === "PGRST204") {
          setError(`La table 'stores' est manquante. Avez-vous exécuté le script SQL dans Supabase ?`)
        } else {
          setError(`Erreur lors de la création du store : ${errorMessage} (Code: ${errorCode}).`)
        }
        toast.error("Erreur lors de l'inscription.")
        setIsLoading(false)
      } else {
        toast.success("Compte et Store créés avec succès !")
        router.push("/dashboard")
      }
    }
  }

  return (
    <div className="min-h-[80vh] bg-[#f5f5f7] flex justify-center items-center px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <svg viewBox="0 0 24 24" aria-hidden className="h-8 w-8 fill-[#1d1d1f] mx-auto mb-5">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          <h1 className="font-sf-display text-[28px] font-semibold text-[#1d1d1f] tracking-[-0.03em]">Espace vendeur</h1>
          <p className="text-[#6e6e73] text-[15px] mt-2">Gérez vos annonces sur Apple Store Kolwezi.</p>
        </div>

        <div className="flex bg-white border border-black/5 p-1 rounded-full mb-8 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 rounded-full font-medium text-[14px] transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-[#0071e3] text-white'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 rounded-full font-medium text-[14px] transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-[#0071e3] text-white'
                : 'text-[#86868b] hover:text-[#1d1d1f]'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Login Panel */}
        {activeTab === 'login' && (
          <Card className="bg-white border-black/5 shadow-sm rounded-[28px] overflow-hidden">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="font-sf-display text-xl font-semibold text-[#1d1d1f]">Bon retour</CardTitle>
                <CardDescription className="text-[#6e6e73]">Connectez-vous à votre compte store.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#86868b]">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                    <Input 
                      type="email" 
                      placeholder="votre@email.com" 
                      className="pl-10 bg-zinc-50 border-black/10 h-12 rounded-xl text-black"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-medium text-[#86868b]">Mot de passe</label>
                    <Link href="/reset-password" className="text-[13px] font-medium text-[#0071e3] hover:text-[#0077ed] transition-colors">
                      Oublié ?
                    </Link>
                  </div>
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
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#0071e3] text-white hover:bg-[#0077ed] font-medium rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion..." : "Se Connecter"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Register Panel */}
        {activeTab === 'register' && (
          <Card className="bg-white border-black/5 shadow-sm rounded-[28px] overflow-hidden">
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle className="font-sf-display text-xl font-semibold text-[#1d1d1f]">Devenir vendeur</CardTitle>
                <CardDescription className="text-[#6e6e73]">Créez votre boutique en quelques secondes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      placeholder="Nom du Store" 
                      className="pl-12 bg-zinc-50 border-black/10 h-14 rounded-2xl text-black placeholder:text-black/40 focus:border-blue-500/50 transition-all"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      placeholder="Numéro WhatsApp (ex: +243...)" 
                      className="pl-12 bg-zinc-50 border-black/10 h-14 rounded-2xl text-black placeholder:text-black/40 focus:border-blue-500/50 transition-all"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#86868b]">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                    <Input 
                      type="email" 
                      placeholder="contact@store.com" 
                      className="pl-10 bg-zinc-50 border-black/10 h-12 rounded-xl text-black"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#86868b]">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                    <Input 
                      type="password" 
                      placeholder="Minimum 6 caractères" 
                      className="pl-10 bg-zinc-50 border-black/10 h-12 rounded-xl text-black"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-[#0071e3] hover:bg-[#0077ed] text-white font-medium rounded-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Création..." : "Créer mon Store"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#F5F5F7]">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
