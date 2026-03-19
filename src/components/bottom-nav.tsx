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

  // Hide on admin/dashboard pages (they have their own nav)
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl border-t border-white/10" />
      
      <div className="relative flex items-center justify-around px-2 pb-safe pt-2 min-h-[64px]">
        {navItems.map(({ href, icon: Icon, label }) => {
          // Replace /dashboard link with /login if not connected
          const actualHref = href === "/dashboard" && !session ? "/login" : href
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={actualHref}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 min-w-[60px]",
                isActive
                  ? "text-blue-500"
                  : "text-zinc-500 active:text-white"
              )}
            >
              <div className={cn(
                "relative flex items-center justify-center h-8 w-8 rounded-xl transition-all duration-200",
                isActive ? "bg-blue-500/15 scale-110" : ""
              )}>
                <Icon className={cn("h-5 w-5 transition-all", isActive ? "stroke-[2.5]" : "stroke-[1.5]")} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-bold tracking-wide transition-all",
                isActive ? "text-blue-500" : "text-zinc-600"
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
