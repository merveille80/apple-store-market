"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Menu, X, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { CommandSearch } from "@/components/command-search"

const WHATSAPP_ORDER =
  "https://wa.me/243970299448?text=Bonjour%2C%20je%20souhaite%20commander%20un%20iPhone%20chez%20Apple%20Store%20Market."

const LANDING_NAV = [
  { href: "/", label: "Accueil" },
  { href: "/catalog", label: "iPhones" },
  { href: "/#troc", label: "Troc" },
  { href: "/#promotions", label: "Promotions" },
  { href: "/#temoignages", label: "Témoignages" },
  { href: "/contact", label: "Contact" },
] as const

const SITE_NAV = [
  { href: "/catalog", label: "Catalogue" },
  { href: "/vendeurs", label: "Vendeurs" },
  { href: "/a-propos", label: "À Propos" },
] as const

export function Navbar() {
  const pathname = usePathname()
  const isLanding = pathname === "/"
  const navLinks = isLanding ? LANDING_NAV : SITE_NAV

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
    if (!supabase) {
      setIsConfigured(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) fetchStoreName(session.user.id)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) fetchStoreName(session.user.id)
      else setStoreName(null)
    })

    async function fetchStoreName(userId: string) {
      if (!supabase) return
      const { data } = await supabase
        .from("stores")
        .select("name")
        .eq("profile_id", userId)
        .single()
      if (data) setStoreName(data.name)
    }

    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      window.location.href = "/"
    }
  }

  const primaryCta = isLanding ? (
    <a href={WHATSAPP_ORDER} className="h-9 px-5 inline-flex items-center text-[13px] font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-all duration-200 shadow-[0_4px_14px_rgba(0,113,227,0.25)]">
      Commander maintenant
    </a>
  ) : (
    <Link href="/catalog">
      <button className="h-9 px-5 text-[13px] font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-all duration-200 shadow-[0_4px_14px_rgba(0,113,227,0.25)]">
        Acheter
      </button>
    </Link>
  )

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

      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/85 backdrop-blur-2xl border-b border-black/5 shadow-[0_1px_12px_rgba(0,0,0,0.04)]"
            : "bg-white/70 backdrop-blur-xl border-b border-black/[0.04]"
        }`}
      >
        <div className="container-pro flex h-[52px] sm:h-14 md:h-[60px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="h-5 w-5 sm:h-[22px] sm:w-[22px] fill-[#1d1d1f] shrink-0 group-hover:opacity-75 transition-opacity duration-200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <div>
              <span className="text-[15px] sm:text-[16px] font-semibold text-[#1d1d1f] tracking-[-0.02em] leading-none">
                {isLanding ? (
                  "Apple Store Market"
                ) : (
                  <>
                    Apple Store <span className="text-[#86868b]">Kolwezi</span>
                  </>
                )}
              </span>
              {isLanding && (
                <span className="hidden sm:block text-[11px] text-[#86868b] mt-0.5">
                  Apple Store Kolwezi
                </span>
              )}
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link">
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <CommandSearch />
            {session ? (
              <>
                <Link href="/dashboard">
                  <button className="text-[13px] font-medium text-[#6e6e73] hover:text-[#1d1d1f] transition-colors px-3 py-1.5 rounded-lg hover:bg-black/5">
                    {storeName ? storeName : "Dashboard"}
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[12px] font-medium text-[#86868b] hover:text-red-500 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              !isLanding && (
                <Link href="/login">
                  <button className="h-9 px-4 text-[13px] font-medium text-[#0071e3] hover:text-[#0077ed] transition-colors">
                    Vendre
                  </button>
                </Link>
              )
            )}
            {primaryCta}
          </div>

          <div className="flex md:hidden items-center gap-2 shrink-0">
            <CommandSearch />
            {isLanding ? (
              <a
                href={WHATSAPP_ORDER}
                className="min-h-[40px] h-10 px-4 inline-flex items-center text-[13px] font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors active:scale-[0.98]"
              >
                Commander
              </a>
            ) : (
              <Link href="/catalog">
                <button className="min-h-[40px] h-10 px-4 text-[13px] font-medium text-white bg-[#0071e3] rounded-full hover:bg-[#0077ed] transition-colors active:scale-[0.98]">
                  Catalogue
                </button>
              </Link>
            )}
            <button
              type="button"
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
              className="min-h-[40px] min-w-[40px] h-10 w-10 flex items-center justify-center rounded-full text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 transition-all active:scale-95"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-black/5 bg-white/95 backdrop-blur-2xl"
            >
              <div className="px-4 py-3 space-y-0.5">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center text-[17px] font-medium text-[#1d1d1f]/80 hover:text-[#1d1d1f] min-h-[48px] py-3 px-3 rounded-xl hover:bg-black/5 transition-colors active:bg-black/5"
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
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="w-full text-left text-[15px] font-medium text-red-500/80 hover:text-red-500 py-3 px-3 rounded-xl hover:bg-red-500/10 transition-colors"
                      >
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    !isLanding && (
                      <Link
                        href="/login"
                        className="flex items-center justify-center text-[15px] font-medium text-white bg-[#0071e3] py-3 px-3 rounded-full mt-2 active:scale-[0.98] transition-transform"
                        onClick={() => setIsOpen(false)}
                      >
                        Devenir Vendeur
                      </Link>
                    )
                  )}
                  {isLanding && (
                    <a
                      href={WHATSAPP_ORDER}
                      className="flex items-center justify-center text-[15px] font-medium text-white bg-[#0071e3] py-3 px-3 rounded-full mt-2 active:scale-[0.98] transition-transform"
                      onClick={() => setIsOpen(false)}
                    >
                      Commander maintenant
                    </a>
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
