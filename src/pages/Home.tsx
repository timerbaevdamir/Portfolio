import { SITE } from "@/data/site"
import { PROJECTS } from "@/data/projects"
import { Thumb } from "@/ui/Thumb"
import { useNavigate } from "@/lib/router"

/**
 * The landing: a shelf, not an exhibition.
 *
 * It used to run each project full width, one after another, which meant
 * reading the site was a queue — you could not see what was here without
 * scrolling past everything. Tiles put the whole body of work on one screen and
 * make choosing possible; using a project happens on its own page, where it
 * gets the room to be used.
 */
export function Home() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-10">
      <section className="flex flex-col gap-8 py-20 sm:py-28">
        <h1 className="max-w-3xl font-mono text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink [text-wrap:balance]">
          {SITE.headline}
        </h1>
        <p className="max-w-[62ch] text-lg leading-8 text-muted">{SITE.intro}</p>
      </section>

      {/* Two across, because a tile has to be wide enough to show a layout and
          still leave the grid readable as a set. */}
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
                <p className="text-sm leading-6 text-muted">{project.tagline}</p>
                <p className="label mt-auto pt-2">{project.stack.join(" / ")}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
