import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
  accentHex?: string;     // Бирюза кнопки Play, дефолт #0DECDB
  className?: string;     // Доп. классы для внешнего контейнера
};

const fmt = (t: number) => {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function VideoPlayer({
  src,
  poster,
  accentHex = "#0DECDB",
  className = "",
}: Props) {
  const vRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [muted, setMuted] = useState(false);
  const [vol, setVol] = useState(0.9);
  const [hover, setHover] = useState(false);

  const toggle = () => {
    const v = vRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const seekTo = (r: number) => {
    const v = vRef.current;
    if (!v || !isFinite(v.duration)) return;
    v.currentTime = Math.max(0, Math.min(1, r)) * v.duration;
  };

  const setVolume = (value: number) => {
    const v = vRef.current;
    if (!v) return;
    const c = Math.max(0, Math.min(1, value));
    v.volume = c;
    v.muted = c === 0;
    setMuted(v.muted);
    setVol(c);
  };
  const toggleMute = () => setVolume(muted ? (vol || 0.6) : 0);

  useEffect(() => {
    const v = vRef.current;
    if (!v) return;

    const onLoaded = () => setDur(v.duration || 0);
    const onTime = () => {
      setCur(v.currentTime);
      if (isFinite(v.duration)) setProgress(v.currentTime / v.duration);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnd = () => setPlaying(false);

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnd);
    v.volume = vol;

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

  const gradient = useMemo(
    () => `linear-gradient(90deg, ${accentHex} 0%, rgba(132,106,255,.9) 100%)`,
    [accentHex]
  );

  return (
    <div
      className={[
        "relative w-full aspect-video rounded-xl overflow-hidden",
        "bg-dt-bg border border-dt-line",
        "shadow-[0_0_24px_rgba(132,106,255,.18)]",
        className,
      ].join(" ")}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <video
        ref={vRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        controls={false}
        className="absolute inset-0 w-full h-full object-cover select-none"
        onClick={toggle}
      />

      {/* Большая кнопка Play / Pause */}
      <button
        type="button"
        aria-label={playing ? "Пауза" : "Воспроизвести"}
        onClick={toggle}
        className={[
          "absolute inset-0 m-auto grid place-items-center",
          "transition-opacity duration-200",
          playing && !hover ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        <span
          className="w-20 h-20 md:w-24 md:h-24 rounded-full grid place-items-center"
          style={{
            background: "rgba(0,0,0,.35)",
            boxShadow:
              "0 0 24px rgba(13,236,219,.45), 0 0 44px rgba(132,106,255,.35)",
            border: `2px solid ${accentHex}`,
          }}
        >
          {playing ? (
            <svg width="40" height="40" viewBox="0 0 24 24" fill={accentHex}>
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="44" height="44" viewBox="0 0 24 24" fill={accentHex}>
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
      </button>

      {/* Панель управления */}
      <div
        className={[
          "absolute left-3 right-3 bottom-3",
          "rounded-lg px-3 py-2",
          "bg-black/35 backdrop-blur",
          "border border-white/10",
          "transition-opacity duration-200",
          hover || !playing ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {/* Прогресс */}
        <div
          className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden cursor-pointer mb-2"
          onClick={(e) => {
            const box = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const ratio = (e.clientX - box.left) / box.width;
            seekTo(ratio);
          }}
        >
          <div className="h-full" style={{ width: `${(progress || 0) * 100}%`, background: gradient }} />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-white/80 tabular-nums">
            {fmt(cur)} / {fmt(dur)}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded-md border border-white/15 text-white/90 hover:text-white hover:border-white/30"
              aria-label={muted ? "Включить звук" : "Выключить звук"}
              title={muted ? "Включить звук" : "Выключить звук"}
            >
              {muted || vol === 0 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 10v4h4l5 5V5L9 10H5zm12.54 2l1.23 1.23L20 12l-1.23-1.23L17.54 12z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 10v4h4l5 5V5l-5 5H5zm9.5 2c0 1.77-1.02 3.29-2.5 4.03v-8.06A4.495 4.495 0 0 1 14.5 12z" />
                  <path d="M16.5 12c0 2.48-1.51 4.6-3.67 5.46l.33 1.03A6.51 6.51 0 0 0 18 12a6.51 6.51 0 0 0-4.84-6.49l-.33 1.03A5.5 5.5 0 0 1 16.5 12z" />
                </svg>
              )}
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={(muted ? 0 : vol) * 100}
              onChange={(e) => setVolume(Number(e.currentTarget.value) / 100)}
              className="dt-range h-2 w-28"
              aria-label="Громкость"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
