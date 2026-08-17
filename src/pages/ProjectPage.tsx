import { findProject } from "@/data/projects"
import { Preview } from "@/ui/Preview"
import { useNavigate } from "@/lib/router"

export function ProjectPage({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const project = findProject(slug)

  if (!project) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-24 sm:px-8">
        <h1 className="text-3xl font-semibold leading-9 text-foreground">
          Такого проекта нет
        </h1>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate({ name: "home" })
          }}
          className="text-base leading-6 text-accent"
        >
          ← Ко всем проектам
        </a>
      </div>
    )
  }

  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 pb-24 pt-6 sm:px-8">
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault()
          navigate({ name: "home" })
        }}
        className="text-sm leading-5 text-muted transition-colors hover:text-foreground"
      >
        ← Все проекты
      </a>

      <header className="flex flex-col gap-5">
        <h1 className="max-w-3xl text-[40px] font-semibold leading-[1.1] tracking-[-0.8px] text-foreground">
          {project.title}
        </h1>
        <p className="max-w-2xl text-lg leading-7 text-muted">
          {project.summary}
        </p>
        <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y border-border py-5">
          <div className="flex flex-col gap-1">
            <dt className="text-sm leading-5 text-faint">Год</dt>
            <dd className="text-base leading-6 text-foreground">
              {project.year}
            </dd>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <dt className="text-sm leading-5 text-faint">Стек</dt>
            <dd className="text-base leading-6 text-foreground">
              {project.stack.join(" · ")}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm leading-5 text-faint">Ссылки</dt>
            <dd className="flex gap-4 text-base leading-6">
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="text-accent transition-opacity hover:opacity-80"
              >
                Демо ↗
              </a>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent transition-opacity hover:opacity-80"
                >
                  Код ↗
                </a>
              )}
            </dd>
          </div>
        </dl>
      </header>

      <Preview project={project} />

      <section className="flex flex-col gap-10">
        {project.notes.map((note) => (
          <div key={note.title} className="flex max-w-2xl flex-col gap-3">
            <h2 className="text-xl font-semibold leading-7 tracking-[-0.2px] text-foreground">
              {note.title}
            </h2>
            <p className="text-base leading-7 text-muted">{note.body}</p>
          </div>
        ))}
      </section>
    </article>
  )
}
