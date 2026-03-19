"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const options = [
    { value: "system", icon: Monitor, label: "Système" },
    { value: "light",  icon: Sun,     label: "Clair"   },
    { value: "dark",   icon: Moon,    label: "Sombre"  },
  ]

  // Cycle through: dark → light → system → dark…
  const cycle = () => {
    if (theme === "dark")   setTheme("light")
    else if (theme === "light") setTheme("system")
    else setTheme("dark")
  }

  const current = options.find(o => o.value === theme) ?? options[0]
  const Icon = current.icon

  return (
    <button
      onClick={cycle}
      title={`Mode : ${current.label} — cliquer pour changer`}
      aria-label="Changer le thème"
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        color: 'var(--text-muted)',
      }}
      className="relative flex items-center justify-center h-9 w-9 rounded-xl transition-all duration-200 active:scale-90 hover:scale-105"
    >
      <Icon className="h-4 w-4 transition-all duration-300" />
    </button>
  )
}
