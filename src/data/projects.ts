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
    tagline: "Поиск работы, где фильтры не врут, а телефон — не уменьшенный десктоп",
    year: 2026,
    stack: ["React 19", "TypeScript", "Vite", "Tailwind v4", "Base UI"],
    url: "https://portfolio-mu-black-10.vercel.app/",
    repo: "https://github.com/timerbaevdamir/job-board",
    embed: true,
    viewports: ["phone", "desktop"],
    summary:
      "Поиск вакансий, доведённый до состояния, когда им можно пользоваться, " +
      "а не смотреть на него. Человек видит, сколько вакансий останется, ещё " +
      "до того как применит фильтр; лента честно говорит, что грузится, и " +
      "возвращается к началу, когда запрос изменился. На телефоне интерфейс " +
      "собран заново, а не сжат.",
    notes: [
      {
        title: "Число рядом с фильтром — это обещание",
        body:
          "Возле каждой опции стоит, сколько вакансий останется, если её " +
          "выбрать. Это меняет поведение: человек перестаёт сужать поиск " +
          "вслепую и опасаться, что сейчас всё исчезнет. Тупиковый вариант " +
          "видно до нажатия, а не после.",
      },
      {
        title: "На телефоне другой интерфейс, а не тот же поменьше",
        body:
          "Поиск открывается на весь экран: списку достаётся вся высота, " +
          "клавиатуре есть куда встать, закрывается смахиванием вниз. " +
          "Фильтры приходят снизу и занимают ровно столько, сколько нужно. " +
          "Город переехал внутрь поиска — в строке он отбирал место у " +
          "главного, у того, что человек печатает.",
      },
      {
        title: "Переход помнит, откуда пришли",
        body:
          "Вакансия наезжает поверх ленты, лента уходит вглубь и " +
          "притемняется; возврат разворачивает то же движение назад. Человек " +
          "не теряет место, на котором остановился, и не проверяет, сработала " +
          "ли кнопка «назад».",
      },
      {
        title: "Ожидание не притворяется",
        body:
          "Как только запрос меняется, лента сразу показывает, что результаты " +
          "уже другие, и возвращается к началу — а не оставляет читателя " +
          "посреди списка, который вот-вот исчезнет. Ответ, опоздавший к " +
          "своему запросу, не показывается вовсе.",
      },
    ],
  },
  {
    slug: "ui-agent",
    title: "UI-агент",
    tagline: "Опишите экран словами — агент соберёт его и покажет рядом",
    year: 2026,
    stack: ["React", "Vite", "Tailwind", "Radix UI"],
    url: "https://ui-agent-one.vercel.app/",
    embed: true,
    viewports: ["desktop"],
    summary:
      "Интерфейс агента, который собирает экраны по описанию — не картинку, " +
      "а рабочую вёрстку на компонентах живой дизайн-системы. Слева " +
      "разговор, справа результат, и оба меняются в одном ритме.",
    notes: [
      {
        title: "Пустое состояние задаёт вопрос",
        body:
          "«Что собрать сегодня?» — и сразу поле ввода. Не список " +
          "возможностей и не тур по продукту: первое, что видит человек, — " +
          "место, куда писать, и одна строка о том, что произойдёт дальше.",
      },
      {
        title: "Композер — один блок, а не панель инструментов",
        body:
          "Поле, вложение, голос, выбор модели и отправка живут в одной " +
          "рамке. Модель стоит рядом с текстом, потому что это часть того же " +
          "решения — чем собирать, — а не настройка приложения.",
      },
      {
        title: "Шаблоны показаны результатом",
        body:
          "«Реестр клиентов» и «Тарифы» подписаны тем, что получится, и " +
          "показаны превью собранного экрана. Список названий заставлял бы " +
          "угадывать; превью отвечает на вопрос до нажатия.",
      },
    ],
  },
  {
    slug: "coffee-map",
    title: "Coffee Map",
    tagline: "Карта кофеен, которая ведёт себя как приложение, а не как сайт",
    year: 2026,
    stack: ["Next.js", "TypeScript", "Mapbox GL", "Supabase", "Framer Motion"],
    url: "https://coffeemap.ru/map?city=moscow",
    embed: false,
    viewports: ["phone"],
    summary:
      "Работающий сервис, а не прототип: карта кофеен по городам, с " +
      "подборками и событиями. Интересен тем, как ощущается на телефоне — " +
      "карточки, поиск и выбор города открываются так, как это делают " +
      "нативные приложения, поэтому ими пользуются, а не мирятся.",
    notes: [
      {
        title: "Карточка открывается, а не выпрыгивает",
        body:
          "Кофейня приезжает снизу и накрывает карту не до конца — сверху " +
          "остаётся полоска, по которой видно, что карта никуда не делась и " +
          "к ней можно вернуться. Закрывается перетаскиванием, и чем " +
          "решительнее жест, тем быстрее она уходит.",
      },
      {
        title: "Карта отвечает на движение пальца",
        body:
          "Пока тянешь карточку вниз, карта позади возвращается — " +
          "приближается и распрямляется ровно в такт руке, а не после того " +
          "как отпустишь. Это и отличает жест от анимации: результат видно " +
          "во время движения.",
      },
      {
        title: "Поиск не воюет с клавиатурой",
        body:
          "Панель поиска встаёт над клавиатурой, а не прячется под ней, и " +
          "список результатов остаётся виден целиком. На айфоне это даётся " +
          "не бесплатно — и именно поэтому чаще всего сделано плохо.",
      },
      {
        title: "Почему здесь нет живого фрейма",
        body:
          "Это не прототип, а сервис с настоящими аккаунтами, и он не " +
          "разрешает встраивать себя в чужие страницы. Настройка правильная, " +
          "и обходить её ради обложки в портфолио не стоит. Открывается " +
          "отдельной вкладкой.",
      },
    ],
  },
]

export const findProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug) ?? null
