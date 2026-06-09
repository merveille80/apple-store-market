const REVIEWS = [
  {
    quote: "Commande WhatsApp en deux minutes. Remise le jour même, téléphone nickel.",
    name: "Marcus T.",
    detail: "iPhone 14 Pro",
  },
  {
    quote: "Prix clair, photos conformes. Le vendeur a tout expliqué avant l'achat.",
    name: "Grace M.",
    detail: "iPhone 13",
  },
  {
    quote: "Box neuf comme annoncé. Transaction simple, je recommande.",
    name: "Jean-Paul K.",
    detail: "iPhone 15",
  },
] as const

export function TestimonialsSection() {
  return (
    <section id="temoignages" className="border-t border-black/[0.04] scroll-mt-20">
      <div className="container-pro py-14 sm:py-16">
        <h2 className="font-sf-display text-[clamp(1.25rem,3vw,1.75rem)] font-semibold text-[#1d1d1f] tracking-[-0.03em] text-center mb-10 sm:mb-12">
          Ce qu&apos;en disent nos clients
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-4xl mx-auto">
          {REVIEWS.map((review) => (
            <figure key={review.name} className="text-center sm:text-left px-2 sm:px-0">
              <blockquote className="text-[15px] sm:text-[16px] text-[#6e6e73] leading-relaxed tracking-[-0.01em]">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-[13px] text-[#86868b]">
                <span className="font-medium text-[#1d1d1f]">{review.name}</span>
                <span className="mx-1.5 text-black/15" aria-hidden>
                  ·
                </span>
                {review.detail}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
