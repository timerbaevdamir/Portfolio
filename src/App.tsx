import { useRoute } from "@/lib/router"
import { Home } from "@/pages/Home"
import { ProjectPage } from "@/pages/ProjectPage"

/**
 * Shell and routing.
 *
 * Both pages take the viewport exactly once and scroll inside their own
 * columns, so the shell is only what stops the page itself from scrolling.
 * Nothing sits above them: the shelf carries its identity in the left column
 * and a project carries its way out in the rail, so a masthead over either
 * would repeat what is already on screen and charge height for it — height
 * being the dimension the thing on display is short of.
 */
export default function App() {
  const route = useRoute()

  return (
    <main className="h-dvh overflow-hidden">
      {route.name === "project" ? <ProjectPage slug={route.slug} /> : <Home />}
    </main>
  )
}
