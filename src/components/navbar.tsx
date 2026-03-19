"use client"

import Link from "next/link"
import { ShoppingCart, User, Menu, X, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfigured, setIsConfigured] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [storeName, setStoreName] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!supabase) {
      setIsConfigured(false)
      return
    }

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchStoreName(session.user.id)
      }
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) {
        fetchStoreName(session.user.id)
      } else {
        setStoreName(null)
      }
    })

    async function fetchStoreName(userId: string) {
      if (!supabase) return
      const { data } = await supabase
        .from('stores')
        .select('name')
        .eq('profile_id', userId)
        .single()
      
      if (data) setStoreName(data.name)
    }

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      window.location.href = "/"
    }
  }

  return (
    <div className="w-full">
      {!isConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <p className="text-[10px] md:text-xs font-bold text-amber-500 uppercase tracking-widest text-center">
            Attention : Base de données non configurée. Vérifiez votre clé Supabase dans .env.local
          </p>
        </div>
      )}
      <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base md:text-xl font-black tracking-tight text-white">
            <span className="md:hidden">ASK <span className="text-blue-500">●</span></span>
            <span className="hidden md:inline italic">APPLE STORE <span className="text-blue-500">KOLWEZI</span></span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/catalog" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">
              Catalogue
            </Link>
            <Link href="/vendeurs" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">
              Vendeurs
            </Link>
            <Link href="/a-propos" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">
              À Propos
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile: quick catalogue button */}
          <Link href="/catalog" className="md:hidden">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-8 px-3 text-xs">
              Catalogue
            </Button>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-white hover:bg-white/5 font-bold italic text-sm">
                    {storeName ? `Store: ${storeName}` : "Mon Dashboard"}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-zinc-500 hover:text-red-400 font-bold text-[10px] uppercase"
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-6 h-10 shadow-lg shadow-blue-500/20">
                  Devenir Vendeur
                </Button>
              </Link>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-zinc-400 hover:bg-white/10 h-8 w-8"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-zinc-950/98 backdrop-blur-xl px-4 py-5 space-y-1 animate-in slide-in-from-top duration-200">
          {[
            { href: "/catalog", label: "🛍️  Catalogue" },
            { href: "/vendeurs", label: "🏪  Vendeurs" },
            { href: "/a-propos", label: "ℹ️  À Propos" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center text-base font-bold text-white py-3 px-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-white/5">
            {session ? (
              <>
                <Link 
                  href="/dashboard"
                  className="flex items-center text-base font-bold text-blue-400 py-3 px-3 rounded-xl hover:bg-blue-500/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  📊  {storeName ? `Store: ${storeName}` : "Mon Dashboard"}
                </Link>
                <button 
                  onClick={() => { handleLogout(); setIsOpen(false) }}
                  className="w-full text-left flex items-center text-base font-bold text-red-400 py-3 px-3 rounded-xl hover:bg-red-500/10 transition-colors"
                >
                  🚪  Se Déconnecter
                </button>
              </>
            ) : (
              <Link 
                href="/login"
                className="flex items-center text-base font-bold text-blue-400 py-3 px-3 rounded-xl hover:bg-blue-500/10 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                🔑  Devenir Vendeur
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  </div>
  )
}
