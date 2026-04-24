"use client"

import Link from "next/link"
import { User, Menu, X, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isConfigured, setIsConfigured] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [storeName, setStoreName] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!supabase) { setIsConfigured(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) fetchStoreName(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) fetchStoreName(session.user.id)
      else setStoreName(null)
    })

    async function fetchStoreName(userId: string) {
      if (!supabase) return
      const { data } = await supabase
        .from('stores').select('name').eq('profile_id', userId).single()
      if (data) setStoreName(data.name)
    }

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    if (supabase) { await supabase.auth.signOut(); window.location.href = "/" }
  }

  return (
    <div className="w-full">
      {!isConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-4 flex items-center justify-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <p className="text-[10px] md:text-xs font-semibold text-amber-500 text-center">
            Base de données non configurée — Vérifiez votre clé Supabase dans .env.local
          </p>
        </div>
      )}

      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/85 backdrop-blur-2xl border-b border-black/5 shadow-xl shadow-black/5"
          : "bg-white/60 backdrop-blur-xl border-b border-black/5"
      }`}>
        <div className="container mx-auto flex h-14 md:h-[60px] items-center justify-between px-5 md:px-6">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded-lg bg-black flex items-center justify-center shadow-sm group-hover:scale-95 transition-transform duration-200">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
            <div className="hidden md:block">
              <span className="text-[15px] font-semibold text-black tracking-tight leading-none">
                Apple Store <span className="text-black/50">Kolwezi</span>
              </span>
            </div>
            <span className="md:hidden text-[15px] font-bold text-black tracking-tight">ASK</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-7">
            <Link href="/catalog" className="nav-link">Catalogue</Link>
            <Link href="/vendeurs" className="nav-link">Vendeurs</Link>
            <Link href="/a-propos" className="nav-link">À Propos</Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard">
                  <button className="text-[13px] font-medium text-black/70 hover:text-black transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5">
                    {storeName ? storeName : "Dashboard"}
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[12px] font-medium text-black/40 hover:text-red-500 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="h-9 px-5 text-[13px] font-semibold text-white bg-black rounded-full hover:bg-black/90 transition-all duration-200 shadow-sm shadow-black/10 hover:shadow-black/20">
                  Devenir Vendeur
                </button>
              </Link>
            )}
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/catalog">
              <button className="h-8 px-4 text-[12px] font-semibold text-white bg-black rounded-full hover:bg-black/90 transition-colors">
                Catalogue
              </button>
            </Link>
            <button
              className="h-8 w-8 flex items-center justify-center rounded-full text-black/60 hover:text-black hover:bg-black/5 transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-black/5 bg-white/95 backdrop-blur-2xl"
            >
              <div className="px-5 py-4 space-y-0.5">
                {[
                  { href: "/catalog", label: "Catalogue" },
                  { href: "/vendeurs", label: "Vendeurs" },
                  { href: "/a-propos", label: "À Propos" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center text-[15px] font-medium text-black/75 hover:text-black py-3 px-3 rounded-xl hover:bg-black/5 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                <div className="pt-3 mt-2 border-t border-black/5 space-y-1">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center text-[15px] font-medium text-black py-3 px-3 rounded-xl hover:bg-black/5 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2.5 text-black/40" />
                        {storeName ? `Mon Store · ${storeName}` : "Dashboard"}
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setIsOpen(false) }}
                        className="w-full text-left text-[15px] font-medium text-red-500/80 hover:text-red-500 py-3 px-3 rounded-xl hover:bg-red-500/10 transition-colors"
                      >
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center justify-center text-[15px] font-semibold text-white bg-black py-3 px-3 rounded-2xl mt-2 active:scale-[0.98] transition-transform"
                      onClick={() => setIsOpen(false)}
                    >
                      Devenir Vendeur
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  )
}
