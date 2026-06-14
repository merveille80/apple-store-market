"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { CommandSearch } from "@/components/command-search"

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
            className="relative z-10 flex items-center gap-1.5 shrink-0"
            onClick={() => setOpen(false)}
          >
            <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px] text-[#1d1d1f]" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#1d1d1f]">
              Apple Store Market
            </span>
          </Link>

          {/* Desktop nav — centré, en flux flex (pas d'absolu = pas de chevauchement) */}
          <nav
            className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8 px-4"
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
          <div className="relative z-10 hidden lg:flex items-center gap-2.5 shrink-0">
            <CommandSearch />
            <a
              href={WHATSAPP_ORDER}
              className="inline-flex h-8 items-center rounded-full bg-[#0071e3] px-4 text-[12px] font-medium text-white hover:bg-[#0077ed] transition-colors"
            >
              Commander maintenant
            </a>
          </div>

          {/* Mobile / tablette : recherche + menu */}
          <div className="relative z-10 flex lg:hidden items-center gap-1.5">
          <CommandSearch />
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
          </div>
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
