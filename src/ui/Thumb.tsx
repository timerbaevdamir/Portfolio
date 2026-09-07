import { useRef, useState, useEffect } from "react"
import { ArrowUpRight, Globe2 } from "lucide-react"
import { cn } from "@/lib/cn"
import { useInView } from "@/lib/useInView"
import { holdScroll } from "@/lib/holdScroll"
import type { Project } from "@/data/projects"

/** What a thumbnail renders at before being scaled into its tile. */
const LOGICAL = { desktop: { w: 1280, h: 800 }, phone: { w: 390, h: 844 } }

/**
 * A project as a picture of itself.
 *
 * Still the real deployment in a frame rather than a screenshot — a screenshot
 * goes stale the day after it is taken, and this one cannot. But it is a
 * picture here and nothing more: pointer events are off and it is hidden from
 * assistive tech, because the tile's job is to be clicked, not used. Using it
 * happens on the project's own page.
 *
 * The thumbnail shows only the initial screen; all interaction belongs to
 * the full preview on the project page.
 */
export function Thumb({ project, className }: { project: Project; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // A phone wherever a project has one: on a shelf the tiles are read at a
  // glance, and a device standing on a dark ground is recognisable at a size
  // where a desktop layout has already become a grey texture. A project with no
  // phone view falls back to the desktop rather than being shown a width it
  // does not have.
  //
  // The tile stays landscape either way. Letting the aspect follow the content
  // would make the grid ragged, and a set that does not line up stops reading
  // as a set.
  const showsPhone = project.viewports.includes("phone")
  const size = showsPhone ? LOGICAL.phone : LOGICAL.desktop
  const height = width * 0.625
  const scale = showsPhone ? (height * 0.86) / size.h : width / size.w

  return (
    <div
      ref={ref}
      className={cn(
        // Isolate the composited iframe so its corners stay clipped.
        "relative isolate overflow-hidden rounded-[15px] bg-surface",
        className,
      )}
      style={{ aspectRatio: "8 / 5" }}
      aria-hidden
    >
      {project.embed === true && visible && scale > 0 ? (
        <iframe
          src={project.url}
          title=""
          aria-hidden
          tabIndex={-1}
          loading="lazy"
          onLoad={holdScroll}
          className={cn(
            "pointer-events-none absolute left-1/2 origin-top border-0",
            showsPhone ? "top-[7%] rounded-[28px] shadow-2xl ring-1 ring-ink/15" : "top-0",
          )}
          style={{
            width: size.w,
            height: size.h,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "top center",
          }}
        />
      ) : project.embed !== true ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl border border-ink/10 bg-ink/5 text-ink">
            <Globe2 size={24} />
          </span>
          <span className="text-lg font-medium tracking-[-0.025em] text-ink">
            {new URL(project.url).host}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            На отдельном сайте <ArrowUpRight size={13} />
          </span>
        </div>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-sm text-faint">
          {new URL(project.url).host}
        </span>
      )}
    </div>
  )
}
