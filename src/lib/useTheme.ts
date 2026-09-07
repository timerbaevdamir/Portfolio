import { useState } from "react"

export type Theme = "dark" | "light"

export function useTheme() {
  // The head script restores the saved theme before the first paint.
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  )

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      next === "light" ? "#f5f5f5" : "#141414",
    )
    setTheme(next)
    try {
      localStorage.setItem("portfolio-theme", next)
    } catch {
      // Switching still works when the browser disables storage.
    }
  }

  return { theme, toggleTheme }
}
