"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/** Fine barre de progression de lecture en haut de page */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[2.5px] origin-left bg-gradient-to-r from-[#0071e3] via-[#3b9aff] to-[#0071e3]"
      aria-hidden
    />
  )
}
