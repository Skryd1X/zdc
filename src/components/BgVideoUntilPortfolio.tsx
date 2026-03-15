// src/components/BgVideoUntilPortfolio.tsx
import { useEffect, useRef, useState } from 'react';

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function BgVideoUntilPortfolio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
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
      if (!portfolio || !dimRef.current) return;

      const top = portfolio.getBoundingClientRect().top + window.scrollY;

      // Чуть раньше начинаем темнить, чтобы текст читался
      const maxY = top - window.innerHeight * 0.45;
      const y = window.scrollY;

      // Было 0.30→0.60 — слишком темно. Делаем мягче: 0.22 → 0.42
      const t = clamp(y / Math.max(1, maxY), 0, 1);
      const opacity = 0.22 + t * 0.20; // 0.22–0.42
      dimRef.current.style.opacity = String(opacity);

      // как только дошли до портфолио — убираем именно видео (контент остаётся)
      const beyond = y + 1 > top;
      (dimRef.current.parentElement as HTMLDivElement).style.opacity = beyond ? '0' : '1';
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

      {/* мягкий блюр */}
      <div ref={blurRef} className="absolute inset-0" style={{ backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }} />
      {/* динамическое затемнение — стало светлее */}
      <div ref={dimRef} className="absolute inset-0 bg-dt-bg transition-opacity duration-150" style={{ opacity: 0.22 }} />
      {/* лёгкий градиент вниз, чтобы низ не «пропадал» */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dt-bg/55" />
    </div>
  );
}
