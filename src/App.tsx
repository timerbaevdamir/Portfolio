import { SITE } from "@/data/site"
import { useNavigate, useRoute } from "@/lib/router"
import { Home } from "@/pages/Home"
import { ProjectPage } from "@/pages/ProjectPage"

/**
 * Shell and routing. The header and footer are the same on every page, so they
 * live here rather than being remembered twice.
 */
export default function App() {
  const route = useRoute()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-6 py-6 sm:px-8">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate({ name: "home" })
          }}
          className="text-base font-semibold leading-6 tracking-[-0.1px] text-foreground"
        >
          {SITE.name}
        </a>
        <nav className="flex items-center gap-5">
          {SITE.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="text-sm leading-5 text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        {route.name === "project" ? (
          <ProjectPage slug={route.slug} />
        ) : (
          <Home />
        )}
      </main>

      <footer className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-8">
        <p className="text-sm leading-5 text-faint">
          {SITE.name} · {SITE.role} · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
