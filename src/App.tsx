import { SITE } from "@/data/site"
import { cn } from "@/lib/cn"
import { useNavigate, useRoute } from "@/lib/router"
import { Home } from "@/pages/Home"
import { ProjectPage } from "@/pages/ProjectPage"

/**
 * Shell and routing.
 *
 * The two pages want opposite things from the viewport, so the shell gives them
 * opposite things. The landing is a document: it scrolls, and it ends with a
 * footer. A project is a workspace: it fills the screen exactly once, scrolls
 * inside its own columns, and has no bottom to reach.
 */
export default function App() {
  const route = useRoute()
  const navigate = useNavigate()
  const workspace = route.name === "project"

  return (
    <div
      className={cn(
        "flex flex-col",
        workspace ? "h-dvh overflow-hidden" : "min-h-dvh",
      )}
    >
      <header className="shrink-0 border-b border-rule">
        <div
          className={cn(
            "flex items-center justify-between gap-6 px-6 py-4",
            workspace ? "w-full" : "mx-auto w-full max-w-6xl sm:px-10",
          )}
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault()
              navigate({ name: "home" })
            }}
            className="label text-ink"
          >
            {SITE.name}
          </a>
          <nav className="flex items-center gap-6">
            {SITE.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="label transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className={cn("flex-1", workspace && "min-h-0")}>
        {workspace ? <ProjectPage slug={route.slug} /> : <Home />}
      </main>

      {!workspace && (
        <footer className="border-t border-rule">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5 sm:px-10">
            <span className="label">{SITE.role}</span>
            <span className="label">{new Date().getFullYear()}</span>
          </div>
        </footer>
      )}
    </div>
  )
}
