import { useRef, useState, useEffect } from "react"
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
 * Scaling is safe at this size for the reason it was not safe at full size: a
 * transformed frame mis-rasterises `position: fixed` content, and nothing here
 * opens a sheet — the app is shown exactly as it boots.
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
  const scale = showsPhone ? height / size.h : width / size.w

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden border-b border-rule bg-ground",
        className,
      )}
      style={{ height: height || 220 }}
    >
      {project.embed && visible && scale > 0 ? (
        <iframe
          src={project.url}
          title=""
          aria-hidden
          tabIndex={-1}
          loading="lazy"
          onLoad={holdScroll}
          className="pointer-events-none absolute left-1/2 top-0 origin-top border-0"
          style={{
            width: size.w,
            height: size.h,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "top center",
          }}
        />
      ) : (
        <span className="label absolute inset-0 flex items-center justify-center">
          {new URL(project.url).host}
        </span>
      )}
    </div>
  )
}
