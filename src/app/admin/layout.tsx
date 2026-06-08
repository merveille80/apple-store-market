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
    <div className="font-sf flex min-h-screen bg-[#F5F5F7] text-zinc-900">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-black/5 flex flex-col bg-white">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-[#0071e3]" />
            <span className="text-[14px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">Administration</span>
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
                    ? "bg-[#0071e3] text-white" 
                    : "text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/5"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-[#86868b]")} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-black/5">
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start gap-3 text-zinc-500 hover:text-black rounded-xl">
              <LogOut className="h-5 w-5" />
              Sortir Admin
            </Button>
          </Link>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 overflow-y-auto bg-[#F5F5F7] p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
