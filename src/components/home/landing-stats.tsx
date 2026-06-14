"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

type Stat = {
  value: number
  suffix: string
  label: string
}

const STATS: Stat[] = [
  { value: 500, suffix: "+", label: "Clients satisfaits" },
  { value: 30, suffix: "+", label: "Modèles en stock" },
  { value: 24, suffix: "h", label: "Livraison à Kolwezi" },
  { value: 100, suffix: "%", label: "iPhones vérifiés" },
]

function CountUp({ value, suffix, start }: { value: number; suffix: string; start: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!start) return
    const duration = 1400
    const t0 = performance.now()
    let raf: number
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      // ease-out cubic pour un final qui ralentit
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, value])

  return (
    <span className="tabular-nums">
      {display}
      <span className="text-[#0071e3]">{suffix}</span>
    </span>
  )
}

export function LandingStats() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section className="bg-[#f5f5f7]">
      <div ref={ref} className="mx-auto max-w-[1060px] px-5 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="rounded-[20px] bg-white px-4 py-7 sm:py-9 text-center shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)]"
            >
              <p className="font-sf-display text-[clamp(1.6rem,4vw,2.4rem)] font-semibold text-[#1d1d1f] tracking-[-0.04em]">
                <CountUp value={stat.value} suffix={stat.suffix} start={inView} />
              </p>
              <p className="mt-1 text-[12px] sm:text-[14px] text-[#6e6e73] tracking-[-0.01em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
