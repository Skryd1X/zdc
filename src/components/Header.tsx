import { useEffect, useRef, useState } from 'react';
import { Menu, X, Send, Instagram, Phone as PhoneIcon, Mail as MailIcon } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';

// якоря навигации (только то, что реально есть в меню)
const NAV_LINKS = [
  { href: '#about', label: 'О нас' },
  { href: '#services', label: 'Услуги' },
  { href: '#experience', label: 'Опыт' },
  { href: '#portfolio', label: 'Портфолио' },
  { href: '#contacts', label: 'Контакты' },
];

// алиасы (старые id) — #media принудительно ведёт на #portfolio
const ANCHOR_ALIASES: Record<string, string[]> = {
  '#portfolio': ['#portfolio', '[data-anchor="portfolio"]', '#media-grid', '#media'],
  '#media': ['#portfolio', '[data-anchor="portfolio"]', '#media-grid', '#media'], // редирект
};

const targetsFor = (href: string) => ANCHOR_ALIASES[href] ?? [href];
const findEl = (href: string): HTMLElement | null => {
  for (const sel of targetsFor(href)) {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (el) return el;
  }
  return null;
};

export const Header = () => {
  const headerRef = useRef<HTMLElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // ВАЖНО: по умолчанию ничего не активно (чтобы на hero не подсвечивалось "О нас")
  const [active, setActive] = useState<string | null>(null);

  // ссылки/контакты
  const TG = DT.contacts.telegramUrl || `https://t.me/${DT.contacts.telegram}`;
  const IG = DT.contacts.instagramUrl || `https://instagram.com/${DT.contacts.instagram}`;
  const phoneRaw = DT.contacts.phone || '';
  const phoneTel = phoneRaw.replace(/[^\d+]/g, '');
  const mailHref = `mailto:${DT.contacts.email}`;

  const SOCIALS = [
    { label: 'Telegram', href: TG, external: true, Icon: Send },
    { label: 'Instagram', href: IG, external: true, Icon: Instagram },
    { label: 'Позвонить', href: `tel:${phoneTel}`, external: false, Icon: PhoneIcon },
    { label: 'Email', href: mailHref, external: false, Icon: MailIcon },
  ] as const;

  // фон/тень по скроллу
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // аккуратный scroll-spy: активна последняя пройденная меню-секция; если ни одной — active:null
  useEffect(() => {
    let raf = 0;

    const updateActive = () => {
      const headerH = headerRef.current?.offsetHeight ?? 80;
      // Точку сравнения берём чуть ниже хедера
      const y = window.scrollY + headerH + 40;

      let current: string | null = null;
      for (const { href } of NAV_LINKS) {
        const el = findEl(href);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) {
          current = href; // последняя пройденная секция
        } else {
          // как только встретили секцию, которая ещё не началась — дальше можно не проверять
          break;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        updateActive();
        raf = 0;
      });
    };

    // первичный расчёт
    updateActive();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    window.addEventListener('hashchange', onScroll);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('hashchange', onScroll);
    };
  }, []);

  // ESC + блок скролла боди для моб. меню
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMobileMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // смарт-скролл c учётом фикс-хедера
  const scrollToSection = (rawHref: string) => {
    const href = rawHref === '#media' ? '#portfolio' : rawHref;

    if (!href || href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', '#');
      setIsMobileMenuOpen(false);
      // на самом верху ничего не подсвечиваем
      setActive(null);
      return;
    }
    const el = findEl(href);
    if (!el) return;

    const headerH = headerRef.current?.offsetHeight ?? 80;
    const extra = 24;
    const top = el.getBoundingClientRect().top + window.scrollY - (headerH + extra);

    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', href);
    setActive(href);
    setIsMobileMenuOpen(false);
  };

  // обработка прямых переходов по хэшу на валидные меню-секции
  useEffect(() => {
    const go = () => {
      const h = location.hash;
      const target = h === '#media' ? '#portfolio' : h;
      if (target && NAV_LINKS.some(l => l.href === target)) {
        setTimeout(() => scrollToSection(target), 0);
      }
    };
    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, []);

  const base = import.meta.env.BASE_URL || '/';
  const logoSrc = `${base}logoDT1.png`;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-dt-bg/85 backdrop-blur-md border-b border-dt-line shadow-[0_8px_24px_-12px_rgba(0,0,0,.45)]'
          : 'bg-transparent'
      }`}
      role="banner"
    >
      <div className="container-dt">
        <div className="flex items-center justify-between h-20">
          {/* ЛОГО */}
          <button
            type="button"
            onClick={() => scrollToSection('#')}
            className="flex items-center gap-2"
            aria-label="На главную"
            title="Double Touch Show — на главную"
          >
            <img
              src={logoSrc}
              alt="Double Touch Show"
              className="h-8 w-auto select-none"
              width={128}
              height={32}
              loading="eager"
              decoding="async"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="sr-only">Double Touch Show</span>
          </button>

          {/* Навигация */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10" aria-label="Главная навигация">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`
                    relative py-2 text-[15px] md:text-[16px] lg:text-[17px] font-semibold tracking-wide transition-colors
                    ${isActive ? 'text-dt-text' : 'text-dt-muted hover:text-dt-text'}
                    after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px]
                    after:origin-left after:scale-x-0 after:bg-dt-accent2 after:transition-transform after:content-['']
                    ${isActive ? 'after:scale-x-100' : 'hover:after:scale-x-100'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Иконки соц/контактов + CTA */}
          <div className="hidden md:flex items-center gap-2">
            {SOCIALS.map(({ label, href, external, Icon }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={label}
                className="p-2 rounded-lg border border-dt-line text-dt-muted hover:text-dt-accent hover:border-dt-accent transition-colors"
                title={label}
              >
                <Icon size={18} />
              </a>
            ))}
            <a
              href={TG}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 btn-primary text-[15px] px-5 py-2.5"
            >
              Запросить выступление
            </a>
          </div>

          {/* Бургер */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(v => !v)}
            className="md:hidden p-2 text-dt-muted hover:text-dt-text"
            aria-label="Меню"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-dt-surface border-t border-dt-line">
          <nav className="container-dt py-6 flex flex-col gap-4" aria-label="Мобильная навигация">
            {NAV_LINKS.map((link) => (
              <button
                type="button"
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className={`text-left font-semibold text-[17px] ${
                  active === link.href ? 'text-dt-text' : 'text-dt-muted hover:text-dt-accent'
                }`}
                aria-current={active === link.href ? 'page' : undefined}
              >
                {link.label}
              </button>
            ))}

            {/* Иконки и CTA в моб. меню */}
            <div className="flex items-center gap-3 pt-2">
              {SOCIALS.map(({ label, href, external, Icon }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={label}
                  className="p-2 rounded-lg border border-dt-line text-dt-muted hover:text-dt-accent hover:border-dt-accent transition-colors"
                  title={label}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>

            <a
              href={TG}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 btn-primary w-full text-center text-[17px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Запросить выступление
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
