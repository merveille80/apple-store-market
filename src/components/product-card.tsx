import Link from "next/link"
import { MessageCircle } from "lucide-react"

type ProductCardProps = {
  id: string
  model: string
  price: number
  storage: string
  color?: string
  image: string
  isNew?: boolean
  conditionLabel?: string
  className?: string
}

export function ProductCard({
  id,
  model,
  price,
  storage,
  color,
  image,
  isNew,
  conditionLabel,
  className = "",
}: ProductCardProps) {
  const label = conditionLabel ?? (isNew ? "Neuf" : "Occasion")

  return (
    <Link href={`/product/${id}`} className={`group block h-full ${className}`}>
      <article className="bg-white rounded-[18px] sm:rounded-[22px] overflow-hidden border border-black/[0.05] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] h-full flex flex-col transition-all duration-300 sm:group-hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)] sm:group-hover:-translate-y-1 active:scale-[0.99]">
        <div className="aspect-[4/5] relative overflow-hidden bg-[#f5f5f7]">
          <img
            src={image}
            alt={model}
            className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 sm:group-hover:scale-[1.04]"
          />
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
            <span
              className={`text-[11px] sm:text-[10px] font-medium px-2.5 py-1 rounded-full ${
                isNew || label === "Neuf"
                  ? "bg-[#0071e3] text-white shadow-sm"
                  : "bg-white/95 text-[#1d1d1f] border border-black/[0.06]"
              }`}
            >
              {label}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 flex flex-col flex-1 min-h-0">
          {(color || storage) && (
            <p className="text-[12px] sm:text-[11px] text-[#86868b] truncate mb-1">
              {[color, storage].filter(Boolean).join(" · ")}
            </p>
          )}
          <h3 className="text-[13px] sm:text-[14px] font-medium text-[#1d1d1f] leading-snug line-clamp-2 min-h-[2.35rem] sm:min-h-[2.5rem]">
            {model}
          </h3>

          <div className="mt-auto pt-3 sm:pt-4 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-[11px] text-[#86868b] mb-0.5">
                À partir de
              </p>
              <p className="text-[18px] sm:text-[20px] font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-none">
                {price}$
                <span className="text-[11px] font-normal text-[#86868b] ml-0.5">USD</span>
              </p>
            </div>
            <div
              className="flex flex-col items-center gap-0.5 shrink-0"
              aria-hidden
            >
              <div className="h-10 w-10 sm:h-9 sm:w-9 rounded-full bg-[#25d366]/10 flex items-center justify-center sm:group-hover:bg-[#25d366] transition-colors duration-200">
                <MessageCircle
                  className="h-[18px] w-[18px] sm:h-4 sm:w-4 text-[#25d366] sm:group-hover:text-white transition-colors"
                  strokeWidth={2}
                />
              </div>
              <span className="text-[10px] sm:text-[9px] font-medium text-[#86868b] sm:group-hover:text-[#25d366] transition-colors">
                Commander
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
