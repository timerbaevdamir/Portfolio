/**
 * Everything about the person rather than the work.
 *
 * Kept beside `projects.ts` and equally editable: these are the two files this
 * site is actually made of. Nothing here is inferred from anywhere — a contact
 * appears on a public page only because it was written down here.
 */
export const SITE = {
  name: "Дамир Тимербаев",
  role: "Продуктовый дизайнер",
  /** The one claim the top of the page makes. Short on purpose. */
  headline: "Проектирую интерфейсы и собираю их работающими.",
  intro:
    "Прототипы ниже — не записи экрана и не картинки. Каждый развёрнут " +
    "отдельно и запущен прямо на этой странице: можно ввести запрос, " +
    "применить фильтр, переключить ширину и посмотреть, как интерфейс " +
    "перестраивается под телефон.",
  links: [
    { label: "GitHub", href: "https://github.com/timerbaevdamir" },
    // Добавьте сюда почту или телеграм, когда решите, что публиковать.
  ] as { label: string; href: string }[],
}
