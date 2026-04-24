import Link from "next/link"

export function Footer({ className }: { className?: string }) {
  const year = new Date().getFullYear()

  return (
    <footer className={`w-full bg-[#F5F5F7] border-t border-black/5 ${className ?? ""}`}>
      <div className="container mx-auto px-6 py-16">
        
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
          
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-black flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <span className="text-[15px] font-semibold text-black tracking-tight">
                Apple Store <span className="text-black/40">Kolwezi</span>
              </span>
            </div>
            <p className="text-[13px] text-black/50 leading-relaxed max-w-[260px]">
              La meilleure marketplace d'iPhones en RDC. Vendeurs vérifiés, commande directe sur WhatsApp.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[11px] font-semibold text-black/40 uppercase tracking-[0.15em] mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/catalog", label: "Catalogue" },
                { href: "/vendeurs", label: "Vendeurs" },
                { href: "/a-propos", label: "À Propos" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-black/60 hover:text-black transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-black/40 uppercase tracking-[0.15em] mb-4">Support</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/contact", label: "Contact" },
                { href: "/faq", label: "FAQ" },
                { href: "/faq", label: "Aide" },
              ].map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-[13px] text-black/60 hover:text-black transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-black/40 uppercase tracking-[0.15em] mb-4">Vendeurs</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/login?tab=register", label: "Devenir Vendeur" },
                { href: "/dashboard", label: "Espace Vendeur" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[13px] text-black/60 hover:text-black transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-black/40">
            © {year} Apple Store Kolwezi Market. Tous droits réservés.
          </p>
          <p className="text-[12px] text-black/40">
            Fait avec ❤ à Kolwezi, RDC
          </p>
        </div>
      </div>
    </footer>
  )
}
