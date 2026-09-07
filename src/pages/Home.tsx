import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/cn"
import { SITE } from "@/data/site"
import { PROJECTS } from "@/data/projects"
import type { Theme } from "@/lib/useTheme"
import { ThemeToggle } from "@/ui/ThemeToggle"
import { Thumb } from "@/ui/Thumb"
import { useNavigate } from "@/lib/router"

type ThemeProps = { theme: Theme; onToggleTheme: () => void }

function Identity({ compact = false, theme, onToggleTheme }: ThemeProps & { compact?: boolean }) {
  return (
    <div className={cn("flex w-full", compact ? "items-center gap-3" : "flex-col gap-5")}>
      <div className={cn("flex shrink-0 items-center", compact ? "" : "justify-between")}>
        {SITE.avatar && (
          <img
            src={SITE.avatar}
            alt=""
            width={compact ? 40 : 56}
            height={compact ? 40 : 56}
            className={cn("rounded-full object-cover ring-1 ring-ink/10", compact ? "size-10" : "size-14")}
            onError={(event) => {
              event.currentTarget.style.display = "none"
            }}
          />
        )}
        {!compact && <ThemeToggle theme={theme} onToggle={onToggleTheme} />}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <span className={cn("font-medium tracking-[-0.025em] text-ink", compact ? "text-base" : "text-xl")}>
          {SITE.name}
        </span>
        <span className="text-sm text-muted">{SITE.role}</span>
      </div>
      {compact && (
        <div className="ml-auto">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      )}
    </div>
  )
}

function About() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-base leading-7 text-muted">{SITE.about}</p>

      {SITE.roles.length > 0 && (
        <section className="flex flex-col gap-4" aria-label="Работа и проекты">
          {SITE.roles.map((role) => (
            <div key={role.name} className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-rule bg-raised text-sm font-medium text-ink">
                {role.initials}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-ink">{role.name}</span>
                <span className="text-sm leading-5 text-muted">{role.role}</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {SITE.experience.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="label">Опыт</h2>
          <ul className="flex flex-col gap-4">
            {SITE.experience.map((item) => (
              <li key={item.period + item.place} className="flex flex-col gap-1">
                <span className="text-xs text-faint">{item.period}</span>
                <span className="text-sm text-ink">{item.place}</span>
                <span className="text-sm leading-5 text-muted">{item.role}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

function Contacts() {
  return (
    <nav aria-label="Контакты" className="flex flex-wrap items-center gap-2">
      {SITE.links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className={cn(
            "pill min-h-10",
            link.primary
              ? "bg-ink text-ground hover:bg-ink-hover"
              : "bg-surface text-ink hover:bg-rule",
          )}
        >
          {link.label}
          <ArrowUpRight size={14} aria-hidden />
        </a>
      ))}
    </nav>
  )
}

/** Fixed profile on desktop; on mobile the project sheet scrolls over it. */
export function Home({ theme, onToggleTheme }: ThemeProps) {
  const navigate = useNavigate()
  const pocketRef = useRef<HTMLDivElement>(null)
  const [pocketHeight, setPocketHeight] = useState(0)

  useEffect(() => {
    const el = pocketRef.current
    if (!el) return
    // Include padding so the sheet starts below the whole profile.
    const ro = new ResizeObserver(() => {
      setPocketHeight(el.getBoundingClientRect().height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="flex h-full min-h-0">
      <aside className="scroll-area hidden w-[300px] shrink-0 flex-col justify-between gap-10 overflow-y-auto px-7 py-9 lg:flex xl:w-[320px] xl:px-8">
        <div className="flex flex-col gap-9">
          <Identity theme={theme} onToggleTheme={onToggleTheme} />
          <About />
        </div>
        <Contacts />
      </aside>

      <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden lg:my-3 lg:mr-3 lg:rounded-3xl lg:border lg:border-ink/5 lg:bg-raised">
        <div className="absolute inset-x-0 top-0 z-20 flex h-20 items-center bg-ground px-5 lg:hidden">
          <Identity compact theme={theme} onToggleTheme={onToggleTheme} />
        </div>

        <div
          ref={pocketRef}
          className="absolute inset-x-0 top-20 z-0 flex flex-col gap-6 px-5 pb-8 pt-3 lg:hidden"
        >
          <About />
          <Contacts />
        </div>

        <div className="scroll-area absolute inset-x-0 bottom-0 top-20 z-10 overflow-y-auto rounded-t-3xl lg:top-0 lg:rounded-none">
          <div
            aria-hidden
            className="pointer-events-none lg:hidden"
            style={{ height: pocketHeight }}
          />

          <div className="min-h-full rounded-t-3xl bg-raised px-5 pb-16 lg:rounded-none lg:px-8 xl:px-12">
            <div className="mx-auto w-full max-w-[1120px]">
              <header className="flex flex-col gap-2 py-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-[28px] font-medium tracking-[-0.035em] text-ink lg:text-[32px]">
                    {SITE.headline}
                  </h1>
                  <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-surface px-2 text-sm tabular-nums text-muted">
                    {PROJECTS.length}
                  </span>
                </div>
                <p className="max-w-[58ch] text-base leading-7 text-muted">
                  {SITE.intro}
                </p>
              </header>

              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6">
                {PROJECTS.map((project) => (
                  <li key={project.slug} className="min-w-0">
                    <a
                      href={`/p/${project.slug}`}
                      onClick={(e) => {
                        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
                        e.preventDefault()
                        navigate({ name: "project", slug: project.slug })
                      }}
                      className="group flex h-full flex-col rounded-[22px] bg-ground p-2 transition-colors duration-200 hover:bg-surface/60 focus-visible:bg-surface/60"
                    >
                      <div className="relative isolate shrink-0">
                        <Thumb project={project} />
                        <span
                          aria-hidden
                          className="pointer-events-none absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-ink text-ground opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                        >
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-1 px-3 py-3">
                        <h2 className="text-xl font-medium tracking-[-0.025em] text-ink">
                          {project.title}
                        </h2>
                        <p className="text-sm leading-6 text-muted">{project.tagline}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
