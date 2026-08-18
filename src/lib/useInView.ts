import { useEffect, useState, type RefObject } from "react"

/**
 * Whether an element has come near the viewport — once true, always true.
 *
 * Every embed on this site waits for this before it loads. With one project
 * that is a nicety; with a grid of them it is the difference between a page
 * that opens and a page that boots four applications first.
 */
export function useInView(ref: RefObject<Element | null>, margin = "300px") {
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      (entries) => {
        // A margin, so an app has a head start on its first paint rather than
        // booting under the reader's gaze.
        if (entries.some((e) => e.isIntersecting)) setSeen(true)
      },
      { rootMargin: margin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin, seen])

  return seen
}
