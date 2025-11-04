import { useEffect, useRef } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';

export const Contacts = () => {
  const TG = DT.contacts.telegramUrl || `https://t.me/${DT.contacts.telegram}`;
  const IG = DT.contacts.instagramUrl || `https://instagram.com/${DT.contacts.instagram}`;

  // Нормализуем номер для tel:
  const phoneRaw = DT.contacts.phone || '';
  const phoneTel = phoneRaw.trim().replace(/[^\d+]/g, '');

  // mailto с темой/заготовкой письма
  const subject = encodeURIComponent('Booking request — Double Touch Show');
  const body = encodeURIComponent(
    `Здравствуйте!

Интересует выступление Double Touch.
Дата/время:
Площадка/город:
Формат (бренд/частное/ивент):
Контактное лицо:

Спасибо!`
  );
  const mailHref = `mailto:${DT.contacts.email}?subject=${subject}&body=${body}`;

  // Карта
  const mapSrc =
    'https://www.google.com/maps?q=' +
    encodeURIComponent(DT.contacts.address || 'Zlotnikov Dance Center, Tashkent') +
    '&output=embed';

  /** ===== Видео-фон для секции КОНТАКТЫ (приглушённый) ===== */
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tryPlay() : v.pause()), {
      threshold: 0.1,
    });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const base = import.meta.env.BASE_URL || '/';
  const VIDEO_WEBM = `${base}media/videos/hero.webm`;
  const VIDEO_MP4 = `${base}media/videos/hero.mp4`;

  return (
    <section id="contacts" className="section relative overflow-hidden">
      {/* ФОН-ВИДЕО: ~35% видимости + вуали */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{ opacity: 0.35 }}
        >
          <source src={VIDEO_WEBM} type="video/webm" />
          <source src={VIDEO_MP4} type="video/mp4" />
        </video>

        <div
          className="absolute inset-0"
          style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
        />
        <div className="absolute inset-0 bg-dt-bg/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dt-bg/50 to-dt-bg/80" />
      </div>

      <div className="container-dt max-w-5xl">
        <h2 className="text-h2 text-dt-text mb-12 reveal">{DT.contacts.title}</h2>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Левая колонка: реквизиты */}
          <div className="space-y-8 reveal">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-dt-accent2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-dt-text mb-1">Адрес</p>
                  <p className="text-dt-muted">{DT.contacts.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-dt-accent2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-dt-text mb-1">Телефон</p>
                  <a href={`tel:${phoneTel}`} className="link-accent" aria-label={`Позвонить ${phoneRaw}`}>
                    {phoneRaw}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-dt-accent2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-dt-text mb-1">Email</p>
                  <a href={mailHref} className="link-accent" aria-label={`Написать на ${DT.contacts.email}`}>
                    {DT.contacts.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Мессенджеры и соцсети */}
            <div className="space-y-4">
              <p className="font-semibold text-dt-text">Мессенджеры и соцсети</p>
              <div className="flex flex-wrap gap-3">
                <a href={TG} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                  TELEGRAM
                </a>
                <a href={IG} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm">
                  INSTAGRAM
                </a>
                <a href={`tel:${phoneTel}`} className="btn-secondary text-sm" aria-label={`Позвонить ${phoneRaw}`}>
                  ПОЗВОНИТЬ
                </a>
                <a href={mailHref} className="btn-secondary text-sm" aria-label={`Написать на ${DT.contacts.email}`}>
                  EMAIL
                </a>
              </div>
            </div>
          </div>

          {/* Правая колонка: CTA + карта */}
          <div className="space-y-6 reveal reveal-delay-1">
            <a href={TG} target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-center">
              Написать в Telegram
            </a>

            <div className="aspect-video rounded-lg overflow-hidden bg-dt-bg/70 border border-dt-line">
              <iframe
                title="Карта: Zlotnikov Dance Center"
                src={mapSrc}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <p className="text-xs text-dt-muted text-center">
              Нажимая «Написать в Telegram», вы переходите в официальный аккаунт Double Touch.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
