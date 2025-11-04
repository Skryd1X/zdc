import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];          // абсолютные/относительные src
  startIndex: number;        // c какого начать
  onClose: () => void;       // закрыть
};

export default function PhotoViewer({ images, startIndex, onClose }: Props) {
  const total = images.length;
  const [index, setIndex] = useState(startIndex);
  const wrap = useRef<HTMLDivElement | null>(null);

  const go = useCallback((dir: 1 | -1) => {
    setIndex((i) => (i + dir + total) % total);
  }, [total]);

  // Блокируем скролл страницы
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Клавиатура
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Предзагрузка соседних
  const src = images[index];
  const preload = useMemo(() => {
    const prev = new Image(); prev.src = images[(index - 1 + total) % total];
    const next = new Image(); next.src = images[(index + 1) % total];
    return true;
  }, [index, images, total]); // eslint-disable-line @typescript-eslint/no-unused-vars

  // Свайп
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    deltaX.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX.current == null || !wrap.current) return;
    deltaX.current = e.clientX - startX.current;
    wrap.current.style.transform = `translateX(${deltaX.current}px)`;
  };
  const onPointerUp = () => {
    if (!wrap.current) return;
    const dx = deltaX.current;
    wrap.current.style.transform = "";
    startX.current = null;
    deltaX.current = 0;
    if (Math.abs(dx) > 60) go(dx > 0 ? -1 : 1);
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Верхняя панель */}
      <button
        className="absolute top-4 right-4 p-2 text-white/90 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Закрыть"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Навигация */}
      {total > 1 && (
        <>
          <button
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 p-2 text-white/85 hover:text-white"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Предыдущее"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 p-2 text-white/85 hover:text-white"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Следующее"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </>
      )}

      {/* Область изображения */}
      <div
        className="h-full w-full grid place-items-center px-3 md:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={wrap}
          className="max-w-[92vw] max-h-[86vh] transition-transform duration-200 will-change-transform"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-contain select-none"
            draggable={false}
            loading="eager"
            decoding="async"
          />
        </div>
        <div className="mt-3 text-white/70 text-sm">{index + 1} / {total}</div>
      </div>
    </div>
  );
}
