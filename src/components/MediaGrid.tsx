// src/components/MediaGrid.tsx
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

// "1.jpg" → "media/portfolio/1.jpg"
const normalizeSrc = (src: string | undefined) => {
  let s = (src || '').trim();
  if (!s) return '';
  if (!/^https?:\/\//i.test(s)) {
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
  const title = DT?.portfolio?.title || 'Портфолио';

  const renderTitle = (s: string) => {
    const src = (s || '').trim();
    if (!src) return null;

    const keysRaw = (DT?.portfolio as any)?.keys as string[] | string | undefined;
    const keys = Array.isArray(keysRaw)
      ? keysRaw
      : typeof keysRaw === 'string'
      ? [keysRaw]
      : [];

    const fallback =
      !keys.length && src.split(/\s+/).length > 1
        ? src.split(/\s+/)[src.split(/\s+/).length - 1]
        : undefined;
    const set = new Set(
      [...keys, ...(fallback ? [fallback] : [])].map((t) => t.toLowerCase()),
    );

    const parts =
      src.match(/([\p{L}\p{N}\-]+|[^\p{L}\p{N}\-]+)/gu) || [src];

    return parts.map((chunk, i) => {
      const isWord = /[\p{L}\p{N}\-]/u.test(chunk);
      if (!isWord) return <span key={i}>{chunk}</span>;
      const hit = set.has(chunk.toLowerCase());
      return (
        <span key={i} className={hit ? 'h-key' : undefined}>
          {chunk}
        </span>
      );
    });
  };

  // Фото
  const allPhotos: string[] = useMemo(() => {
    const raw = Array.from(DT.portfolio?.items || []) as Array<{ src?: string }>; 
    const normalized = raw.map((it) => normalizeSrc(it?.src)).filter(Boolean);
    const fallback = FALLBACK.map((s) => baseResolve(s));
    return normalized.length ? normalized : fallback;
  }, []);

  const rightVideo = DT.portfolio?.rightVideo as RightVideo | undefined;

  const totalPhotos = allPhotos.length;

  const paddedPhotos = useMemo(() => {
    const arr = allPhotos.slice();
    while (arr.length < 6) {
      const fb = baseResolve(FALLBACK[arr.length % FALLBACK.length]);
      arr.push(fb);
    }
    return arr;
  }, [allPhotos]);

  const [visibleCount, setVisibleCount] = useState(6);
  const photos = useMemo(
    () =>
      paddedPhotos.slice(
        0,
        Math.min(visibleCount, paddedPhotos.length),
      ),
    [paddedPhotos, visibleCount],
  );

  useEffect(() => {
    const toPreload = paddedPhotos.slice(
      0,
      Math.min(visibleCount + 6, paddedPhotos.length),
    );
    toPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [paddedPhotos, visibleCount]);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [headerH, setHeaderH] = useState(80);

  useEffect(() => {
    const measure = () => {
      const h =
        (document.querySelector('header') as HTMLElement | null)
          ?.offsetHeight ?? 80;
      setHeaderH(h);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight')
        setLightboxIndex((i) =>
          i === null ? null : (i + 1) % photos.length,
        );
      if (e.key === 'ArrowLeft')
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + photos.length) % photos.length,
        );
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, photos.length]);

  const [ytPlay, setYtPlay] = useState(false);
  const yt = useMemo(() => {
    if (!rightVideo || rightVideo.type !== 'youtube') return null;
    const id = ytId(rightVideo.id);
    const poster =
      baseResolve((rightVideo as any).poster) ||
      (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : '');
    const embed = id ? ytEmbed(id) : '';
    return { poster, embed };
  }, [rightVideo]);

  return (
    <section
      id="portfolio"
      data-anchor="portfolio"
      // добавили mt-*, чтобы секция отошла от quote вниз
      className="section bg-dt-bg relative mt-10 lg:mt-12"
      aria-labelledby="portfolio-heading"
    >
      <div className="container-dt max-w-5xl">
        <h2 id="portfolio-heading" className="text-h2 h-title mb-12 reveal">
          {renderTitle(title)}
        </h2>

        {/* 3×2 стартовый грид + «показать ещё» */}
        <div
          id="portfolio-grid"
          className="grid grid-cols-2 md:grid-cols-3 gap-4 reveal reveal-delay-1"
        >
          {photos.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => {
                setLightboxIndex(i);
                setImgLoaded(false);
              }}
              aria-label={`Открыть фото ${i + 1}`}
              className="relative aspect-square media-frame group cursor-pointer"
            >
              <img
                src={src || baseResolve(FALLBACK[i % FALLBACK.length])}
                alt=""
                className="media-img"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  const fb = baseResolve(
                    FALLBACK[i % FALLBACK.length],
                  );
                  if (img.src !== fb) img.src = fb;
                }}
              />
            </button>
          ))}
        </div>

        {totalPhotos > 6 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((v) =>
                  v >= paddedPhotos.length
                    ? 6
                    : Math.min(paddedPhotos.length, v + 6),
                )
              }
              className="btn-secondary"
              aria-controls="portfolio-grid"
              aria-expanded={visibleCount > 6}
            >
              {visibleCount >= paddedPhotos.length
                ? 'Свернуть'
                : 'Показать ещё'}
            </button>
          </div>
        )}

        {rightVideo && (
          <div className="mt-10 md:mt-12 reveal reveal-delay-2">
            <div className="mx-auto w-full md:w-[70%]">
              {rightVideo.type === 'mp4' ? (
                <VideoPlayer
                  className="media-frame"
                  src={baseResolve(rightVideo.src)}
                  poster={
                    rightVideo.poster
                      ? baseResolve(rightVideo.poster)
                      : undefined
                  }
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
                    {yt.poster && (
                      <img
                        src={yt.poster}
                        alt=""
                        className="media-img"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="media-overlay" />
                    <span className="media-play">
                      <span className="media-play__btn">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
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
            style={{ minWidth: '40vw', minHeight: '40vh' }}
          >
            <img
              key={photos[lightboxIndex]}
              src={photos[lightboxIndex]}
              alt=""
              className="object-contain"
              style={{
                maxWidth: 'min(90vw, 1600px)',
                maxHeight: `calc(100vh - ${headerH + 48}px)`,
              }}
              onLoad={() => setImgLoaded(true)}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                const fb = baseResolve(
                  FALLBACK[lightboxIndex % FALLBACK.length],
                );
                if (img.src !== fb) img.src = fb;
                setImgLoaded(true);
              }}
            />

            <button
              className="absolute top-2 right-2 p-2 rounded-full bg-black/40 hover:bg-black/55 text-white ring-1 ring-white/25"
              onClick={() => setLightboxIndex(null)}
              aria-label="Закрыть"
              title="Закрыть"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() =>
                setLightboxIndex((i) =>
                  i === null
                    ? null
                    : (i - 1 + photos.length) % photos.length,
                )
              }
              aria-label="Предыдущее"
              title="Предыдущее"
            >
              ‹
            </button>

            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() =>
                setLightboxIndex((i) =>
                  i === null ? null : (i + 1) % photos.length,
                )
              }
              aria-label="Следующее"
              title="Следующее"
            >
              ›
            </button>

            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-dt-muted">
              {lightboxIndex + 1} / {photos.length}
            </div>

            {!imgLoaded && (
              <div className="absolute inset-0 grid place-items-center text-dt-muted">
                Загрузка…
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaGrid;
