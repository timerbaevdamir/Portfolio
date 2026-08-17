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
  /**
   * Whether it can be shown running inside this page.
   *
   * A live frame is the better showing, but it is the host's decision, not
   * ours: a production site with real accounts sends `frame-ancestors 'none'`
   * and is right to. Those are shown as a cover with a link out instead — which
   * is itself worth knowing about a project, so the page says so rather than
   * quietly degrading.
   */
  embed: boolean
  /** Optional screenshot for the ones that cannot be embedded. */
  poster?: string
  /** Which widths are worth showing. The first is the default. Live only. */
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
    embed: true,
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
  {
    slug: "coffee-map",
    title: "Coffee Map",
    tagline: "Карта кофеен: шторки, доведённые под iOS, и поиск, который дружит с клавиатурой",
    year: 2026,
    stack: ["Next.js", "TypeScript", "Mapbox GL", "Supabase", "Framer Motion"],
    url: "https://coffeemap.ru/map?city=moscow",
    embed: false,
    viewports: ["phone"],
    summary:
      "Не прототип, а работающий сервис: карта кофеен по городам, с " +
      "подборками, событиями и админкой. Интересна в нём мобильная механика — " +
      "шторки и поиск сделаны так, как это работает в нативном приложении, " +
      "а не так, как обычно получается в вебе.",
    notes: [
      {
        title: "Шторки, а не модалки",
        body:
          "Две разновидности: по высоте контента и во всю высоту, приколотая " +
          "под статус-бар так, чтобы сверху осталась полоска страницы. " +
          "Закрываются перетаскиванием — с резинкой на перелёте вверх и " +
          "длительностью, пропорциональной силе броска, потому что пружина " +
          "оседает полсекунды и всё это время оверлей ест касания.",
      },
      {
        title: "Фон живёт вместе с пальцем",
        body:
          "Страница позади уменьшается, съезжает вниз и скругляется — не по " +
          "флагу «открыто», а непрерывно, от текущего положения шторки. " +
          "Тянешь вниз — фон возвращается синхронно. Именно эта связка и " +
          "делает жест физическим.",
      },
      {
        title: "Поиск и клавиатура iOS",
        body:
          "Высота панели поиска считается от visualViewport, а не от " +
          "layout viewport: iOS не сжимает страницу под клавиатуру, а " +
          "уезжает под неё вместе с полем ввода, и `100dvh` тут не спасает.",
      },
      {
        title: "Почему здесь нет живого фрейма",
        body:
          "Сайт отдаёт `X-Frame-Options: DENY` и `frame-ancestors none`. Для " +
          "боевого сервиса с реальными аккаунтами это правильная настройка, " +
          "и обходить её ради красивой обложки в портфолио — плохой размен. " +
          "Открывается отдельной вкладкой.",
      },
    ],
  },
]

export const findProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug) ?? null
