"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Smartphone,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut()
    router.push("/login")
  }

  const navGroups = [
    {
      label: "Gestion",
      items: [
        { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
        { name: "Mes iPhones", href: "/dashboard/products", icon: Smartphone },
        { name: "Leads WhatsApp", href: "/dashboard/leads", icon: MessageSquare },
      ],
    },
    {
      label: "Compte",
      items: [{ name: "Paramètres Store", href: "/dashboard/settings", icon: Settings }],
    },
  ]
  const navItems = navGroups.flatMap((g) => g.items)

  return (
    <div className="font-sf flex flex-col md:flex-row min-h-screen bg-white text-[#1d1d1f]">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 border-r border-black/[0.06] flex-col bg-white">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-[#1d1d1f] shrink-0">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span className="text-[14px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">Dashboard</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-0.5">
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#aeaeb2]">
                {group.label}
              </p>
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"))
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors group",
                      isActive
                        ? "text-[#1d1d1f]"
                        : "text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.03]"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-pill"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-lg bg-[#0071e3]/[0.08]"
                      />
                    )}
                    <item.icon className={cn("relative h-[18px] w-[18px]", isActive ? "text-[#0071e3]" : "text-[#aeaeb2] group-hover:text-[#6e6e73]")} strokeWidth={2} />
                    <span className="relative">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-black/[0.06]">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-[#86868b] hover:text-red-600 hover:bg-red-600/5 rounded-xl transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8 pb-32 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-black/[0.06]">
            <Link href="/" className="flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-[#1d1d1f] shrink-0">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-[14px] font-semibold text-[#1d1d1f]">Dashboard</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-[#86868b] hover:text-red-600">
               <LogOut className="h-5 w-5" />
            </Button>
          </div>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-black/[0.06] bg-white/95 backdrop-blur-xl z-50">
        <nav className="flex items-center justify-around p-2 pb-safe">
          {navItems.map((item) => {
             const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/dashboard")
             return (
               <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2 w-full">
                 <div className={cn("p-2 rounded-xl transition-all", isActive ? "bg-[#0071e3]/10 text-[#0071e3]" : "text-[#86868b]")}>
                   <item.icon className="h-5 w-5" />
                 </div>
                 <span className={cn("text-[10px] font-medium truncate w-full text-center", isActive ? "text-[#0071e3]" : "text-[#86868b]")}>
                   {item.name.replace("WhatsApp", "W.App")}
                 </span>
               </Link>
             )
          })}
        </nav>
      </div>
    </div>
  )
}
