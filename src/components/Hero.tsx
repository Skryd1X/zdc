import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';

export const Hero = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const blobTopRef = useRef<HTMLDivElement>(null);
  const blobBotRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Параллакс
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY, p = y * 0.3;
        if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${p * 0.2}px, 0)`;
        if (blobTopRef.current) blobTopRef.current.style.transform = `translate3d(0, ${p}px, 0)`;
        if (blobBotRef.current) blobBotRef.current.style.transform = `translate3d(0, ${-p * 0.5}px, 0)`;
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

  // Автоплей по видимости
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? tryPlay() : v.pause()),
      { threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const findTarget = (href: string): HTMLElement | null => {
    const sels = href === '#portfolio'
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
    const top = el.getBoundingClientRect().top + window.scrollY - ((header?.offsetHeight ?? 80) + 24);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const TG   = DT.contacts.telegramUrl || `https://t.me/${DT.contacts.telegram}`;
  const base = import.meta.env.BASE_URL || '/';
  const logo = `${base}logoDT1.png`;
  const VIDEO_WEBM = `${base}media/videos/hero.webm`;
  const VIDEO_MP4  = `${base}media/videos/hero.mp4`;

  return (
    <section className="relative min-h-screen w-full overflow-hidden pt-20">
      {/* ФОН-ВИДЕО */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-video h-full w-full object-cover"
          autoPlay muted loop playsInline preload="metadata"
        >
          <source src={VIDEO_WEBM} type="video/webm" />
          <source src={VIDEO_MP4}  type="video/mp4" />
        </video>
        {/* мягкие оверлеи */}
        <div className="absolute inset-0" style={{ backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }} />
        <div className="absolute inset-0 bg-dt-bg/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-dt-surface/30 via-transparent to-dt-bg" />
      </div>

      {/* мягкие пятна */}
      <div ref={blobTopRef} className="pointer-events-none absolute top-0 right-20 w-96 h-96 rounded-full bg-dt-accent/10 blur-3xl z-0" />
      <div ref={blobBotRef} className="pointer-events-none absolute bottom-0 left-10 w-72 h-72 rounded-full bg-dt-accent2/10 blur-3xl z-0" />

      {/* контент */}
      <div className="relative z-10 h-screen container-dt flex flex-col justify-center">
        <div className="max-w-3xl space-y-8">
          <div className="space-y-3 group relative">
            {/* kicker скрывается при hover на блоке заголовка */}
            <div className="hero-kicker text-sm font-semibold text-dt-accent2 uppercase tracking-widest">
              {DT.hero.kicker}
            </div>

            {/* Заголовок: белая заливка + единый чёрный контур + мягкий бирюзовый glow; масштаб +5% при hover */}
            <div className="relative w-fit isolate">
              {/* лого: всплывает при hover */}
              <img
                src={logo}
                alt="Double Touch"
                aria-hidden="true"
                draggable="false"
                className="pointer-events-none select-none absolute -top-3 -left-4 md:-top-4 md:-left-6 lg:-top-5 lg:-left-8 w-16 md:w-24 lg:w-28 opacity-0 translate-y-2 -rotate-6 -z-10 transition-all ease-out group-hover:opacity-100 group-hover:-translate-y-12 group-hover:-rotate-12"
                style={{ filter:'drop-shadow(0 0 28px rgba(132,106,255,.65))' }}
              />

              <h1 className="hero-title relative w-fit">
                <span className="hero-title__fill text-h1">{DT.hero.title}</span>
                <span aria-hidden className="hero-title__stroke text-h1">{DT.hero.title}</span>
                <span aria-hidden className="hero-title__glow text-h1">{DT.hero.title}</span>
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {DT.hero.tags.map((t: string, i: number) => <span key={i} className="chip-accent">{t}</span>)}
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <a href={TG} target="_blank" rel="noopener noreferrer" className="btn-primary">
              {DT.hero.cta1 ?? 'Написать в Telegram'}
            </a>
            <button type="button" onClick={() => smartScrollTo('#portfolio')} className="btn-secondary">
              {DT.hero.cta2 ?? 'Портфолио'}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => smartScrollTo('#about')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-dt-muted hover:text-dt-accent transition-colors"
          aria-label="К разделу «О нас»"
        >
          <ChevronDown size={28} />
        </button>
      </div>

      {/* даже при reduce-motion видео не скрываем */}
      <style>{`
        @media (prefers-reduced-motion: reduce){
          .hero-video{ display:block; }
        }
      `}</style>
    </section>
  );
};
