import { SITE } from "@/data/site"
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
      // The whole site holds the viewport and scrolls inside its columns —
      // the shelf has a fixed panel beside it, and a project is a workspace.
      className="flex h-dvh flex-col overflow-hidden"
    >
      {/* Only inside a project, and only where there is room. The shelf
          carries its own identity in the left column, so a masthead above it
          would say the name twice; on a phone inside a project, height is the
          scarce dimension and the rail already carries the way out. */}
      {workspace && (
        <header className="hidden shrink-0 border-b border-rule lg:block">
          <div className="flex items-center justify-between gap-6 px-6 py-4">
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
      )}

      <main className="min-h-0 flex-1">
        {workspace ? <ProjectPage slug={route.slug} /> : <Home />}
      </main>

    </div>
  )
}
