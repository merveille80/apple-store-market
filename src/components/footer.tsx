import Link from "next/link"

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={`w-full border-t border-white/10 bg-black py-12 ${className ?? ""}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Apple Store Kolwezi</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              La meilleure marketplace d'iPhones en RDC. Qualité certifiée, vendeurs vérifiés et commande ultra-rapide sur WhatsApp.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><Link href="/catalog" className="text-sm text-zinc-400 hover:text-white transition-colors">Catalogue</Link></li>
              <li><Link href="/vendeurs" className="text-sm text-zinc-400 hover:text-white transition-colors">Vendeurs</Link></li>
              <li><Link href="/a-propos" className="text-sm text-zinc-400 hover:text-white transition-colors">À Propos</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-sm text-zinc-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/faq" className="text-sm text-zinc-400 hover:text-white transition-colors">Aide</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Vendeurs</h4>
            <ul className="space-y-2">
              <li><Link href="/login?tab=register" className="text-sm text-zinc-400 hover:text-white transition-colors">Devenir Vendeur</Link></li>
              <li><Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">Espace Vendeur</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} Apple Store Kolwezi Market. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
