import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';
import { getInstagramUrl, getTelegramUrl, normalizePhone } from '../utils/site';

export const Contacts = () => {
  const telegram = getTelegramUrl(DT.contacts.telegram, DT.contacts.telegramUrl);
  const instagram = getInstagramUrl(DT.contacts.instagram, DT.contacts.instagramUrl);
  const phoneTel = normalizePhone(DT.contacts.phone);
  const mapSrc = DT.contacts.mapEmbed;

  return (
    <section id="contacts" className="section relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,0,140,0.14),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(64,169,255,0.14),transparent_40%)]" />

      <div className="container-dt">
        <div className="contact-shell reveal">
          <div className="mb-7 flex items-center justify-between gap-4">
            <span className="poster-kicker">CONTACTS</span>
            <span className="poster-index">06</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
            <div>
              <div className="relative max-w-3xl">
                <span className="section-watermark">CONTACT</span>
                <h2 className="section-heading text-white">{DT.contacts.title}</h2>
              </div>

              <div className="mt-8 space-y-4">
                <a href={`tel:${phoneTel}`} className="contact-row">
                  <span className="contact-row__icon"><Phone size={16} /></span>
                  <span>
                    <span className="contact-row__label">Телефон</span>
                    <span className="contact-row__value">{DT.contacts.phone}</span>
                  </span>
                </a>

                <a href={`mailto:${DT.contacts.email}`} className="contact-row">
                  <span className="contact-row__icon"><Mail size={16} /></span>
                  <span>
                    <span className="contact-row__label">Email</span>
                    <span className="contact-row__value">{DT.contacts.email}</span>
                  </span>
                </a>

                <a href={telegram} target="_blank" rel="noopener noreferrer" className="contact-row">
                  <span className="contact-row__icon"><Send size={16} /></span>
                  <span>
                    <span className="contact-row__label">Telegram</span>
                    <span className="contact-row__value">@{DT.contacts.telegram.replace(/^@/, '')}</span>
                  </span>
                </a>

                <div className="contact-row">
                  <span className="contact-row__icon"><MapPin size={16} /></span>
                  <span>
                    <span className="contact-row__label">Адрес</span>
                    <span className="contact-row__value">{DT.contacts.address}</span>
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a href={telegram} target="_blank" rel="noopener noreferrer" className="btn-primary">Написать в Telegram</a>
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary">Открыть Instagram</a>
              </div>

              <p className="mt-8 font-script text-4xl text-dt-accent">Let’s create your moment</p>
            </div>

            <div className="contact-map-shell">
              <iframe
                title={DT.contacts.address}
                src={mapSrc}
                className="contact-map-frame"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contacts;
