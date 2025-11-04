import { useEffect, useRef } from 'react';
import { DT } from '../content/doubleTouch.ru';

export const Why = () => {
  // Параллакс фон (деликатный)
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const p = y * 0.1;
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0, ${p}px, 0) scale(1.05)`;
        }
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const base = import.meta.env.BASE_URL || '/';
  const bgUrl = `${base}media/sections/why.jpg`; // опционально

  return (
    <section id="why" className="section relative overflow-hidden bg-dt-surface">
      {/* Фон: размытая фотка + мягкие пятна */}
      <div className="absolute inset-0 -z-10">
        <img
          ref={bgRef}
          src={bgUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-20 blur-[2px] will-change-transform"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-dt-surface/70" />
        <div className="pointer-events-none absolute -top-16 -right-24 h-72 w-72 rounded-full bg-dt-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-dt-accent2/15 blur-3xl" />
      </div>

      <div className="container-dt max-w-5xl">
        <header className="mb-10 md:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dt-accent2/90 mb-2">
            Why Double Touch
          </p>
          <h2 className="text-h2 text-dt-text reveal">{DT.why.title}</h2>
          <div className="mt-3 h-[3px] w-20 rounded-full bg-gradient-to-r from-dt-accent to-dt-accent2 opacity-80" />
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DT.why.reasons.map(
            (reason: { title: string; description: string }, i: number) => (
              <article
                key={i}
                tabIndex={0}
                role="article"
                className="
                  group relative rounded-xl border border-dt-line/80 bg-dt-surface/70 p-6
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:border-dt-accent/50
                  hover:shadow-[0_0_34px_rgba(132,106,255,.22)]
                  focus:outline-none focus:ring-2 focus:ring-dt-accent/40 focus:ring-offset-0
                  focus:-translate-y-0.5
                  reveal
                "
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* внутренняя подсветка при hover/focus */}
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-dt-accent/10 via-transparent to-dt-accent2/10" />

                <h4 className="relative z-[1] text-[1.05rem] md:text-[1.15rem] font-extrabold tracking-[0.02em] text-dt-text mb-2">
                  {reason.title}
                </h4>
                <p className="relative z-[1] text-dt-text/84 text-[0.98rem] leading-relaxed tracking-[0.01em]">
                  {reason.description}
                </p>
              </article>
            )
          )}
        </div>

        <div className="h-divider mt-16" />
      </div>
    </section>
  );
};
