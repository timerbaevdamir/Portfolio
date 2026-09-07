import { Moon, Sun } from "lucide-react"
import type { Theme } from "@/lib/useTheme"

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const label = theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему"

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-raised text-muted transition-colors hover:bg-surface hover:text-ink"
    >
      {theme === "dark" ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  )
}
