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
 * A project running inside the page.
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
export function Preview({
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
            className="flex items-center gap-1 rounded-full border border-border bg-surface p-1"
          >
            {project.viewports.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setViewport(v)}
                aria-pressed={v === viewport}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm leading-5 transition-colors",
                  v === viewport
                    ? "bg-surface-raised text-foreground"
                    : "text-muted hover:text-foreground",
                )}
              >
                {SIZES[v].label}
              </button>
            ))}
          </div>
        )}

        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm leading-5 text-muted transition-colors hover:text-foreground"
        >
          Открыть отдельно ↗
        </a>
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

      <figcaption className="text-sm leading-5 text-faint">
        Живой прототип, а не запись экрана — им можно пользоваться прямо здесь.
      </figcaption>
    </figure>
  )
}
