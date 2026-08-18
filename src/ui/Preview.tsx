import { useEffect, useRef, useState, type ReactNode } from "react"
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
const SIZES: Record<
  Viewport,
  { label: string; width: number; height: number; fluid?: boolean }
> = {
  // A phone is a fixed device: the whole point is a narrow layout shown inside
  // a page that is not narrow, so 390 is a literal width to simulate.
  phone: { label: "Телефон", width: 390, height: 844 },

  // A desktop is not simulated — the reader is already on one. `fluid` means
  // the frame takes whatever width it is given and the app lays out at the
  // reader's real width, which beats scaling a pretend 1440 down to fit.
  //
  // `width` is a floor rather than a size: below it the app stops calling
  // itself a desktop (its own `xl` breakpoint is 1280), and a frame labelled
  // "Десктоп" showing the tablet rail would be a lie. Narrower than that, the
  // frame holds 1280 and scales.
  desktop: { label: "Десктоп", width: 1280, height: 900, fluid: true },
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
 * The chrome around an embed: a window, the way a preview pane in an editor is
 * a window.
 *
 * The controls used to float above the frame, unattached — a row of buttons
 * that happened to sit near a rectangle. Giving them a title bar makes them
 * belong to the thing they operate, and the bar earns its place by carrying the
 * address: seeing a real hostname is what says this is a deployment and not a
 * mockup, which is the claim the whole site rests on.
 *
 * Three groups, left to right: what to show, where it is, and how to leave.
 */
function Window({
  url,
  width,
  controls,
  children,
}: {
  url: string
  /** The window is the device: it hugs the frame rather than framing it. */
  width?: number | string
  controls?: ReactNode
  children: ReactNode
}) {
  const host = new URL(url).host

  return (
    <div
      className="@container mx-auto overflow-hidden rounded-xl border border-rule bg-raised shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] transition-[width] duration-300 ease-soft"
      style={{ width: width ?? "100%" }}
    >
      <div className="flex items-center gap-3 border-b border-rule px-3 py-2.5">
        <div className="flex min-w-0 shrink-0 items-center gap-1">{controls}</div>

        {/* The address, quiet and centred — read, not typed. Hidden on a narrow
            screen, where the three groups cannot share one row and the link on
            the right already carries the destination. */}
        <span className="label hidden flex-1 justify-center truncate rounded-full bg-ground px-3 py-1 text-center @min-[560px]:flex">
          {host}
        </span>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="label ml-auto shrink-0 transition-colors hover:text-ink @min-[560px]:ml-0"
        >
          Открыть ↗
        </a>
      </div>

      {/* Darkest surface of the three, so a phone-width frame reads as floating
          in the window rather than as the window itself. */}
      <div className="bg-ground">{children}</div>
    </div>
  )
}

/** The segmented control, matching the label treatment the rest of the meta uses. */
function ViewportSwitch({
  viewports,
  value,
  onChange,
}: {
  viewports: Viewport[]
  value: Viewport
  onChange: (v: Viewport) => void
}) {
  return (
    <div
      role="group"
      aria-label="Ширина экрана"
      className="flex items-center gap-0.5 rounded-full bg-ground p-0.5"
    >
      {viewports.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={v === value}
          className={cn(
            "label rounded-full px-3 py-1 transition-colors",
            v === value ? "bg-raised text-ink" : "hover:text-ink",
          )}
        >
          {SIZES[v].label}
        </button>
      ))}
    </div>
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

  // Scaled down only when the frame genuinely does not fit the column, which
  // for a phone is never.
  //
  // It used to be scaled to fit the viewport height as well, and that had to
  // go: a CSS transform on the iframe breaks how the browser rasterises
  // `position: fixed` content inside it. The app's sheets measured and
  // hit-tested correctly at full height and simply painted short — the reason
  // the search sheet lost its bottom half in the frame while the filter sheet,
  // being content-height, did not. Browser zoom shifted the raster and made it
  // look fixed, which is what gave the cause away.
  //
  // So a phone is shown at 1:1 and the block is tall. A tall phone-shaped card
  // is a phone; a phone with its bottom missing is a broken embed.
  const logical = size.fluid ? Math.max(available, size.width) : size.width
  const scale = available > 0 ? Math.min(1, available / logical) : 0
  const shown = { width: logical * scale, height: size.height * scale }

  return (
    <figure ref={containerRef} className={cn("flex flex-col gap-3", className)}>
      <Window
        url={project.url}
        width={shown.width || undefined}
        controls={
          project.viewports.length > 1 ? (
            <ViewportSwitch
              viewports={project.viewports}
              value={viewport}
              onChange={setViewport}
            />
          ) : (
            <span className="label px-1">Живой прототип</span>
          )
        }
      >
        {/* The window is the device, so it narrows with it. A 390px frame
            floating in a 1780px window read as a mistake rather than as a
            phone: the dead ground either side was wider than the device. */}
        <div
          className="overflow-hidden transition-[height] duration-300 ease-soft"
          style={{ height: shown.height || 480 }}
        >
            {started && scale > 0 && (
              <iframe
                src={project.url}
                title={`${project.title} — живой прототип`}
                loading="lazy"
                // Sized in the app's own coordinates and then scaled down as a
                // whole, so the app never learns it is being shown small.
                style={{
                  width: logical,
                  height: size.height,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  border: 0,
                }}
              />
          )}
        </div>
      </Window>

      <figcaption className="font-mono text-sm leading-5 text-faint">
        Живой прототип, а не запись экрана — им можно пользоваться прямо здесь.
      </figcaption>
    </figure>
  )
}

/**
 * The stand-in for a project that refuses to be framed.
 *
 * Same window, empty of a page. Stated rather than hidden: a reader who notices
 * that one project runs inline and another does not deserves the reason, and
 * the reason is creditable — a live service with real accounts sends
 * `frame-ancestors 'none'`, and working around that to decorate a portfolio
 * would be a poor trade.
 */
function Cover({
  project,
  className,
}: {
  project: Project
  className?: string
}) {
  return (
    <figure className={cn("flex flex-col gap-3", className)}>
      <Window
        url={project.url}
        controls={<span className="label px-1">Боевой сайт</span>}
      >
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="group flex aspect-[16/10] items-center justify-center overflow-hidden"
        >
          {project.poster ? (
            <img
              src={project.poster}
              alt=""
              className="size-full object-cover object-top transition-transform duration-500 ease-soft group-hover:scale-[1.02]"
            />
          ) : (
            <span className="link font-mono text-lg">Открыть проект ↗</span>
          )}
        </a>
      </Window>

      <figcaption className="font-mono text-sm leading-5 text-faint">
        Запрещает встраивание в чужие страницы — открывается отдельной вкладкой.
      </figcaption>
    </figure>
  )
}
