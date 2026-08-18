import { useState } from "react"
import { cn } from "@/lib/cn"
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
  // Open where both columns fit, closed where they have to take turns: on a
  // narrow screen the reader arrived to see the work, not to read about it
  // first. Read once, at mount — a resize should not overrule a choice the
  // reader has since made. Kept across projects for the same reason.
  const [notes, setNotes] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  )
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
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      {/* The rail stays collapsed: there is nothing here to expand into. It
          navigates and does nothing else, which is why it can be this narrow. */}
      <nav
        aria-label="Проекты"
        className="flex shrink-0 items-center gap-1 border-b border-rule px-3 py-2 lg:w-14 lg:flex-col lg:border-b-0 lg:border-r lg:px-0 lg:py-4"
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

        {/* Where both columns fit this collapses one; where they do not, it
            swaps them. Same control, same state — the difference is only
            whether there is room to show both at once. */}
        <button
          type="button"
          onClick={() => setNotes((open) => !open)}
          aria-pressed={notes}
          aria-label={notes ? "Показать работу" : "Показать описание"}
          className={cn(
            "flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-raised",
            notes ? "text-ink" : "text-muted hover:text-ink",
          )}
        >
          <svg viewBox="0 0 16 16" fill="none" className="size-4">
            <rect
              x="1.75"
              y="2.75"
              width="12.5"
              height="10.5"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.25"
            />
            <path
              d="M6.25 3v10"
              stroke="currentColor"
              strokeWidth="1.25"
            />
          </svg>
        </button>

        <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:mt-auto lg:flex-col">
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
      <aside
        className={cn(
          "scroll-area min-h-0 w-full flex-col overflow-y-auto border-rule lg:w-[400px] lg:shrink-0 lg:border-r",
          // Chosen, not overridden: `cn` joins without merging, so two display
          // classes on one element would be settled by stylesheet order.
          notes ? "flex" : "hidden",
        )}
      >
        <header className="flex flex-col gap-4 border-b border-rule p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="font-mono text-2xl font-medium tracking-[-0.02em] text-ink">
              {project.title}
            </h1>
            <span className="label shrink-0">{project.year}</span>
          </div>
          <p className="text-sm leading-6 text-muted">{project.summary}</p>

          {/* The engagement in facts. A reader checks these first and reads
              them once, so they are a table rather than a sentence. */}
          {project.facts && (
            <dl className="flex flex-col gap-2 pt-1">
              {project.facts.map((fact) => (
                <div key={fact.label} className="flex gap-4">
                  <dt className="label w-24 shrink-0">{fact.label}</dt>
                  <dd className="text-sm leading-5 text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          )}

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

        {project.goals && (
          <section className="flex flex-col gap-3 border-b border-rule p-6">
            <h2 className="label">Задачи</h2>
            {/* Numbered, because a brief is a list of separate commitments and
                a reader counts them. Bullets would blur where one ends. */}
            <ol className="flex flex-col gap-2">
              {project.goals.map((goal, i) => (
                <li key={goal} className="flex gap-3 text-sm leading-6 text-muted">
                  <span className="label shrink-0 pt-0.5 text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {goal}
                </li>
              ))}
            </ol>
          </section>
        )}

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
      <main className={cn("min-w-0 flex-1", notes && "hidden lg:block")}>
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
