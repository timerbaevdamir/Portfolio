/**
 * Everything about the person rather than the work.
 *
 * Kept beside `projects.ts` and equally editable: these are the two files this
 * site is made of. Nothing here is inferred from anywhere — a fact appears on a
 * public page only because it was written down here.
 */
export const SITE = {
  name: "Дамир Тимербаев",
  role: "Продуктовый дизайнер",
  /** The one claim the shelf makes. Short on purpose. */
  headline: "Это не скриншоты.",
  intro:
    "Прототипы ниже — не записи экрана и не картинки. Каждый развёрнут " +
    "отдельно и запущен прямо на этой странице: можно ввести запрос, " +
    "применить фильтр, переключить ширину и посмотреть, как интерфейс " +
    "перестраивается под телефон.",
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
