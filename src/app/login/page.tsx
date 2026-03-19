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
      setIsLoading(false)
    } else {
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
          setError(`Erreur lors de la création du store : ${errorMessage} (Code: ${errorCode}). Assurez-vous d'avoir exécuté le script schema.sql.`)
        }
        setIsLoading(false)
      } else {
        router.push("/dashboard")
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-500 mb-6 font-black text-2xl">
            ASK
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Espace Vendeur</h1>
          <p className="text-zinc-500 mt-2">Gérez vos listings et boosts sur Apple Store Kolwezi.</p>
        </div>

        {/* Custom Tab Toggle */}
        <div className="flex bg-zinc-900 border border-white/8 p-1 rounded-2xl mb-8 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Inscription
          </button>
        </div>

        {/* Login Panel */}
        {activeTab === 'login' && (
          <Card className="bg-zinc-900 border-white/10 rounded-3xl overflow-hidden">
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle className="text-xl">Bon retour !</CardTitle>
                <CardDescription className="text-zinc-500">Connectez-vous à votre compte store.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
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
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="pl-10 bg-black border-white/5 h-12 rounded-xl"
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
                  className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl"
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
          <Card className="bg-zinc-900 border-white/10 rounded-3xl overflow-hidden">
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle className="text-xl">Devenir Vendeur</CardTitle>
                <CardDescription className="text-zinc-500">Créez votre boutique en quelques secondes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="relative group">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      placeholder="Nom du Store" 
                      className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-zinc-600 focus:border-blue-500/50 transition-all"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                    <Input 
                      placeholder="Numéro WhatsApp (ex: +243...)" 
                      className="pl-12 bg-white/5 border-white/10 h-14 rounded-2xl text-white placeholder:text-zinc-600 focus:border-blue-500/50 transition-all"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <Input 
                      type="email" 
                      placeholder="contact@store.com" 
                      className="pl-10 bg-black border-white/5 h-12 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <Input 
                      type="password" 
                      placeholder="Minimum 6 caractères" 
                      className="pl-10 bg-black border-white/5 h-12 rounded-xl"
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
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
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
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
