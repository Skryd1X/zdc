export const withBase = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.replace(/^\/+/, '')}`;
};

export const portfolioSelectors = ['#portfolio', '[data-anchor="portfolio"]', '#media-grid', '#media'];

export const findAnchorTarget = (href: string): HTMLElement | null => {
  const normalized = href === '#media' ? '#portfolio' : href;
  const selectors = normalized === '#portfolio' ? portfolioSelectors : [normalized];

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement | null;
    if (element) return element;
  }

  return null;
};

export const smartScrollTo = (href: string, offset = 24) => {
  if (!href || href === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#');
    return;
  }

  const target = findAnchorTarget(href);
  if (!target) return;

  const header = document.querySelector('header') as HTMLElement | null;
  const headerHeight = header?.offsetHeight ?? 80;
  const top = target.getBoundingClientRect().top + window.scrollY - (headerHeight + offset);

  window.scrollTo({ top, behavior: 'smooth' });
  history.replaceState(null, '', href === '#media' ? '#portfolio' : href);
};

export const getTelegramUrl = (telegram?: string, telegramUrl?: string) => {
  if (telegramUrl) return telegramUrl;
  if (!telegram) return '#';
  return `https://t.me/${telegram.replace(/^@/, '')}`;
};

export const getInstagramUrl = (instagram?: string, instagramUrl?: string) => {
  if (instagramUrl) return instagramUrl;
  if (!instagram) return '#';
  return `https://instagram.com/${instagram.replace(/^@/, '')}`;
};

export const normalizePhone = (value?: string) => (value || '').replace(/[^\d+]/g, '');
