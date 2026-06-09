"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

const WHATSAPP_ORDER =
  "https://wa.me/243970299448?text=Bonjour%2C%20je%20souhaite%20commander%20un%20iPhone%20chez%20Apple%20Store%20Market."

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/catalog", label: "iPhones" },
  { href: "/#troc", label: "Troc" },
  { href: "/#promotions", label: "Promotions" },
  { href: "/#temoignages", label: "Témoignages" },
  { href: "/contact", label: "Contact" },
] as const

export function LandingHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_0.5px_0_0_rgba(0,0,0,0.08)]"
            : "bg-white/60 backdrop-blur-md border-b border-transparent"
        }`}
      >
        <div className="relative mx-auto flex h-12 max-w-[1060px] items-center justify-between px-5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 flex items-center gap-2 shrink-0"
            onClick={() => setOpen(false)}
          >
            <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              Apple Store Market
            </span>
          </Link>

          {/* Desktop nav — centré */}
          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex items-center gap-7 lg:gap-8"
            aria-label="Navigation principale"
          >
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[12px] font-normal text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href={WHATSAPP_ORDER}
            className="relative z-10 hidden md:inline-flex h-8 items-center rounded-full bg-[#0071e3] px-4 text-[12px] font-medium text-white hover:bg-[#0077ed] transition-colors"
          >
            Commander maintenant
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="relative z-10 flex md:hidden h-10 w-10 items-center justify-center rounded-full text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Fermer le menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed left-0 right-0 top-12 z-40 border-b border-black/[0.06] bg-white/95 backdrop-blur-xl md:hidden"
              aria-label="Menu mobile"
            >
              <ul className="px-5 py-4 space-y-1">
                {NAV.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex min-h-[44px] items-center text-[17px] font-medium text-[#1d1d1f] tracking-[-0.02em]"
                      onClick={() => setOpen(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="px-5 pb-5 pt-2 border-t border-black/[0.05] space-y-2">
                <a
                  href={WHATSAPP_ORDER}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-[#0071e3] text-[15px] font-medium text-white hover:bg-[#0077ed] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Commander maintenant
                </a>
                <Link
                  href="/dashboard"
                  className="flex h-11 w-full items-center justify-center rounded-full border border-black/[0.08] text-[14px] font-medium text-[#1d1d1f] hover:bg-black/[0.03] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Mon Store
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
