import Link from "next/link"

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
    <Link href={`/product/${id}`} className={className}>
      <div className="bg-white rounded-3xl overflow-hidden border border-black/5 shadow-sm group h-full">
        <div className="aspect-[3/4] relative overflow-hidden bg-[#f5f5f7]">
          <img
            src={image}
            alt={model}
            className="absolute inset-0 object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${
                isNew || label === "Neuf"
                  ? "bg-[#0071e3] text-white"
                  : "bg-white/90 text-[#1d1d1f] backdrop-blur-md border border-black/5"
              }`}
            >
              {label}
            </span>
          </div>
        </div>
        <div className="p-4">
          {(color || storage) && (
            <p className="text-[11px] text-[#86868b] truncate mb-1">
              {[color, storage].filter(Boolean).join(" · ")}
            </p>
          )}
          <h3 className="text-[13px] font-medium text-[#1d1d1f] truncate leading-snug">
            {model}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <p className="text-[16px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
              {price}$
              <span className="text-[11px] font-normal text-[#86868b] ml-1">USD</span>
            </p>
            <div className="h-7 w-7 rounded-full bg-[#0071e3]/8 flex items-center justify-center group-hover:bg-[#0071e3] transition-colors duration-200">
              <svg
                className="h-3.5 w-3.5 text-[#0071e3] group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
