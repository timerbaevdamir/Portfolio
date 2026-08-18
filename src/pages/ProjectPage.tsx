import { PROJECTS, findProject } from "@/data/projects"
import { Preview } from "@/ui/Preview"
import { useNavigate } from "@/lib/router"

/**
 * A project, laid out as the workspace it is.
 *
 * Three columns, borrowed from the tool this site happens to contain: a rail
 * that only navigates, a column of prose where that tool keeps its
 * conversation, and the thing itself running beside it. The shape earns its
 * keep here — a case study is a description of a screen, and the screen is
 * right there to be checked against every sentence.
 *
 * The page fills the viewport and does not scroll as a document. Each column
 * scrolls on its own, so reading the notes never carries the work off screen.
 */
export function ProjectPage({ slug }: { slug: string }) {
  const navigate = useNavigate()
  const project = findProject(slug)
  const index = PROJECTS.findIndex((p) => p.slug === slug)

  if (!project) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-24">
        <h1 className="font-mono text-3xl text-ink">Такого проекта нет</h1>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate({ name: "home" })
          }}
          className="link font-mono"
        >
          ← Ко всем проектам
        </a>
      </div>
    )
  }

  const go = (step: number) => {
    const next = PROJECTS[(index + step + PROJECTS.length) % PROJECTS.length]
    if (next) navigate({ name: "project", slug: next.slug })
  }

  return (
    <div className="flex h-full min-h-0">
      {/* The rail stays collapsed: there is nothing here to expand into. It
          navigates and does nothing else, which is why it can be this narrow. */}
      <nav
        aria-label="Проекты"
        className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-rule py-4"
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate({ name: "home" })
          }}
          aria-label="Все проекты"
          className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-raised hover:text-ink"
        >
          ✕
        </a>

        <div className="mt-auto flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Предыдущий проект"
            className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            ↑
          </button>
          {/* Position, not decoration: it says how much work is here and where
              in it you are. */}
          <span className="label text-faint">
            {index + 1}/{PROJECTS.length}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Следующий проект"
            className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-raised hover:text-ink"
          >
            ↓
          </button>
        </div>
      </nav>

      {/* The prose column. Where the tool keeps its conversation, this keeps
          the account of what was decided and why. */}
      <aside className="scroll-area hidden w-[400px] shrink-0 flex-col overflow-y-auto border-r border-rule lg:flex">
        <header className="flex flex-col gap-4 border-b border-rule p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="font-mono text-2xl font-medium tracking-[-0.02em] text-ink">
              {project.title}
            </h1>
            <span className="label shrink-0">{project.year}</span>
          </div>
          <p className="text-sm leading-6 text-muted">{project.summary}</p>
          <p className="label">{project.stack.join(" / ")}</p>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="link font-mono text-sm"
            >
              Код ↗
            </a>
          )}
        </header>

        <div className="flex flex-col">
          {project.notes.map((note) => (
            <section
              key={note.title}
              className="flex flex-col gap-2 border-b border-rule p-6"
            >
              <h2 className="font-mono text-sm font-medium text-ink">
                {note.title}
              </h2>
              <p className="text-sm leading-6 text-muted">{note.body}</p>
            </section>
          ))}
        </div>
      </aside>

      {/* The work itself. */}
      <main className="min-w-0 flex-1">
        {/* Keyed by the project, so moving between them starts the stage over.
            Without it React keeps the instance — same type, same position — and
            the chosen viewport survives into a project that may not have it: a
            desktop-only project inherited the phone width from the one before
            and had no switch to escape it, because it only has one. */}
        <Preview key={project.slug} project={project} />
      </main>
    </div>
  )
}
