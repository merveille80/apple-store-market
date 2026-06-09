"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { LandingHeader } from "@/components/landing-header"

export function ConditionalNavbar() {
  const pathname = usePathname()
  if (pathname === "/") return <LandingHeader />
  return <Navbar />
}
