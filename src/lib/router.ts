import { useCallback, useSyncExternalStore } from "react"

/**
 * Where the site currently is.
 *
 * Real paths rather than a hash: these get shared, and `/p/job-board` is a
 * link a person can read. It costs one rewrite rule on the host — see
 * `vercel.json` — which is the whole difference.
 */
export type Route = { name: "home" } | { name: "project"; slug: string }

/** Parse a pathname into a {@link Route}. Pure. */
export function parseRoute(pathname: string): Route {
  const [head, tail] = pathname.split("/").filter(Boolean)
  if (head === "p" && tail) return { name: "project", slug: tail }
  return { name: "home" }
}

/** Serialize a {@link Route} back into a path. Pure, inverse of `parseRoute`. */
export function routeToPath(route: Route): string {
  return route.name === "project" ? `/p/${route.slug}` : "/"
}

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((notify) => notify())

let installed = false

/** Deferred rather than run on import, so the module stays testable. */
function install() {
  if (installed) return
  installed = true
  window.addEventListener("popstate", emit)
}

export function navigate(route: Route) {
  install()
  const path = routeToPath(route)
  if (path === window.location.pathname) return
  history.pushState(null, "", path)
  // A new page starts at its top; only Back should restore a position, and the
  // browser does that itself.
  window.scrollTo({ top: 0 })
  emit()
}

function subscribe(onChange: () => void) {
  install()
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

export function useRoute(): Route {
  const path = useSyncExternalStore(subscribe, () => window.location.pathname)
  return parseRoute(path)
}

export function useNavigate() {
  return useCallback((route: Route) => navigate(route), [])
}
