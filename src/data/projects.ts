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
  /**
   * The engagement in facts — client, platforms, role. Shown as a spec block,
   * because that is what a reader checks first and reads once.
   */
  facts?: { label: string; value: string }[]
  /** What the work set out to do. Plain statements, no prose around them. */
  goals?: string[]
  /** What is actually interesting in it. Two to five. */
  notes: { title: string; body: string }[]
}

export const PROJECTS: Project[] = [
  {
    slug: "job-board",
    title: "Джоб-борд",
    tagline: "Сервис поиска работы на персональных рекомендациях",
    year: 2026,
    stack: ["React 19", "TypeScript", "Vite", "Tailwind v4", "Base UI"],
    url: "https://portfolio-mu-black-10.vercel.app/",
    repo: "https://github.com/timerbaevdamir/job-board",
    embed: true,
    viewports: ["phone", "desktop"],
    summary:
      "Сервис поиска работы, устроенный вокруг персональных рекомендаций: " +
      "они строятся на опыте, навыках и предпочтениях соискателя и на том, " +
      "что он делает в продукте. Три опоры — вакансии, профиль и чаты с " +
      "работодателями.",
    facts: [
      { label: "Компания", value: "No Name" },
      { label: "Платформы", value: "Web, Mobile" },
      { label: "Роль", value: "IA, CX, UX, UI" },
    ],
    goals: [
      "Упростить сквозной флоу продукта",
      "Спроектировать навигационные паттерны",
      "Спроектировать информационную архитектуру",
      "Спроектировать главную",
      "Спроектировать раздел откликов",
      "Спроектировать поисковую выдачу",
    ],
    notes: [
      {
        title: "Главная",
        body:
          "Собрано то, что нужно соискателю, чтобы искать: рекомендации " +
          "вакансий, наиболее совпадающих с резюме и с его активностью в " +
          "продукте. Рядом — полоска активности, растущая вместе с его " +
          "действиями, поисковые подсказки и сервисы. Рекомендации здесь " +
          "предлагают не только вакансию, но и следующее действие.",
      },
      {
        title: "Поисковая выдача",
        body:
          "Продолжение главной, а не отдельный экран: те же карточки, тот же " +
          "порядок чтения. Выдачу можно сузить фильтрами, а по умолчанию она " +
          "отсортирована «по соответствию» — сначала вакансии, ближе всего " +
          "совпадающие с резюме и указанными в нём навыками.",
      },
      {
        title: "Вакансия",
        body:
          "Модальное окно с тем, что о вакансии сказал работодатель: " +
          "откликнуться, посмотреть контакты, сохранить. По образцу почтовых " +
          "интерфейсов в этом же окне листаются другие рекомендованные " +
          "вакансии — соискатель перебирает их, не возвращаясь в список.",
      },
      {
        title: "Отклики",
        body:
          "Общение с работодателем идёт чатом и в свободной форме: о " +
          "следующих этапах договариваются словами, а не кнопками. У каждого " +
          "отклика есть статус — приглашение, отказ, просмотр, — и по " +
          "статусам фильтруется весь список.",
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
    embed: true,
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
    ],
  },
]

export const findProject = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug) ?? null
