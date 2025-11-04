import { useEffect, useRef } from 'react';
import { DT } from '../content/doubleTouch.ru';

export const StyleBlock = () => {
  // Параллакс для фонового изображения (с учётом reduce motion)
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const p = y * 0.12; // деликатный сдвиг
        if (bgRef.current) {
          bgRef.current.style.transform = `translate3d(0, ${p}px, 0) scale(1.06)`;
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
  const bgUrl = `${base}media/sections/style.jpg`; // положи файл в /public/media/sections/style.jpg

  return (
    <section
      id="style"
      data-section="style"
      aria-labelledby="style-heading"
      className="section relative overflow-hidden bg-dt-bg scroll-mt-24 md:scroll-mt-28"
    >
      {/* Фон: размытая фотка + вуали и мягкие пятна */}
      <div className="absolute inset-0 -z-10">
        <img
          ref={bgRef}
          src={bgUrl}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="h-full w-full object-cover opacity-25 blur-[2px] will-change-transform"
          loading="lazy"
          decoding="async"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-dt-bg/70" />
        <div className="pointer-events-none absolute -top-16 -right-24 h-80 w-80 rounded-full bg-dt-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-dt-accent2/20 blur-3xl" />
      </div>

      <div className="container-dt max-w-5xl">
        <header className="mb-8 md:mb-10 reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dt-accent2/90 mb-2">
            Style DNA
          </p>
          <h2 id="style-heading" className="text-h2 text-dt-text">
            {DT.style.title}
          </h2>
          <div className="mt-3 h-[3px] w-20 rounded-full bg-gradient-to-r from-dt-accent to-dt-accent2 opacity-80" />
        </header>

        <article
          className="
            group relative rounded-2xl border border-dt-line/80 bg-dt-surface/60
            backdrop-blur-md p-6 md:p-8 transition-all duration-300 reveal reveal-delay-1
            hover:-translate-y-0.5 hover:border-dt-accent/50
            hover:shadow-[0_0_40px_rgba(132,106,255,.20)]
          "
        >
          {/* внутренняя подсветка при hover */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-dt-accent/10 via-transparent to-dt-accent2/10" />

          <p className="text-[1.05rem] md:text-lg leading-relaxed tracking-[0.01em] text-dt-text/85">
            {DT.style.description}
          </p>

          {/* Мини-лейблы (эмоции/ритм/удар) */}
          <div className="mt-5 flex flex-wrap gap-2">
            {['Energy', 'Flow', 'Impact', 'Rhythm'].map((t) => (
              <span key={t} className="chip-accent">{t}</span>
            ))}
          </div>
        </article>

        <div className="h-divider mt-14 reveal reveal-delay-2" />
      </div>
    </section>
  );
};
