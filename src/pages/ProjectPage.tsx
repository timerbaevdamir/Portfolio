import { useState } from "react"
import { cn } from "@/lib/cn"
import { X, ChevronUp, ChevronDown, ExternalLink } from "lucide-react"
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
        <h1 className="text-3xl text-ink">Такого проекта нет</h1>
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate({ name: "home" })
          }}
          className="link"
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
    <main className="flex h-full min-h-0 flex-col lg:flex-row">
      {/* The rail stays collapsed: there is nothing here to expand into. It
          navigates and does nothing else, which is why it can be this narrow. */}
      <nav
        aria-label="Проекты"
        className="flex shrink-0 flex-wrap items-center gap-1 px-2 py-2 lg:w-16 lg:flex-col lg:border-b-0 lg:px-0 lg:py-5"
      >
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate({ name: "home" })
          }}
          aria-label="Все проекты"
          className="rail-btn"
        >
          <X size={18} />
        </a>

        {/* On a phone the two columns become two tabs in the rail, beside
            the way out — control bar space is the one place on the page
            that is always free of the work. Labels only: the state either
            is or is not here, no icon needed to say so. */}
        <div className="flex min-w-0 items-center gap-0.5 rounded-full bg-ground p-1 lg:hidden">
          <button
            type="button"
            onClick={() => setNotes(false)}
            aria-pressed={!notes}
            className={cn(
              "pill px-3",
              !notes ? "bg-selected text-ink" : "text-muted hover:text-ink",
            )}
          >
            Прототип
          </button>
          <button
            type="button"
            onClick={() => setNotes(true)}
            aria-pressed={notes}
            className={cn(
              "pill px-3",
              notes ? "bg-selected text-ink" : "text-muted hover:text-ink",
            )}
          >
            Описание
          </button>
        </div>

        <div className="ml-auto flex items-center gap-0.5 lg:ml-0 lg:mt-auto lg:flex-col">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Предыдущий проект"
            className="rail-btn"
          >
            <ChevronUp size={18} />
          </button>
          {/* Position, not decoration: it says how much work is here and where
              in it you are. */}
          <span className="text-xs tabular-nums text-faint">
            {index + 1}/{PROJECTS.length}
          </span>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Следующий проект"
            className="rail-btn"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </nav>

      {/* The sheet: the prose column and the stage share one raised
          container, the way the tiles do on the shelf. The rail keeps the
          darker ground, and colour alone marks where the work begins. */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-3xl border border-ink/5 bg-raised lg:my-3 lg:mr-3 lg:rounded-3xl lg:flex-row">
        {/* The prose column. Where the tool keeps its conversation, this keeps
            the account of what was decided and why. On a narrow screen it is a
            layer over the work rather than a neighbour: the stage stays
            mounted, and the notes come and go above it — our own sheet over
            our own content, which is fine, unlike a control floating over a
            live site. */}
        <aside
          className={cn(
            "scroll-area overflow-y-auto border-rule/70 lg:static lg:block lg:w-[340px] xl:w-[380px] lg:shrink-0 lg:border-r",
            // Chosen, not overridden: `cn` joins without merging, so two display
            // classes on one element would be settled by stylesheet order.
            notes ? "absolute inset-0 z-10 bg-raised" : "hidden",
          )}
        >
        <header className="flex flex-col gap-4 border-b border-rule/70 p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-[28px] font-medium tracking-[-0.035em] text-ink">
              {project.title}
            </h1>
            <span className="shrink-0 rounded-lg bg-surface px-2.5 py-1 text-sm text-muted">{project.year}</span>
          </div>
          <p className="text-base leading-7 text-muted">{project.summary}</p>

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

        </header>

        {project.goals && (
          <section className="flex flex-col gap-3 border-b border-rule/70 p-6">
            <h2 className="label">Задачи</h2>
            {/* Numbered, because a brief is a list of separate commitments and
                a reader counts them. Bullets would blur where one ends. */}
            <ol className="flex flex-col gap-2">
              {project.goals.map((goal, i) => (
                <li key={goal} className="flex gap-3 text-base leading-7 text-muted">
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
              className="flex flex-col gap-2 border-b border-rule/70 p-6"
            >
              <h2 className="text-base font-medium leading-6 text-ink">
                {note.title}
              </h2>
              <p className="text-base leading-7 text-muted">{note.body}</p>
            </section>
          ))}
        </div>

        {/* Last, deliberately. What a thing is built with matters to the few
            readers who ask, and it answers a question nobody has at the top of
            a case study. */}
        <section className="flex flex-col gap-3 border-b border-rule/70 p-6">
          <h2 className="label">Детали</h2>
          <dl className="flex flex-col gap-2">
            <div className="flex gap-4">
              <dt className="label w-24 shrink-0">Стек</dt>
              <dd className="text-sm leading-5 text-ink">
                {project.stack.join(", ")}
              </dd>
            </div>
          </dl>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer"
              className="link text-sm"
            >
              Код <ExternalLink size={14} className="inline" />
            </a>
          )}
        </section>
      </aside>

        {/* The work itself. Always mounted — on a narrow screen the notes
          come and go as a layer over it, and the stage stays running. */}
        <div className="min-h-0 min-w-0 flex-1">
          {/* Keyed by the project, so moving between them starts the stage over.
              Without it React keeps the instance — same type, same position — and
              the chosen viewport survives into a project that may not have it: a
              desktop-only project inherited the phone width from the one before
              and had no switch to escape it, because it only has one. */}
          <Preview key={project.slug} project={project} />
        </div>
      </div>
    </main>
  )
}
