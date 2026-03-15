// src/components/Contacts.tsx
import { MapPin, Phone, Mail } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';
import { ContactForm } from './ContactForm';

export const Contacts = () => {
  const TG = DT.contacts.telegramUrl || `https://t.me/${DT.contacts.telegram}`;
  const IG =
    DT.contacts.instagramUrl || `https://instagram.com/${DT.contacts.instagram}`;

  const normalizeTel = (v: string) => (v || '').replace(/[^\d+]/g, '');
  const telHref = `tel:${normalizeTel(DT.contacts.phone || '')}`;
  const mailHref = `mailto:${DT.contacts.email}?subject=${encodeURIComponent(
    'Запрос выступления — Double Touch'
  )}`;

  const socialLinks = [
    { label: 'Telegram', href: TG },
    { label: 'Instagram', href: IG },
    { label: 'Позвонить', href: telHref },
    { label: 'Email', href: mailHref },
  ];

  // --- Карта ---
  const address = DT.contacts.address || 'Zlotnikov Dance Center, Tashkent';
  const fallbackEmbed = `https://www.google.com/maps?q=${encodeURIComponent(
    address
  )}&output=embed`;

  const raw = (DT.contacts.mapEmbed || '').trim();
  const isIframeHtml = /<\s*iframe[\s\S]*?>/i.test(raw);
  const mapSrc = raw ? (isIframeHtml ? raw : raw) : fallbackEmbed;

  // Скелетон для iframe до onLoad
  const Skeleton = () => (
    <div className="w-full h-[380px] flex items-center justify-center">
      <div className="text-center space-y-2">
        <MapPin className="w-12 h-12 text-dt-accent2 mx-auto opacity-50" />
        <p className="text-dt-muted text-sm">Загружаем карту…</p>
      </div>
    </div>
  );

  return (
    <section id="contacts" className="section bg-dt-surface">
      <div className="container-dt max-w-5xl">
        <h2 className="text-h2 text-dt-text mb-12 reveal" aria-label={DT.contacts.title}>
          {DT.contacts.title}
        </h2>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Левая колонка: контакты + соцсети + карта */}
          <div className="space-y-8 reveal">
            <div className="space-y-4" aria-label="Контактные данные">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-dt-accent2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-dt-text mb-1">Адрес</p>
                  <p className="text-dt-muted">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-dt-accent2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-dt-text mb-1">Телефон</p>
                  <a href={telHref} className="link-accent" aria-label={`Позвонить: ${DT.contacts.phone}`}>
                    {DT.contacts.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-dt-accent2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-dt-text mb-1">Email</p>
                  <a href={mailHref} className="link-accent" aria-label={`Написать на ${DT.contacts.email}`}>
                    {DT.contacts.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Мессенджеры и соцсети — подсветка на hover/focus */}
            <div className="space-y-4">
              <p className="font-semibold text-dt-text">Мессенджеры и соцсети</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      btn-secondary text-sm
                      transition-all
                      hover:border-dt-accent/50 hover:shadow-[0_0_22px_rgba(132,106,255,.25)]
                      focus-visible:border-dt-accent/50 focus-visible:shadow-[0_0_22px_rgba(132,106,255,.35)]
                    "
                    aria-label={link.label}
                    data-source="contacts"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Карта */}
            <div className="rounded-lg overflow-hidden bg-dt-bg border border-dt-line">
              {mapSrc ? (
                isIframeHtml ? (
                  <div
                    className="w-full"
                    style={{ height: 380 }}
                    // строка приходит из локального конфига DT → доверяем
                    dangerouslySetInnerHTML={{ __html: mapSrc }}
                    aria-label="Карта — Zlotnikov Dance Center"
                  />
                ) : (
                  <iframe
                    title="Карта — Zlotnikov Dance Center"
                    src={mapSrc}
                    className="w-full"
                    style={{ border: 0, height: 380 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )
              ) : (
                <Skeleton />
              )}
            </div>
          </div>

          {/* Правая колонка: форма заявки */}
          <div className="reveal reveal-delay-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};
