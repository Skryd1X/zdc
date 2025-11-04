export const DT = {
  hero: {
    kicker: 'Double Touch Show',
    title: 'Создаём эмоции, которые остаются в памяти',
    tags: ['Hip-Hop', 'Experimental', 'Show'],
    cta1: 'Запросить выступление',
    cta2: 'Портфолио',
  },

  about: {
    title: 'О нас',
    paragraphs: [
      'Double Touch — профессиональный танцевальный коллектив из Узбекистана, основанный более 20 лет назад хореографом Сергеем Злотниковым. Мы создаём современные, эффектные шоу, где гости становятся частью действия.',
      'Наш стиль — это сочетание энергии, искусства, современных технологий и живого взаимодействия с публикой. Работаем для брендов, компаний и частных мероприятий, собирая решения под площадку, тайминг и бюджет.',
    ],
  },

  services: {
    title: 'Форматы шоу и пакеты',
    brands: {
      title: 'Для брендов и компаний',
      items: [
        'Танцевальные постановки под бренд',
        'Открытия, промо-акции и корпоративные шоу',
        'Массовые флешмобы и рекламные интеграции',
        'Режиссура и сценарий под событие',
        'Под ключ: реквизит, свет, согласования',
      ],
    },
    private: {
      title: 'Для частных мероприятий',
      items: [
        'Свадьбы, юбилеи, вечеринки',
        'Постановки под вашу музыку',
        'Интерактив с гостями и выходы под ключевые моменты',
        'Спец-номера и миксы под тайминг',
        'Выезд на площадку по договорённости',
      ],
    },
  },

  style: {
    title: 'Наш стиль',
    description:
      'Мы соединяем современную хореографию с элементами хип-хопа, брейка и трюков, создавая живое, мощное и визуально впечатляющее шоу. Каждый номер — это история, прожитая на сцене, где зрители чувствуют себя участниками, а не просто наблюдателями.',
  },

  experience: {
    title: 'Опыт и проекты',
    projects: [
      { name: 'Humo Arena', description: 'Открытия и большие шоу' },
      { name: 'Pepsi Music Fest 2023–2025', description: 'Перформансы на фестивале' },
      { name: 'ТРЦ Узбекистана', description: 'Riviera, Dream Park, Samarqand Darvoza, Compass, Depo Mall' },
      { name: 'Бренды', description: 'Chevrolet, KIA, Chery, Artel, Lukoil, Beeline, Ucell и др.' },
      { name: 'Артисты', description: 'Шохрух, Райхон, Сетора, Жасмин, Нюша, A-Studio и др.' },
      { name: 'Видеопродакшн', description: 'Рекламные интеграции и съёмки' },
    ],
  },

  mediaPr: {
    title: 'Медиа и партнёрства',
    items: [
      { label: 'Instagram', value: '141k подписчиков', description: '@doubletouch_show' },
      { label: 'Pepsi Influencer', value: 'Официальный инфлюэнсер', description: 'Регулярные коллаборации' },
      { label: 'Коллаборации', value: 'Lening, DI Sport', description: 'Спонсорские проекты' },
      { label: 'Медиа', value: 'YouTube, TikTok', description: 'Интеграции и съёмки' },
    ],
  },

  why: {
    title: 'Почему выбирают нас',
    reasons: [
      { title: 'Профессионализм', description: 'Команда режиссёров, хореографов и артистов' },
      { title: 'Креативность', description: 'Уникальные номера и адаптация под бренд' },
      { title: 'Синхронность', description: 'Чёткая координация и единый рисунок движения' },
      { title: 'Энергия', description: 'Живой контакт с залом и эмоция в каждом выходе' },
      { title: 'Гибкость', description: 'Под любые форматы площадок и тайминги' },
      { title: 'Опыт', description: '20 лет работы и сотни реализованных проектов' },
    ],
  },

  /* ===== ПОРТФОЛИО: только перечисляем пути к фото; подписи не нужны ===== */
  portfolio: {
    title: 'Портфолио',
    cta: 'Смотреть наши номера',

    // Кладём файлы в public/media/portfolio/ и просто указываем src:
    items: [
      { src: 'media/portfolio/battle-01.jpg' },
      { src: 'media/portfolio/battle-02.jpg' },
      { src: 'media/portfolio/show-01.jpg' },
      { src: 'media/portfolio/show-02.jpg' },
      { src: 'media/portfolio/training-01.jpg' },
      // шестая ячейка зарезервирована под видео (см. ниже)
    ],

    // Видео в правой ячейке (вариант MP4; постер — right-thumb.jpg)
    rightVideo: {
      type: 'mp4',
      src: 'media/portfolio/right.mp4',        // положи сюда свой mp4
      poster: 'media/portfolio/right-thumb.jpg',
      title: 'Backstage',
    },

    // Если захочешь YouTube вместо mp4 — просто замени блок выше на:
    // rightVideo: { type: 'youtube', id: 'ВАШ_YOUTUBE_ID', title: 'Promo' },
  },

  quote:
    '«Каждое выступление для нас — это не просто номер а момент прожитый вместе с вами»',

  contacts: {
    title: 'Связь и адрес',
    phone: '+998 99 365 44 32',
    telegram: 'doubletouchshow1',
    telegramUrl: 'https://t.me/doubletouchshow1',
    instagram: 'doubletouch_show',
    instagramUrl: 'https://www.instagram.com/doubletouch_show/',
    email: 'doubletouchshow1@gmail.com',
    address: 'Zlotnikov Dance Center, Ташкент',
    mapEmbed: 'https://yandex.uz/profile/-/CLrsBRO8',
  },

  footer: {
    copyright: 'Zlotnikov Dance Center × Double Touch Show',
    year: new Date().getFullYear(),
  },
};
