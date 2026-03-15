import { DT } from '../content/doubleTouch.ru';
import { getInstagramUrl, getTelegramUrl, normalizePhone, smartScrollTo, withBase } from '../utils/site';

export const Footer = () => {
  const telegram = getTelegramUrl(DT.contacts.telegram, DT.contacts.telegramUrl);
  const instagram = getInstagramUrl(DT.contacts.instagram, DT.contacts.instagramUrl);
  const phoneTel = normalizePhone(DT.contacts.phone);
  const logoSrc = withBase('logoDT1.png');

  return (
    <footer className="border-t border-white/10 bg-black/85 backdrop-blur-xl">
      <div className="container-dt py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_0.8fr_0.9fr]">
          <div>
            <button type="button" onClick={() => smartScrollTo('#')} className="flex items-center gap-4 text-left">
              <span className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <img src={logoSrc} alt="Double Touch Show" className="h-9 w-auto" />
              </span>
              <span>
                <span className="block font-display text-3xl uppercase tracking-[0.12em] text-white">Double Touch</span>
                <span className="block text-xs uppercase tracking-[0.28em] text-white/45">premium dance performance</span>
              </span>
            </button>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/58">
              Double Touch Show — танцевальная команда Zlotnikov Dance Center. Шоу для брендов, корпоративов, свадеб, презентаций и больших событий.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">Навигация</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/72">
              <button type="button" className="text-left hover:text-white" onClick={() => smartScrollTo('#about')}>О нас</button>
              <button type="button" className="text-left hover:text-white" onClick={() => smartScrollTo('#services')}>Направления</button>
              <button type="button" className="text-left hover:text-white" onClick={() => smartScrollTo('#experience')}>Опыт</button>
              <button type="button" className="text-left hover:text-white" onClick={() => smartScrollTo('#portfolio')}>Портфолио</button>
              <button type="button" className="text-left hover:text-white" onClick={() => smartScrollTo('#contacts')}>Контакты</button>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">Контакты</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/72">
              <a href={telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Telegram</a>
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
              <a href={`tel:${phoneTel}`} className="hover:text-white">{DT.contacts.phone}</a>
              <a href={`mailto:${DT.contacts.email}`} className="hover:text-white">{DT.contacts.email}</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {DT.footer.year} {DT.footer.copyright}</p>
          <button type="button" onClick={() => smartScrollTo('#')} className="text-left uppercase tracking-[0.24em] hover:text-white md:text-right">
            Наверх
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
