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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F5F5F7] text-zinc-900">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 border-r border-black/5 flex-col bg-white/50 backdrop-blur-xl">
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
                    : "text-zinc-500 hover:text-black hover:bg-black/5"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-zinc-400 group-hover:text-black")} />
                {item.name}
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-black/5">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-zinc-500 hover:text-red-600 hover:bg-red-600/5 rounded-xl transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F5F5F7] p-4 md:p-8 pb-32 md:pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between mb-8 pb-4 border-b border-black/5">
            <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs">ASK</div>
              <span>DASHBOARD</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-zinc-500 hover:text-red-600">
               <LogOut className="h-5 w-5" />
            </Button>
          </div>
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-black/5 bg-white/95 backdrop-blur-xl z-50">
        <nav className="flex items-center justify-around p-2 pb-safe">
          {navItems.map((item) => {
             const isActive = pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/dashboard")
             return (
               <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 p-2 w-full">
                 <div className={cn("p-2 rounded-xl transition-all", isActive ? "bg-blue-600/10 text-blue-600" : "text-zinc-500")}>
                   <item.icon className="h-5 w-5" />
                 </div>
                 <span className={cn("text-[10px] font-medium truncate w-full text-center", isActive ? "text-blue-600" : "text-zinc-500")}>
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
