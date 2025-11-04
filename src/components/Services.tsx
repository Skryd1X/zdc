import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';

export const Services = () => {
  const TG = DT.contacts.telegramUrl || `https://t.me/${DT.contacts.telegram}`;

  const blocks = [DT.services.brands, DT.services.private];

  // --- якорь портфолио: поддержка старых id и смарт-скролл с учётом фикс-хедера
  const findTarget = (href: string): HTMLElement | null => {
    const sels =
      href === '#portfolio'
        ? ['#portfolio', '[data-anchor="portfolio"]', '#media', '#media-grid']
        : [href];
    for (const s of sels) {
      const el = document.querySelector(s) as HTMLElement | null;
      if (el) return el;
    }
    return null;
  };

  const smartScrollTo = (href: string) => {
    const el = findTarget(href);
    if (!el) return;
    const header = document.querySelector('header') as HTMLElement | null;
    const headerH = header?.offsetHeight ?? 80;
    const gap = 24;
    const top = el.getBoundingClientRect().top + window.scrollY - (headerH + gap);
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', href);
  };
  // ---

  return (
    <section id="services" className="section relative overflow-hidden bg-dt-surface">
      {/* Декор-фон */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(60rem 30rem at 85% 15%, rgba(132,106,255,.08), transparent 60%), radial-gradient(40rem 25rem at 10% 80%, rgba(72,199,142,.06), transparent 60%)',
        }}
      />

      <div className="container-dt relative max-w-5xl">
        <div className="mb-6 inline-flex items-center gap-2 text-dt-accent2/90">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Пакеты под задачу
          </span>
        </div>

        <h2 className="text-h2 text-dt-text mb-4 reveal">
          {DT.services.title}
        </h2>
        <p className="text-dt-muted mb-12 max-w-3xl reveal reveal-delay-1">
          Подбираем формат под площадку, тайминг и бюджет. Готовим номер «под ключ» — от идеи и музыки до реквизита и согласований.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {blocks.map((service, i) => (
            <article
              key={i}
              className="
                group relative rounded-2xl border border-dt-line bg-dt-bg/60 p-7
                transition-all duration-300
                hover:-translate-y-1 hover:border-dt-accent/40
                hover:shadow-[0_0_42px_rgba(132,106,255,.18)]
                focus-within:-translate-y-1 focus-within:border-dt-accent/40
                focus-within:shadow-[0_0_42px_rgba(132,106,255,.18)]
              "
              tabIndex={0}
            >
              {i === 0 && (
                <span className="chip-accent absolute -top-3 left-6">
                  Рекомендуем брендам
                </span>
              )}

              <h3 className="text-h3 text-dt-text mb-6 tracking-[0.01em]">
                {service.title}
              </h3>

              <ul className="space-y-4">
                {service.items.map((item: string, j: number) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-5 h-5 mt-0.5 text-dt-accent2 opacity-90 transition-transform group-hover:scale-110"
                      aria-hidden="true"
                    />
                    <span className="text-base text-dt-muted leading-relaxed tracking-[0.01em]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="
                  pointer-events-none absolute inset-x-0 -bottom-px h-12
                  opacity-0 group-hover:opacity-100 transition-opacity
                  bg-gradient-to-t from-dt-accent/15 via-transparent
                  rounded-b-2xl
                "
                aria-hidden="true"
              />
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={TG}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            Связаться в Telegram
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* было href="#media" → теперь корректный якорь + плавный скролл */}
          <button
            type="button"
            onClick={() => smartScrollTo('#portfolio')}
            className="btn-secondary"
            aria-label="Смотреть портфолио"
          >
            Смотреть портфолио
          </button>
        </div>
      </div>
    </section>
  );
};
