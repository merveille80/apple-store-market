import Image from "next/image"

/** Image 3 iPhone 17 — fond #f5f5f7 identique à la section pour fusion parfaite */
export function HeroLineup({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full ${className}`}>
      <Image
        src="/iphone-lineup.png"
        alt="iPhone 17 Pro, Air et iPhone 17"
        width={1200}
        height={630}
        priority
        unoptimized
        sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1060px"
        draggable={false}
        className="w-full h-auto select-none pointer-events-none"
      />
    </div>
  )
}
