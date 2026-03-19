"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Smartphone, 
  MessageSquare, 
  Settings, 
  LogOut, 
  PlusCircle,
  ChevronRight
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

  const navItems = [
    { name: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
    { name: "Mes iPhones", href: "/dashboard/products", icon: Smartphone },
    { name: "Leads WhatsApp", href: "/dashboard/leads", icon: MessageSquare },
    { name: "Paramètres Store", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col bg-zinc-950/50 backdrop-blur-xl">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs">ASK</div>
            <span>DASHBOARD</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-zinc-600 group-hover:text-zinc-400")} />
                {item.name}
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-black p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
