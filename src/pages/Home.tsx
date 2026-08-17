import { SITE } from "@/data/site"
import { PROJECTS } from "@/data/projects"
import { Preview } from "@/ui/Preview"
import { useNavigate } from "@/lib/router"

/**
 * The landing.
 *
 * Two measures, deliberately different: prose is held to a readable ~65
 * characters, the work runs to the full width of the page. Everything on this
 * site is set in one column of one width before — which is exactly what made it
 * read as a template, because nothing was more important than anything else.
 */
export function Home() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
      {/* The hero is a claim only this page can make. A portfolio of
          screenshots cannot say it, which is the whole reason it is the first
          thing here. */}
      <section className="flex flex-col gap-8 py-24 sm:py-32">
        <h1 className="max-w-3xl font-mono text-[clamp(2.75rem,7vw,5rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink [text-wrap:balance]">
          {SITE.headline}
        </h1>
        <p className="max-w-[62ch] text-lg leading-8 text-muted">
          {SITE.intro}
        </p>
      </section>

      <ol className="flex flex-col">
        {PROJECTS.map((project) => (
          <li key={project.slug} className="border-t border-rule py-16 sm:py-24">
            {/* Meta first, in the mono: the year is real information and
                earns the position. A sequence number would not — these are not
                steps, and numbering them would only look like structure. */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pb-10">
              <div className="flex items-baseline gap-5">
                <span className="label">{project.year}</span>
                <h2 className="font-mono text-2xl font-medium tracking-[-0.02em] text-ink sm:text-3xl">
                  <a
                    href={`/p/${project.slug}`}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate({ name: "project", slug: project.slug })
                    }}
                    className="link decoration-transparent hover:decoration-ink"
                  >
                    {project.title}
                  </a>
                </h2>
              </div>
              {/* One line, not five identical pills. The stack is a footnote
                  about the work, and five grey chips gave it the visual weight
                  of the work itself. */}
              <p className="label">{project.stack.join(" / ")}</p>
            </div>

            <Preview project={project} />

            <div className="flex flex-col gap-6 pt-10 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-[62ch] text-base leading-7 text-muted">
                {project.tagline}
              </p>
              <a
                href={`/p/${project.slug}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigate({ name: "project", slug: project.slug })
                }}
                className="link shrink-0 font-mono text-sm"
              >
                Разбор →
              </a>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
