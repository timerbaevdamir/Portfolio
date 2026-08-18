/**
 * Hold this page's scroll position through a frame's first moments.
 *
 * An embedded app may focus something as it boots — a chat focuses its composer
 * — and the browser then scrolls every scrollable ancestor to reveal it, this
 * page included. A reader opening the site landed halfway down it, at whichever
 * project happened to grab focus first.
 *
 * The frame is a demonstration; it does not get to decide where the reader is
 * looking. So the position is taken when the frame loads and put back if it
 * moves on its own — and only then. Any real gesture calls the hold off,
 * because a reader who has started scrolling has said where they want to be and
 * must not be dragged back.
 *
 * `instant` matters: the page sets `scroll-behavior: smooth`, and undoing a
 * jump that should never have happened is not a journey worth animating.
 */
export function holdScroll() {
  const top = window.scrollY
  const until = performance.now() + 800
  let holding = true

  const release = () => {
    holding = false
  }
  for (const event of ["wheel", "touchstart", "keydown"] as const) {
    window.addEventListener(event, release, { once: true, passive: true })
  }

  const restore = () => {
    if (!holding) return
    if (window.scrollY !== top) window.scrollTo({ top, behavior: "instant" })
    if (performance.now() < until) requestAnimationFrame(restore)
    else release()
  }
  requestAnimationFrame(restore)
}
