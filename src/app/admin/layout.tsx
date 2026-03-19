"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ShieldCheck, 
  Users, 
  Smartphone, 
  Settings, 
  LogOut, 
  BarChart4,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: "Global", href: "/admin", icon: BarChart4 },
    { name: "Vendeurs", href: "/admin/vendeurs", icon: Users },
    { name: "Modération", href: "/admin/products", icon: AlertTriangle },
    { name: "Réglages", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col bg-zinc-950">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 font-black text-xl tracking-tighter text-blue-500">
            <ShieldCheck className="h-8 w-8 text-blue-500" />
            <span>ADMIN</span>
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
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive 
                    ? "bg-zinc-800 text-white" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-blue-500" : "text-zinc-600")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-500 hover:text-white rounded-xl">
              <LogOut className="h-5 w-5" />
              Sortir Admin
            </Button>
          </Link>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 overflow-y-auto bg-black p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
