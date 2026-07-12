"use client"

import * as React from "react"
import { useTheme } from "next-themes"

/**
 * Cicla entre: system → light → dark → system
 * Ícono de Remixicon (ya cargado en layout.js via CDN)
 */
export function ThemeToggle({ floating = false }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const cycle = () => {
    if (theme === "system") setTheme("light")
    else if (theme === "light") setTheme("dark")
    else setTheme("system")
  }

  const icon =
    theme === "light"  ? "ri-sun-line"        :
    theme === "dark"   ? "ri-moon-line"        :
                         "ri-contrast-2-line"  // system

  const label =
    theme === "light"  ? "Modo claro (clic → oscuro)"   :
    theme === "dark"   ? "Modo oscuro (clic → sistema)"  :
                         "Modo sistema (clic → claro)"

  if (floating) {
    return (
      <button
        onClick={cycle}
        aria-label={label}
        title={label}
        className="cs-theme-btn"
        style={{
          width: "3rem",
          height: "3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "white",
          border: "1px solid var(--cs-bg-200, #E5E7EB)",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.2s ease",
          flexShrink: 0,
        }}
      >
        <i className={icon} style={{ fontSize: "1.25rem", color: "var(--cs-fg-700, #374151)" }}></i>
      </button>
    )
  }

  // Versión compacta para el navbar
  return (
    <button
      onClick={cycle}
      aria-label={label}
      title={label}
      className="cs-theme-btn"
      style={{
        width: "2.25rem",
        height: "2.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: "var(--cs-bg-100, #F9FAFB)",
        border: "1px solid var(--cs-bg-200, #E5E7EB)",
        cursor: "pointer",
        transition: "background 0.2s ease",
        flexShrink: 0,
      }}
    >
      <i className={icon} style={{ fontSize: "1rem", color: "var(--cs-fg-700, #374151)" }}></i>
    </button>
  )
}