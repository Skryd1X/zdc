import { useEffect, useRef, useState } from 'react';
import { Instagram, Mail, Menu, Phone, Send, X } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';
import { getInstagramUrl, getTelegramUrl, normalizePhone, smartScrollTo } from '../utils/site';

const NAV_LINKS = [
  { href: '#about', label: 'О нас' },
  { href: '#services', label: 'Направления' },
  { href: '#experience', label: 'Опыт' },
  { href: '#portfolio', label: 'Портфолио' },
  { href: '#contacts', label: 'Контакты' },
];

export const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const telegram = getTelegramUrl(DT.contacts.telegram, DT.contacts.telegramUrl);
  const instagram = getInstagramUrl(DT.contacts.instagram, DT.contacts.instagramUrl);
  const phoneTel = normalizePhone(DT.contacts.phone);
  const mailHref = `mailto:${DT.contacts.email}`;
  const base = import.meta.env.BASE_URL || '/';
  const logoSrc = `${base}logoDT1.png`;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let frame = 0;

    const updateActiveLink = () => {
      const headerHeight = headerRef.current?.offsetHeight ?? 84;
      const currentY = window.scrollY + headerHeight + 48;

      let current: string | null = null;
      for (const link of NAV_LINKS) {
        const element = document.querySelector(link.href) as HTMLElement | null;
        if (!element) continue;
        const top = element.getBoundingClientRect().top + window.scrollY;
        if (top <= currentY) current = link.href;
      }

      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        updateActiveLink();
        frame = 0;
      });
    };

    updateActiveLink();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const socials = [
    { label: 'Telegram', href: telegram, Icon: Send, external: true },
    { label: 'Instagram', href: instagram, Icon: Instagram, external: true },
    { label: 'Позвонить', href: `tel:${phoneTel}`, Icon: Phone, external: false },
    { label: 'Email', href: mailHref, Icon: Mail, external: false },
  ];

  const handleNav = (href: string) => {
    smartScrollTo(href);
    setIsMobileMenuOpen(false);
    setActive(href);
  };

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-black/72 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container-dt">
        <div className="flex h-20 items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => smartScrollTo('#')}
            className="group flex items-center gap-3"
            aria-label="На главную"
          >
            <span className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <img src={logoSrc} alt="Double Touch Show" className="h-7 w-auto" />
              <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,0,140,0.18),transparent_65%)]" />
            </span>
            <span className="hidden lg:block leading-none">
              <span className="block font-heading text-[11px] uppercase tracking-[0.38em] text-white/45">Double Touch</span>
              <span className="block font-display text-2xl leading-none tracking-[0.12em] text-white">SHOW</span>
            </span>
          </button>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Главная навигация">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href;
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNav(link.href)}
                  className={`group nav-link relative text-sm font-heading uppercase tracking-[0.22em] transition ${
                    isActive ? 'text-white' : 'text-white/68 hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-dt-accent via-fuchsia-400 to-dt-accent2 transition-all duration-300 ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {socials.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/72 transition hover:border-dt-accent/50 hover:text-white hover:shadow-[0_0_20px_rgba(255,0,140,0.22)]"
                aria-label={label}
                title={label}
              >
                <Icon size={16} />
              </a>
            ))}

            <button type="button" onClick={() => handleNav('#contacts')} className="btn-primary ml-2">
              Заказать шоу
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden overflow-hidden border-t border-white/10 bg-black/92 backdrop-blur-xl transition-[max-height,opacity] duration-300 ${
          isMobileMenuOpen ? 'max-h-[720px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-dt flex flex-col gap-6 py-6">
          <nav className="flex flex-col gap-4" aria-label="Мобильная навигация">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNav(link.href)}
                className="text-left font-heading text-lg uppercase tracking-[0.18em] text-white/84"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="grid grid-cols-2 gap-3">
            {socials.map(({ label, href, Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/84"
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>

          <button type="button" onClick={() => handleNav('#contacts')} className="btn-primary w-full justify-center">
            Запросить выступление
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
