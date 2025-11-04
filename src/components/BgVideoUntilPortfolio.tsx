// src/components/BgVideoUntilPortfolio.tsx
import { useEffect, useRef, useState } from 'react';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function BgVideoUntilPortfolio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();

    const onScroll = () => {
      const portfolio = document.querySelector('#portfolio,[data-anchor="portfolio"]') as HTMLElement | null;
      if (!portfolio || !overlayRef.current) return;

      const top = portfolio.getBoundingClientRect().top + window.scrollY;
      const maxY = top - window.innerHeight * 0.4; // начинаем сильнее темнить задолго до портфолио
      const y = window.scrollY;

      // 0.30 (вверху) → 0.60 (перед портфолио)
      const t = clamp(y / Math.max(1, maxY), 0, 1);
      const opacity = 0.30 + t * 0.30;
      overlayRef.current.style.opacity = String(opacity);

      // как только дошли до портфолио — скрываем фон (и ставим паузу)
      const beyond = y + 1 > top;
      (overlayRef.current.parentElement as HTMLDivElement).style.opacity = beyond ? '0' : '1';
      if (beyond) v.pause(); else tryPlay();
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const base = import.meta.env.BASE_URL || '/';
  const WEBM = `${base}media/videos/hero.webm`;
  const MP4  = `${base}media/videos/hero.mp4`;

  // фиксированный слой, не перекрывает клики
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-300"
      aria-hidden="true"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={WEBM} type="video/webm" />
        <source src={MP4}  type="video/mp4" />
      </video>

      {/* блюр + динамическое затемнение */}
      <div className="absolute inset-0" style={{ backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }} />
      <div ref={overlayRef} className="absolute inset-0 bg-dt-bg transition-opacity duration-150" style={{ opacity: 0.30 }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dt-bg/60" />
    </div>
  );
}
