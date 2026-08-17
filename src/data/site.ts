/**
 * Everything about the person rather than the work.
 *
 * The headline is the one claim this page can make that a portfolio of
 * screenshots cannot, so it says that and nothing else. "Проектирую интерфейсы"
 * was true of everyone who has ever built one of these.
 */
export const SITE = {
  name: "Дамир Тимербаев",
  role: "Продуктовый дизайнер",
  headline: "Это не скриншоты.",
  intro:
    "Продуктовый дизайнер. Довожу интерфейсы до состояния, в котором их " +
    "можно открыть и потрогать — ввести запрос, применить фильтр, " +
    "переключить ширину и увидеть, как раскладка перестраивается под телефон.",
  links: [
    { label: "GitHub", href: "https://github.com/timerbaevdamir" },
    // Добавьте сюда почту или телеграм, когда решите, что публиковать.
  ] as { label: string; href: string }[],
}
