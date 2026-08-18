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
   * Shown running inside this page, or shown as a cover.
   *
   * `true` embeds it. Anything else is the line the cover prints instead — so
   * a project that is not embedded says something true about itself, rather
   * than borrowing one generic excuse written for a different project. The two
   * cannot be set at once, which is the point of one field rather than two.
   *
   * A live frame is the better showing, but it is not always ours to give:
   * a production site may forbid framing, or depend on a service this page
   * cannot vouch for. Flipping this back to `true` restores the frame and
   * everything set up for it.
   */
  embed: true | string
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
    title: "Кофейная карта",
    tagline: "Независимый гид по спешелти-кофейням четырёх городов",
    year: 2026,
    stack: ["Next.js", "TypeScript", "Mapbox GL", "Supabase", "Framer Motion"],
    url: "https://coffeemap.ru/map?city=moscow",
    // Not framed: the map is served by a live backend whose data call fails
    // intermittently, and a case study that shows an error screen a third of
    // the time argues against itself. The viewports below are kept — they cost
    // nothing unread, and the day the frame comes back it comes back whole.
    embed: "Живой сервис — открывается на своём домене",
    // Phone first: the case is about how it feels in the hand, and that is the
    // view the notes describe. The desktop layout is a different arrangement
    // rather than the same one widened — a rail, a column of coffee shops and
    // the map taking the rest — so it earns its own entry.
    viewports: ["phone", "desktop"],
    summary:
      "Первый независимый кофейный гид Москвы, запущенный осенью 2015 года с " +
      "41 точкой и выросший до сотен заведений в четырёх городах. Каждое " +
      "место команда проверяет лично, поэтому карта отвечает не на вопрос " +
      "«где рядом кофе», а «где рядом хороший кофе».",
    facts: [
      { label: "Проект", value: "Кофейная карта" },
      { label: "Города", value: "Москва, Петербург, Казань, Нижний Новгород" },
      { label: "Платформы", value: "Web, iOS, Android" },
      { label: "С", value: "2015 года" },
    ],
    notes: [
      {
        title: "Попасть на карту — пройти отбор, а не подать заявку",
        body:
          "Зерно с оценкой 80+ по протоколу SCA и обжаренное в России, " +
          "профессиональные машины и альтернативные методы, бариста по " +
          "стандартам SCA — и личная проверка вкуса, сервиса и атмосферы " +
          "перед добавлением. Владелец кофейни может заполнить анкету, но " +
          "решает не она. На этом обещании держится всё остальное: список, " +
          "которому доверяют, стоит дороже списка, который полон.",
      },
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
