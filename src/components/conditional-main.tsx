"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export function ConditionalMain({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const showBottomNavPadding =
    !pathname.startsWith("/dashboard") && !pathname.startsWith("/admin")

  return (
    <main className={`flex-1 ${showBottomNavPadding ? "pb-bottom-nav md:pb-0" : ""}`}>
      {children}
    </main>
  )
}
