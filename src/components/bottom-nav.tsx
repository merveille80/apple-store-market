"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3x3, Store, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/catalog", icon: Grid3x3, label: "Catalogue" },
  { href: "/vendeurs", icon: Store, label: "Vendeurs" },
  { href: "/dashboard", icon: User, label: "Mon Store" },
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="Navigation principale"
    >
      <div className="absolute inset-0 bg-white/92 backdrop-blur-2xl border-t border-black/[0.06]" />

      <div className="relative flex items-stretch justify-around px-1 pt-1.5 pb-safe min-h-[var(--bottom-nav-h)]">
        {navItems.map(({ href, icon: Icon, label }) => {
          // Toujours /dashboard : le middleware redirige vers /login si non connecté
          const isActive =
            pathname === href ||
            (href === "/dashboard" && pathname.startsWith("/dashboard")) ||
            (href !== "/" && href !== "/dashboard" && pathname.startsWith(href))

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[52px] py-1 transition-colors active:opacity-70"
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-colors",
                  isActive ? "text-[#0071e3] stroke-[2.25]" : "text-[#86868b] stroke-[1.75]"
                )}
                aria-hidden
              />
              <span
                className={cn(
                  "text-[11px] font-medium leading-none tracking-[-0.01em]",
                  isActive ? "text-[#0071e3]" : "text-[#86868b]"
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
