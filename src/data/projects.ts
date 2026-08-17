/**
 * Every project on this site.
 *
 * This file is the whole content model — adding a project is adding an entry
 * here, and nothing else. Deliberately data rather than a page per project:
 * the layout is the same for all of them, and the moment it isn't, that is a
 * reason to change the layout rather than to hand-write a page.
 *
 * Nothing here reaches into a project's own repository, and no project knows
 * this site exists. They are separate deployments joined by a URL, which is
 * what keeps each of them a real project rather than a page of this one.
 */

export type Viewport = "phone" | "desktop"

export type Project = {
  /** URL segment: `/p/<slug>`. */
  slug: string
  title: string
  /** One line, shown under the title in the list. */
  tagline: string
  year: number
  /** Named as a reader would say them, not as package.json spells them. */
  stack: string[]
  /** The project's own deployment — what gets embedded and linked. */
  url: string
  repo?: string
  /** Which widths are worth showing. The first is the default. */
  viewports: Viewport[]
  /** A paragraph for the list; the opening of the case study. */
  summary: string
  /** What is actually interesting in it. Two to five. */
  notes: { title: string; body: string }[]
}

export const PROJECTS: Project[] = [
  {
    slug: "job-board",
    title: "Джоб-борд",
    tagline: "Поиск вакансий: фасетные фильтры, мобильные шторки, переходы как в iOS",
    year: 2026,
    stack: ["React 19", "TypeScript", "Vite", "Tailwind v4", "Base UI"],
    url: "https://portfolio-mu-black-10.vercel.app/",
    repo: "https://github.com/timerbaevdamir/job-board",
    viewports: ["phone", "desktop"],
    summary:
      "Прототип поиска работы, доведённый до состояния, в котором его можно " +
      "пользовать, а не смотреть. Фильтры считают реальные числа, поиск " +
      "показывает загрузку и сбрасывает позицию, а на телефоне интерфейс " +
      "устроен иначе, чем на десктопе, — не уменьшен, а переписан.",
    notes: [
      {
        title: "Счётчики говорят правду",
        body:
          "Рядом с каждой опцией фильтра стоит число — сколько вакансий " +
          "останется, если её выбрать. Считается фасетно: при подсчёте своя " +
          "же группа из запроса выбрасывается, иначе выбор одного варианта " +
          "обнулял бы все соседние.",
      },
      {
        title: "На телефоне — другой интерфейс, а не тот же поменьше",
        body:
          "Поиск открывается шторкой во весь экран: списку достаётся вся " +
          "высота, клавиатуре есть куда встать, закрывается свайпом. " +
          "Фильтры — шторка по высоте контента. Город переезжает внутрь " +
          "поиска, потому что в строке он воевал за место со вводом.",
      },
      {
        title: "Переходы между экранами",
        body:
          "Push и pop с параллаксом: приходящий экран проходит всю ширину, " +
          "накрываемый отдаёт треть и притемняется. Направление берётся из " +
          "истории — каждая запись несёт свою глубину, потому что хеш на " +
          "вопрос «вперёд или назад» не отвечает.",
      },
      {
        title: "Архитектура",
        body:
          "Feature-Sliced Design: ноль восходящих импортов, ноль межслайсовых. " +
          "75 тестов в двух прогонах — чистая логика в node, хуки и стор в " +
          "jsdom. Первый же тест истории нашёл живой баг: hashchange после " +
          "popstate затирал направление, и «назад» анимировалось как «вперёд».",
      },
    ],
  },
]

export const findProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug) ?? null
