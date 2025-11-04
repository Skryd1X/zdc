// src/components/Footer.tsx
import type React from 'react';
import { DT } from '../content/doubleTouch.ru';

const ANCHOR_ALIASES: Record<string, string[]> = {
  '#portfolio': ['#portfolio', '[data-anchor="portfolio"]', '#media', '#media-grid'],
};

const targetsFor = (href: string) => ANCHOR_ALIASES[href] ?? [href];
const findEl = (href: string): HTMLElement | null => {
  for (const sel of targetsFor(href)) {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el) return el;
  }
  return null;
};

export const Footer = () => {
  const TG = DT.contacts.telegramUrl || `https://t.me/${DT.contacts.telegram}`;
  const IG = DT.contacts.instagramUrl || `https://instagram.com/${DT.contacts.instagram}`;
  const base = import.meta.env.BASE_URL || '/';
  const logoSrc = `${base}logoDT1.png`;

  // плавный скролл с учётом высоты фикс-хедера + алиасы
  const smartScrollTo = (href: string) => {
    const el = findEl(href);
    if (!el) return;
    const header = document.querySelector('header') as HTMLElement | null;
    const headerH = header?.offsetHeight ?? 80;
    const gap = 24;
    const top = el.getBoundingClientRect().top + window.scrollY - (headerH + gap);
    window.scrollTo({ top, behavior: 'smooth' });
    // всегда показываем канонический якорь
    history.replaceState(null, '', href);
  };

  const scrollTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', '#');
  };

  return (
    <footer className="border-t border-dt-line bg-dt-surface/60" role="contentinfo">
      <div className="container-dt py-12 md:py-14">
        {/* верхняя сетка */}
        <div className="grid gap-10 md:grid-cols-3 items-start">
          {/* ЛОГО + описание */}
          <div className="space-y-4">
            <a href="#" onClick={scrollTop} className="inline-flex" aria-label="На главную">
              {/* логотип крупнее (≈2× от хедера) */}
              <img
                src={logoSrc}
                alt="Double Touch Show"
                className="h-16 md:h-24 w-auto select-none"
                width={200}
                height={96}
                loading="lazy"
                decoding="async"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            </a>
            <p className="text-dt-muted max-w-sm">
              Double Touch Show — танцевальный коллектив Zlotnikov Dance Center
            </p>
          </div>

          {/* Навигация */}
          <nav className="space-y-3" aria-label="Навигация футера">
            <div className="text-sm font-semibold text-dt-muted/80 uppercase tracking-wider">Навигация</div>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="link-accent"
                  onClick={(e) => { e.preventDefault(); smartScrollTo('#about'); }}
                >
                  О нас
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="link-accent"
                  onClick={(e) => { e.preventDefault(); smartScrollTo('#services'); }}
                >
                  Услуги
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  className="link-accent"
                  onClick={(e) => { e.preventDefault(); smartScrollTo('#experience'); }}
                >
                  Опыт
                </a>
              </li>
              <li>
                {/* было #media → теперь канонический #portfolio + алиасы в smartScrollTo */}
                <a
                  href="#portfolio"
                  className="link-accent"
                  onClick={(e) => { e.preventDefault(); smartScrollTo('#portfolio'); }}
                >
                  Портфолио
                </a>
              </li>
              <li>
                <a
                  href="#contacts"
                  className="link-accent"
                  onClick={(e) => { e.preventDefault(); smartScrollTo('#contacts'); }}
                >
                  Контакты
                </a>
              </li>
            </ul>
          </nav>

          {/* Контакты */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-dt-muted/80 uppercase tracking-wider">Контакты</div>
            <ul className="space-y-2">
              <li><a href={TG} target="_blank" rel="noopener noreferrer" className="link-accent">Telegram</a></li>
              <li><a href={IG} target="_blank" rel="noopener noreferrer" className="link-accent">Instagram</a></li>
              <li><a href={`tel:${DT.contacts.phone}`} className="link-accent">{DT.contacts.phone}</a></li>
            </ul>
          </div>
        </div>

        {/* низ футера */}
        <div className="mt-10 md:mt-12 flex items-center justify-between gap-4">
          <p className="text-dt-muted text-sm">
            © {DT.footer.year} Zlotnikov Dance Center × Double Touch Show
          </p>
          <a
            href="#"
            onClick={scrollTop}
            className="text-sm text-dt-muted hover:text-dt-accent inline-flex items-center gap-1"
          >
            Наверх <span aria-hidden>↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
