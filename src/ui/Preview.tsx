import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/cn"
import type { Project, Viewport } from "@/data/projects"

/**
 * The logical size each viewport is rendered at — the width the embedded app
 * believes it has, not the space it is given on this page.
 *
 * That distinction is the whole trick. The frame renders at a real device width
 * and is then scaled to fit the column, so a 1440px layout can be shown inside
 * an 800px page without the app ever being told it is small. Squeeze the iframe
 * instead and you get the mobile layout at desktop scale, which demonstrates
 * nothing.
 */
const SIZES: Record<Viewport, { width: number; height: number; label: string }> =
  {
    phone: { width: 390, height: 844, label: "Телефон" },
    desktop: { width: 1440, height: 900, label: "Десктоп" },
  }

/**
 * A project, shown as well as it can be shown.
 *
 * Two bodies rather than one with a flag inside, because they have no state in
 * common: the live one measures, observes and scales, the cover does none of
 * that. Which one applies is the host's decision, not a design preference — see
 * `embed` in the manifest.
 */
export function Preview({
  project,
  className,
}: {
  project: Project
  className?: string
}) {
  return project.embed ? (
    <LiveFrame project={project} className={className} />
  ) : (
    <Cover project={project} className={className} />
  )
}

/**
 * The project running inside the page.
 *
 * It is an `iframe` pointing at the project's own deployment, and it is one on
 * purpose. Importing the project instead would put two applications in one
 * document: two CSS resets fighting, two React versions to reconcile, and a
 * prototype that can no longer be built without this site. A frame gives total
 * isolation for the price of one network request — and the request is deferred
 * until the reader has actually scrolled to it.
 *
 * Switching viewport does not reload anything. The frame's width changes, the
 * app inside hears its own media queries fire, and it re-lays-out — which is
 * the demonstration: one deployment, both layouts, live.
 */
function LiveFrame({
  project,
  className,
}: {
  project: Project
  className?: string
}) {
  const [viewport, setViewport] = useState<Viewport>(
    project.viewports[0] ?? "desktop",
  )
  const size = SIZES[viewport]

  const containerRef = useRef<HTMLDivElement>(null)
  const [available, setAvailable] = useState(0)

  // Nothing is loaded until the reader is looking at it. With one project that
  // is a nicety; by the fourth it is the difference between a page that opens
  // and a page that boots four applications first.
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ro = new ResizeObserver(([entry]) => {
      if (entry) setAvailable(entry.contentRect.width)
    })
    ro.observe(el)

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setStarted(true)
      },
      // Start a little before it arrives, so the app has a head start on its
      // own first paint rather than booting under the reader's gaze.
      { rootMargin: "300px" },
    )
    io.observe(el)

    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  // Never scaled up: a phone shown larger than life is a lie about the size of
  // its type, which on a phone is most of the design.
  const scale = available > 0 ? Math.min(1, available / size.width) : 0
  const shown = { width: size.width * scale, height: size.height * scale }

  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {project.viewports.length > 1 && (
          <div
            role="group"
            aria-label="Ширина экрана"
            className="flex items-center gap-1 rounded-full border border-rule p-1"
          >
            {project.viewports.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setViewport(v)}
                aria-pressed={v === viewport}
                className={cn(
                  "label rounded-full px-3.5 py-1.5 transition-colors",
                  v === viewport ? "bg-raised text-ink" : "hover:text-ink",
                )}
              >
                {SIZES[v].label}
              </button>
            ))}
          </div>
        )}

        <OpenLink url={project.url} />
      </div>

      <div ref={containerRef} className="w-full">
        <div
          className="device mx-auto overflow-hidden rounded-2xl transition-[width,height] duration-300 ease-soft"
          style={{ width: shown.width || "100%", height: shown.height || 480 }}
        >
          {started && scale > 0 && (
            <iframe
              src={project.url}
              title={`${project.title} — живой прототип`}
              loading="lazy"
              // The frame is sized in the app's own coordinates and then scaled
              // down as a whole, so the app never learns it is being shown small.
              style={{
                width: size.width,
                height: size.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                border: 0,
              }}
            />
          )}
        </div>
      </div>

      <figcaption className="font-mono text-sm leading-5 text-faint">
        Живой прототип, а не запись экрана — им можно пользоваться прямо здесь.
      </figcaption>
    </figure>
  )
}

/**
 * The stand-in for a project that refuses to be framed.
 *
 * Stated rather than hidden. A reader who notices that one project runs inline
 * and another does not deserves the reason, and the reason is creditable: a
 * live service with real accounts sends `frame-ancestors 'none'`, and working
 * around that to decorate a portfolio would be a poor trade.
 */
function Cover({
  project,
  className,
}: {
  project: Project
  className?: string
}) {
  const host = new URL(project.url).host

  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-end">
        <OpenLink url={project.url} />
      </div>

      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className="device group relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-2xl"
      >
        {project.poster ? (
          <>
            <img
              src={project.poster}
              alt=""
              className="size-full object-cover object-top transition-transform duration-500 ease-soft group-hover:scale-[1.02]"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-base leading-6 text-ink">
              {host} ↗
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-3 px-8 text-center">
            <span className="font-mono text-sm leading-5 text-faint">{host}</span>
            <span className="link font-mono text-lg">
              Открыть проект ↗
            </span>
          </span>
        )}
      </a>

      <figcaption className="font-mono text-sm leading-5 text-faint">
        Боевой сайт: он запрещает встраивание в чужие страницы, поэтому
        открывается отдельной вкладкой.
      </figcaption>
    </figure>
  )
}

function OpenLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="label transition-colors hover:text-ink"
    >
      Открыть отдельно ↗
    </a>
  )
}
