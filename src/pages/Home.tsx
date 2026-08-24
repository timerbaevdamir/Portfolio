import { useEffect, useRef, useState } from "react"
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
 * On a phone the column becomes a pocket above the work, borrowing the
 * seller-portal pattern: the header — avatar and name — is pinned and never
 * reached by scrolling, the rest of the column sits still beneath it, and the
 * sheet of projects slides up over that rest, tucking itself under the
 * header. Same content, rearranged for a screen with no room beside.
 */
export function Home() {
  const navigate = useNavigate()

  // The sheet begins below the pocket at rest, so it needs a spacer as tall
  // as the pocket's contents. Measured rather than guessed: the about text
  // and the experience list wrap differently at every width.
  const pocketRef = useRef<HTMLDivElement>(null)
  const [pocketHeight, setPocketHeight] = useState(0)

  useEffect(() => {
    const el = pocketRef.current
    if (!el) return
    // `contentRect` of a ResizeObserver entry excludes padding, and the
    // spacer must stand in for the whole pocket, hem included.
    const ro = new ResizeObserver(() => {
      setPocketHeight(el.getBoundingClientRect().height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden w-[340px] shrink-0 flex-col justify-between gap-10 overflow-y-auto p-6 lg:flex lg:p-10">
        <div className="flex flex-col gap-8">
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

          <p className="text-sm leading-6 text-muted">{SITE.about}</p>

          {SITE.roles.length > 0 && (
            <section className="flex flex-col gap-3">
              {SITE.roles.map((role) => (
                <div key={role.name} className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rule font-mono text-xs text-muted">
                    {role.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-medium text-ink">{role.name}</span>
                    <span className="text-sm leading-5 text-muted">{role.role}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

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

        <nav className="flex flex-row flex-wrap items-center gap-2">
          {SITE.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "pill inline-flex items-center gap-1.5",
                link.primary
                  ? "bg-ink text-ground transition-opacity hover:opacity-85"
                  : "bg-raised text-muted transition-colors hover:text-ink",
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="relative min-h-0 flex-1 overflow-hidden lg:my-2 lg:mr-2 lg:rounded-2xl lg:bg-raised">
        {/* The pocket header, pinned: the sheet rises to its lower edge and
            no further, so the avatar and name are always on screen. */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 px-6 pb-3 pt-3 lg:hidden">
          {SITE.avatar && (
            <img
              src={SITE.avatar}
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full object-cover ring-1 ring-rule"
              onError={(event) => {
                event.currentTarget.style.display = "none"
              }}
            />
          )}
          <div className="flex flex-col">
            <span className="font-mono text-sm font-medium tracking-[-0.01em] text-ink">
              {SITE.name}
            </span>
            <span className="label">{SITE.role}</span>
          </div>
        </div>

        {/* The rest of the column, standing still under the header. The
            sheet of projects slides up over it as the reader scrolls. */}
        <div
          ref={pocketRef}
          className="absolute inset-x-0 top-16 z-0 flex flex-col gap-6 px-6 pb-6 pt-3 lg:hidden"
        >
          <p className="text-sm leading-6 text-muted">{SITE.about}</p>

          {SITE.roles.length > 0 && (
            <section className="flex flex-col gap-3">
              {SITE.roles.map((role) => (
                <div key={role.name} className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rule font-mono text-xs text-muted">
                    {role.initials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-medium text-ink">{role.name}</span>
                    <span className="text-sm leading-5 text-muted">{role.role}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {SITE.experience.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="label">Опыт</h2>
              <ul className="flex flex-col gap-3">
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

          <nav className="flex flex-row flex-wrap items-center gap-2">
            {SITE.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "pill inline-flex items-center gap-1.5",
                  link.primary
                    ? "bg-ink text-ground transition-opacity hover:opacity-85"
                    : "bg-raised text-muted transition-colors hover:text-ink",
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* The work itself. It scrolls over the pocket's contents and under
            the header: `top-16` is the header's hem, the boundary the sheet
            cannot cross. The panel's own rounded top is the hem the tiles
            disappear under — through the corners the pocket still peeks.
            The panel is the scroller at every width: on a phone it sits
            below the header, on a wide screen it fills the sheet entirely,
            and `main` only clips. */}
        <div className="scroll-area absolute inset-x-0 bottom-0 top-16 z-10 overflow-y-auto rounded-t-3xl lg:top-0 lg:rounded-none">
          {/* Keeps the sheet below the pocket at rest; see-through and
              click-through, so the column beneath stays readable and its
              links stay tappable. */}
          <div
            aria-hidden
            className="pointer-events-none lg:hidden"
            style={{ height: pocketHeight }}
          />

          <div className="mx-auto w-full max-w-4xl rounded-t-3xl bg-raised px-6 pb-24 lg:rounded-none lg:bg-transparent lg:px-10">
            {/* A heading over the work, not a hero above it. The column on the
                left already says whose work this is, and the tiles say better
                than a sentence can what the work is — so this stays a label and
                gives the room back. */}
            <section className="flex flex-col gap-3 py-8 lg:py-16">
              <h1 className="font-mono text-2xl font-medium tracking-[-0.02em] text-ink">
                {SITE.headline}
              </h1>
              <p className="max-w-[60ch] text-base leading-7 text-muted">
                {SITE.intro}
              </p>
            </section>

            <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
              {PROJECTS.map((project) => (
                <li key={project.slug}>
                  <a
                    href={`/p/${project.slug}`}
                    onClick={(e) => {
                      e.preventDefault()
                      navigate({ name: "project", slug: project.slug })
                    }}
                    className="group flex flex-col gap-4"
                  >
                    <Thumb project={project} className="group-hover:border-faint" />
                    {/* Tight to the title: a tagline is the second line of a
                        name, not a paragraph after it. */}
                    <div className="flex flex-col gap-1">
                      <h2 className="font-mono text-lg font-medium tracking-[-0.02em] text-ink">
                        {project.title}
                      </h2>
                      <p className="text-sm leading-6 text-muted">
                        {project.tagline}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
