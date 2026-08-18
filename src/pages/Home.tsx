import { useState } from "react"
import { cn } from "@/lib/cn"
import { SITE } from "@/data/site"
import { PROJECTS } from "@/data/projects"
import { Thumb } from "@/ui/Thumb"
import { useNavigate } from "@/lib/router"

/**
 * The shelf: who is speaking on the left, what they made on the right.
 *
 * The left column is fixed and never scrolls. It holds the little that has to
 * be true of every screen — a name, what the person does, how to reach them —
 * so the work can scroll past it without the reader losing whose work it is.
 *
 * On a phone there is no room for two columns, so it becomes a panel the reader
 * opens. Same content, same state; the difference is only whether both fit at
 * once — which is how the project page treats its notes, and one rule is easier
 * to learn than two.
 */
export function Home() {
  const navigate = useNavigate()
  const [about, setAbout] = useState(false)

  return (
    <div className="flex h-full min-h-0">
      <aside
        className={cn(
          "w-full shrink-0 flex-col justify-between gap-10 overflow-y-auto p-6 lg:w-[340px] lg:border-r lg:border-rule lg:p-10",
          // Chosen, not overridden: two display classes on one element would be
          // settled by stylesheet order, since `cn` joins without merging.
          about ? "flex" : "hidden lg:flex",
        )}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-4">
              {SITE.avatar && (
                <img
                  src={SITE.avatar}
                  alt={SITE.name}
                  width={64}
                  height={64}
                  // Cropped to the circle rather than squeezed into it, and
                  // ringed: on a dark ground a photograph without an edge
                  // bleeds into the column.
                  className="size-16 rounded-full object-cover ring-1 ring-rule"
                  onError={(event) => {
                    event.currentTarget.style.display = "none"
                  }}
                />
              )}
              <div className="flex flex-col gap-1">
              <span className="font-mono text-base font-medium tracking-[-0.01em] text-ink">
                {SITE.name}
              </span>
                <span className="label">{SITE.role}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAbout(false)}
              aria-label="Закрыть"
              className="label -mr-2 -mt-1 px-2 py-1 transition-colors hover:text-ink lg:hidden"
            >
              ✕
            </button>
          </div>

          <p className="text-sm leading-6 text-muted">{SITE.about}</p>

          {SITE.experience.length > 0 && (
            <section className="flex flex-col gap-4">
              <h2 className="label">Опыт</h2>
              <ul className="flex flex-col gap-4">
                {SITE.experience.map((item) => (
                  <li key={item.period + item.place} className="flex flex-col gap-0.5">
                    <span className="label text-faint">{item.period}</span>
                    <span className="text-sm leading-5 text-ink">{item.place}</span>
                    <span className="text-sm leading-5 text-muted">{item.role}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <nav className="flex flex-col gap-2">
            {SITE.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="link font-mono text-sm"
              >
                {link.label} ↗
              </a>
            ))}
          </nav>
          <span className="label text-faint">{new Date().getFullYear()}</span>
        </div>
      </aside>

      <main
        className={cn(
          "scroll-area min-h-0 flex-1 overflow-y-auto",
          about && "hidden lg:block",
        )}
      >
        {/* The masthead a phone needs, since the column carrying it is put
            away. Absent from wide screens, where the column is right there. */}
        <div className="flex items-center justify-between border-b border-rule px-6 py-4 lg:hidden">
          <span className="label text-ink">{SITE.name}</span>
          <button
            type="button"
            onClick={() => setAbout(true)}
            className="label px-2 py-1 transition-colors hover:text-ink"
          >
            Обо мне
          </button>
        </div>

        <div className="mx-auto w-full max-w-4xl px-6 pb-24 lg:px-10">
          <section className="flex flex-col gap-6 py-16 lg:py-20">
            <h1 className="max-w-2xl font-mono text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.04em] text-ink [text-wrap:balance]">
              {SITE.headline}
            </h1>
            <p className="max-w-[62ch] text-base leading-7 text-muted">
              {SITE.intro}
            </p>
          </section>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {PROJECTS.map((project) => (
              <li key={project.slug}>
                <a
                  href={`/p/${project.slug}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate({ name: "project", slug: project.slug })
                  }}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-rule bg-raised transition-colors hover:border-muted"
                >
                  <Thumb project={project} />
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-mono text-lg font-medium tracking-[-0.02em] text-ink">
                        {project.title}
                      </h2>
                      <span className="label shrink-0">{project.year}</span>
                    </div>
                    <p className="text-sm leading-6 text-muted">
                      {project.tagline}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
