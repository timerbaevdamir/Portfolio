import { SITE } from "@/data/site"
import { PROJECTS } from "@/data/projects"
import { Preview } from "@/ui/Preview"
import { useNavigate } from "@/lib/router"

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-24 px-6 pb-24 pt-10 sm:px-8 sm:pt-16">
      <section className="flex flex-col gap-6">
        <h1 className="max-w-3xl text-[40px] font-semibold leading-[1.1] tracking-[-1px] text-foreground sm:text-[56px]">
          {SITE.headline}
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted">{SITE.intro}</p>
      </section>

      {/* One section per project. The layout is identical for all of them, and
          that is the point: a project earns attention with the work running in
          it, not with a bespoke page. */}
      {PROJECTS.map((project) => (
        <section key={project.slug} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2 className="text-3xl font-semibold leading-9 tracking-[-0.5px] text-foreground">
                <a
                  href={`/p/${project.slug}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate({ name: "project", slug: project.slug })
                  }}
                  className="transition-colors hover:text-accent"
                >
                  {project.title}
                </a>
              </h2>
              <span className="text-sm leading-5 text-faint">
                {project.year}
              </span>
            </div>
            <p className="max-w-2xl text-base leading-6 text-muted">
              {project.tagline}
            </p>
            <ul className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-sm leading-5 text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          <Preview project={project} />

          <a
            href={`/p/${project.slug}`}
            onClick={(e) => {
              e.preventDefault()
              navigate({ name: "project", slug: project.slug })
            }}
            className="text-base leading-6 text-accent transition-opacity hover:opacity-80"
          >
            Разбор проекта →
          </a>
        </section>
      ))}
    </div>
  )
}
