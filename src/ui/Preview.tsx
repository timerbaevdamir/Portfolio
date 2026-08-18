import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/cn"
import { useInView } from "@/lib/useInView"
import { holdScroll } from "@/lib/holdScroll"
import type { Project, Viewport } from "@/data/projects"

const SIZES: Record<Viewport, { label: string; width: number; height: number }> =
  {
    // iPhone 14/15 — 390x844, the logical size most phones in use report.
    phone: { label: "Телефон", width: 390, height: 844 },
    // Not a size but a floor: below 1280 the job board stops calling itself a
    // desktop — that is its own `xl` breakpoint — and a frame labelled
    // "Десктоп" showing the tablet rail would be a lie about what is being
    // shown. Above it the frame simply takes the room it is given.
    desktop: { label: "Десктоп", width: 1280, height: 0 },
  }

/**
 * The stage: a project running at the size of the space it is given.
 *
 * Never scaled. A CSS transform on a frame breaks how the browser rasterises
 * `position: fixed` content inside it — sheets measure and hit-test correctly
 * at full height and paint two thirds of the way down — so the frame here is
 * always 1:1 and the stage scrolls if the device does not fit. A tall
 * phone-shaped card is a phone; a phone with its bottom missing is a broken
 * embed.
 */
export function Preview({ project }: { project: Project }) {
  return project.embed ? <LiveStage project={project} /> : <Cover project={project} />
}

/**
 * The chrome: a window, the way a preview pane in an editor is a window.
 *
 * Three groups, left to right — what to show, where it is, how to leave. The
 * middle is the point: a real hostname is what says this is a deployment rather
 * than a mockup, which is the claim the whole site rests on.
 */
function Window({
  url,
  controls,
  children,
}: {
  url: string
  controls?: ReactNode
  children: ReactNode
}) {
  const host = new URL(url).host

  return (
    <div className="@container flex h-full min-h-0 flex-col bg-raised">
      <div className="flex shrink-0 items-center gap-3 border-b border-rule px-3 py-2.5">
        <div className="flex shrink-0 items-center gap-1">{controls}</div>

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

      <div className="scroll-area min-h-0 flex-1 overflow-auto bg-ground">
        {children}
      </div>
    </div>
  )
}

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

function LiveStage({ project }: { project: Project }) {
  const [viewport, setViewport] = useState<Viewport>(
    project.viewports[0] ?? "desktop",
  )
  const boxRef = useRef<HTMLDivElement>(null)
  const visible = useInView(boxRef, "0px")
  const [box, setBox] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry)
        setBox({
          w: Math.round(entry.contentRect.width),
          h: Math.round(entry.contentRect.height),
        })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const spec = SIZES[viewport]
  const isPhone = viewport === "phone"

  // How much the frame has to shrink to fit the stage.
  //
  // A phone is capped at 1 and never larger: shown bigger than life it would
  // misstate the size of its type, which on a phone is most of the design.
  //
  // A desktop shrinks only when the stage is narrower than a desktop — then it
  // is rendered at 1280 and scaled down, rather than handed the stage's own
  // width and made to show its tablet self under a label that says otherwise.
  const scale =
    box.w > 0 && box.h > 0
      ? isPhone
        ? Math.min(1, box.w / spec.width, box.h / spec.height)
        : Math.min(1, box.w / spec.width)
      : 1

  const frame = isPhone
    ? { width: spec.width, height: spec.height }
    : { width: Math.round(box.w / scale), height: Math.round(box.h / scale) }

  return (
    <Window
      url={project.url}
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
      <div
        ref={boxRef}
        className={cn(
          "flex h-full min-h-full w-full",
          isPhone ? "items-center justify-center p-6" : "",
        )}
      >
        {visible && frame.width > 0 && (
          <iframe
            src={project.url}
            title={`${project.title} — живой прототип`}
            onLoad={holdScroll}
            className={cn(
              // Never shrunk by the layout. A flex parent will happily pull a
              // 1280 frame down to the width it has, and then the transform
              // shrinks what is already wrong — the app ends up laying out for
              // the stage's width, which is the very thing the desktop frame
              // exists to avoid.
              "shrink-0 border-0",
              isPhone && "rounded-xl border border-rule",
            )}
            style={{
              width: frame.width,
              height: frame.height,
              transform: `scale(${scale})`,
              // A desktop is rendered to fill the stage exactly, so it grows
              // from the corner. A phone is centred, and a centred transform
              // leaves the unscaled footprint behind — the negative margin
              // shrinks the box to what is actually drawn.
              // A transform draws smaller but still occupies its full size in
              // the layout, so the box has to be pulled back in by hand or the
              // stage scrolls to reach space that is not painted. A phone grows
              // from its centre and gives back on both sides; a desktop grows
              // from the corner and gives back on two.
              ...(isPhone
                ? {
                    margin: `${(frame.height * (scale - 1)) / 2}px ${(frame.width * (scale - 1)) / 2}px`,
                  }
                : {
                    transformOrigin: "top left",
                    marginRight: frame.width * (scale - 1),
                    marginBottom: frame.height * (scale - 1),
                  }),
            }}
          />
        )}
      </div>
    </Window>
  )
}

/**
 * The stand-in for a project that refuses to be framed.
 *
 * Stated rather than hidden: a live service with real accounts sends
 * `frame-ancestors 'none'`, and working around that to decorate a portfolio
 * would be a poor trade.
 */
function Cover({ project }: { project: Project }) {
  return (
    <Window
      url={project.url}
      controls={<span className="label px-1">Боевой сайт</span>}
    >
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className="flex h-full min-h-full flex-col items-center justify-center gap-3 px-8 text-center"
      >
        <span className="label">Запрещает встраивание в чужие страницы</span>
        <span className="link font-mono text-lg">Открыть проект ↗</span>
      </a>
    </Window>
  )
}
