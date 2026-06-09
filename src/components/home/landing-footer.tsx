import Link from "next/link"
import { landingCtaPrimary } from "@/components/home/landing-styles"

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/catalog", label: "iPhones" },
  { href: "/#troc", label: "Troc" },
  { href: "/#promotions", label: "Promotions" },
  { href: "/#temoignages", label: "Témoignages" },
  { href: "/contact", label: "Contact" },
] as const

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-black/[0.06]">
      <div className="container-pro py-10 sm:py-16 pb-24 md:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10">
          <div className="sm:col-span-2 md:col-span-1">
            <p className="text-[15px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
              Apple Store Market
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#6e6e73] mt-1.5">
              Apple Store Kolwezi · Marketplace iPhone RDC
            </p>
            <p className="text-[13px] sm:text-[14px] text-[#86868b] mt-4 leading-relaxed">
              Kolwezi, RDC
              <br />
              <a href="tel:+243970299448" className="hover:text-[#0071e3] transition-colors">
                +243 970 299 448
              </a>
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide mb-3 sm:mb-4">
              Navigation
            </p>
            <ul className="space-y-2">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[13px] sm:text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide mb-3 sm:mb-4">
              Vendeurs
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-[13px] sm:text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                  Mon Store
                </Link>
              </li>
              <li>
                <Link
                  href="/login?tab=register"
                  className="text-[13px] sm:text-[14px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                  Ouvrir un store
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium text-[#86868b] uppercase tracking-wide mb-3 sm:mb-4">
              Commander
            </p>
            <a
              href="https://wa.me/243970299448"
              className={landingCtaPrimary}
            >
              WhatsApp
            </a>
          </div>
        </div>

        <p className="text-[11px] sm:text-[12px] text-[#86868b] text-center pt-6 sm:pt-8 border-t border-black/[0.05]">
          © {year} Apple Store Market · Apple Store Kolwezi. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
