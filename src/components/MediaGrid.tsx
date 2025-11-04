import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';
import VideoPlayer from './VideoPlayer';

type RightVideo =
  | { type: 'mp4'; src: string; poster?: string }
  | { type: 'youtube'; id: string; poster?: string };

const FALLBACK = [
  '/media/portfolio/1.jpg',
  '/media/portfolio/2.jpg',
  '/media/portfolio/3.jpg',
  '/media/portfolio/4.jpg',
  '/media/portfolio/5.jpg',
  '/media/portfolio/6.jpg',
];

const baseResolve = (p?: string) => {
  if (!p) return '';
  if (/^https?:\/\//i.test(p)) return p;
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${p.replace(/^\/+/, '')}`;
};

// "1.jpg" → "media/portfolio/1.jpg", "portfolio/1.jpg" → "media/portfolio/1.jpg", URL/абсолютные не трогаем
const normalizeSrc = (src: string | undefined, i: number) => {
  let s = (src || '').trim();
  if (!s) s = FALLBACK[i];
  else if (!/^https?:\/\//i.test(s)) {
    if (!s.startsWith('/')) {
      if (!s.includes('/')) s = `media/portfolio/${s}`;
    }
  }
  return baseResolve(s);
};

const ytId = (idOrUrl: string) => {
  try {
    if (!idOrUrl.includes('http')) return idOrUrl;
    const u = new URL(idOrUrl);
    if (u.hostname.includes('youtu.be')) return u.pathname.replace('/', '');
    if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2] || '';
    return u.searchParams.get('v') || '';
  } catch {
    return '';
  }
};

const ytEmbed = (idOrUrl: string) => {
  const id = ytId(idOrUrl);
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&color=white`
    : '';
};

export const MediaGrid = () => {
  // 6 фото из контента, добиваем до 6 паддингом
  const raw = (DT.portfolio?.items || []) as Array<{ src: string }>;
  const photos = Array.from({ length: 6 }, (_, i) => normalizeSrc(raw[i]?.src, i));
  const rightVideo = DT.portfolio?.rightVideo as RightVideo | undefined;

  // предзагрузка, чтобы лайтбокс не «пусто»
  useEffect(() => {
    photos.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [photos]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [headerH, setHeaderH] = useState(80);

  // учитываем реальную высоту header, пересчитываем при ресайзе
  useEffect(() => {
    const measure = () => {
      const h = (document.querySelector('header') as HTMLElement | null)?.offsetHeight ?? 80;
      setHeaderH(h);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // клавиатура + блокировка скролла, когда открыт лайтбокс
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight')
        setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length));
      if (e.key === 'ArrowLeft')
        setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, photos.length]);

  // YouTube
  const [ytPlay, setYtPlay] = useState(false);
  const yt = useMemo(() => {
    if (!rightVideo || rightVideo.type !== 'youtube') return null;
    const id = ytId(rightVideo.id);
    const poster = baseResolve(rightVideo.poster) || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
    const embed = id ? ytEmbed(id) : '';
    return { poster, embed };
  }, [rightVideo]);

  return (
    <section id="portfolio" data-anchor="portfolio" className="section bg-dt-surface">
      <div className="container-dt max-w-5xl">
        <h2 className="text-h2 text-dt-text mb-12 reveal">{DT.portfolio.title}</h2>

        {/* 3×2 фото */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 reveal reveal-delay-1">
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setLightboxIndex(i); setImgLoaded(false); }}
              aria-label={`Открыть фото ${i + 1}`}
              className="relative aspect-square media-frame group cursor-pointer"
            >
              <img
                src={src}
                alt=""
                className="media-img"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const fb = baseResolve(FALLBACK[i]);
                  if (e.currentTarget.src !== fb) e.currentTarget.src = fb;
                }}
              />
            </button>
          ))}
        </div>

        {/* Видео 16:9 ниже, центр, ~70% ширины */}
        {rightVideo && (
          <div className="mt-10 md:mt-12 reveal reveal-delay-2">
            <div className="mx-auto w-full md:w-[70%]">
              {rightVideo.type === 'mp4' ? (
                <VideoPlayer
                  className="media-frame"
                  src={baseResolve(rightVideo.src)}
                  poster={rightVideo.poster ? baseResolve(rightVideo.poster) : undefined}
                  accentHex="#0DECDB"
                />
              ) : yt ? (
                ytPlay && yt.embed ? (
                  <div className="relative w-full aspect-video media-frame">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      title="portfolio-video"
                      src={yt.embed}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setYtPlay(true)}
                    className="relative w-full aspect-video media-frame group cursor-pointer"
                    aria-label="Смотреть видео"
                  >
                    {yt.poster && <img src={yt.poster} alt="" className="media-img" loading="lazy" decoding="async" />}
                    <span className="media-overlay" />
                    <span className="media-play">
                      <span className="media-play__btn">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  </button>
                )
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Лайтбокс */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-[1px] flex items-center justify-center px-4"
          onClick={() => setLightboxIndex(null)}
          style={{
            paddingTop: `calc(${headerH + 16}px + env(safe-area-inset-top, 0px))`,
            paddingBottom: '16px',
          }}
        >
          <div
            className="relative select-none"
            onClick={(e) => e.stopPropagation()}
            style={{
              // гарантированная «коробка», чтобы стрелки/иконки не съезжали, пока грузится изображение
              minWidth: '40vw',
              minHeight: '40vh',
            }}
          >
            <img
              key={photos[lightboxIndex]}
              src={photos[lightboxIndex]}
              alt=""
              className="object-contain"
              style={{
                maxWidth: 'min(90vw, 1600px)',
                maxHeight: `calc(100vh - ${headerH + 48}px)`, // не залезает под хедер
              }}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => {
                const fb = baseResolve(FALLBACK[lightboxIndex]);
                if ((e.currentTarget as HTMLImageElement).src !== fb) {
                  (e.currentTarget as HTMLImageElement).src = fb;
                }
                setImgLoaded(true);
              }}
            />

            {/* Close */}
            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/55 text-white ring-1 ring-white/25"
              onClick={() => setLightboxIndex(null)}
              aria-label="Закрыть"
              title="Закрыть"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() =>
                setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
              }
              aria-label="Предыдущее"
              title="Предыдущее"
            >
              ‹
            </button>

            {/* Next */}
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length))}
              aria-label="Следующее"
              title="Следующее"
            >
              ›
            </button>

            {/* Counter */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-dt-muted">
              {lightboxIndex + 1} / {photos.length}
            </div>

            {/* Лоадер (пока img не прогружена) */}
            {!imgLoaded && (
              <div className="absolute inset-0 grid place-items-center text-dt-muted">Загрузка…</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
