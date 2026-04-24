"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3x3, Store, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/catalog", icon: Grid3x3, label: "Catalogue" },
  { href: "/vendeurs", icon: Store, label: "Vendeurs" },
  { href: "/dashboard", icon: User, label: "Mon Store" },
]

export function BottomNav() {
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl border-t border-black/5" />
      
      <div className="relative flex items-center justify-around px-2 pb-safe pt-1 min-h-[62px]">
        {navItems.map(({ href, icon: Icon, label }) => {
          const actualHref = href === "/dashboard" && !session ? "/login" : href
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={actualHref}
              className="flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[56px] transition-all duration-200"
            >
              <div className={cn(
                "flex items-center justify-center h-7 w-7 rounded-xl transition-all duration-200",
                isActive ? "bg-black/5 scale-105" : ""
              )}>
                <Icon className={cn(
                  "h-[22px] w-[22px] transition-all duration-200",
                  isActive ? "text-blue-600 stroke-[2]" : "text-black/30 stroke-[1.5]"
                )} />
              </div>
              <span className={cn(
                "text-[9.5px] font-semibold tracking-wide transition-all duration-200",
                isActive ? "text-blue-600" : "text-black/30"
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
