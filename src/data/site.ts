/**
 * Everything about the person rather than the work.
 *
 * Kept beside `projects.ts` and equally editable: these are the two files this
 * site is made of. Nothing here is inferred from anywhere — a fact appears on a
 * public page only because it was written down here.
 */
export const SITE = {
  name: "Дамир Тимербаев",
  /**
   * Portrait for the left column. A path under `public/`, so the file ships
   * with the deploy and is versioned beside the page that shows it.
   *
   * Until the file exists the image removes itself rather than leaving a broken
   * icon — a portfolio missing its author's face should look like a portfolio
   * without a face, not like a page that failed.
   */
  avatar: "/avatar.jpg",
  role: "Продуктовый дизайнер",
  /** The heading over the work. A label, not a pitch. */
  headline: "Проекты",
  /** What the reader can do here, said once and without argument. */
  intro:
    "Каждый запущен прямо на этой странице: можно набрать запрос, применить " +
    "фильтр, переключить ширину. Разбор решений — на странице проекта.",
  /** Two or three sentences in the left column. Not a CV. */
  about:
    "Проектирую интерфейсы и довожу их до работающих прототипов — так " +
    "видно, что решение живёт, а не только смотрится. Интересуюсь тем, как " +
    "интерфейс ведёт себя в руке: жестами, переходами, ожиданием.",
  /**
   * Roles, most recent first. Left empty deliberately — an employer is a fact
   * about a person and belongs here only if the person wrote it, not because
   * it could be guessed from a machine. The section does not render until
   * there is something in it.
   */
  experience: [] as { period: string; place: string; role: string }[],
  links: [
    { label: "GitHub", href: "https://github.com/timerbaevdamir" },
    // Почта или телеграм — когда решите, что публиковать.
  ] as { label: string; href: string }[],
}
