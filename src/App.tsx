import { SITE } from "@/data/site"
import { useNavigate, useRoute } from "@/lib/router"
import { Home } from "@/pages/Home"
import { ProjectPage } from "@/pages/ProjectPage"

/**
 * Shell and routing.
 *
 * The header is a single hairline-ruled row set in the mono — a masthead rather
 * than navigation, because with two projects there is nothing to navigate.
 */
export default function App() {
  const route = useRoute()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-rule">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5 sm:px-10">
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

      <main className="flex-1">
        {route.name === "project" ? (
          <ProjectPage slug={route.slug} />
        ) : (
          <Home />
        )}
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5 sm:px-10">
          <span className="label">{SITE.role}</span>
          <span className="label">{new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
