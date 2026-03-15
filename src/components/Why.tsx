import { DT } from '../content/doubleTouch.ru';
import { getTelegramUrl } from '../utils/site';

export const Why = () => {
  const telegram = getTelegramUrl(DT.contacts.telegram, DT.contacts.telegramUrl);

  return (
    <section id="why" className="section relative overflow-hidden">
      <div className="container-dt space-y-8">
        <div className="section-shell reveal">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="poster-kicker">{DT.why.kicker}</span>
            <span className="poster-index">05</span>
          </div>

          <div className="relative max-w-4xl">
            <span className="section-watermark">WHY US</span>
            <h2 className="section-heading text-white">{DT.why.title}</h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {DT.why.reasons.map((reason, index) => (
            <article key={reason.title} className="reason-card reveal" style={{ animationDelay: `${index * 60}ms` }}>
              <div className="reason-card__digit">{String(index + 1).padStart(2, '0')}</div>
              <h3 className="reason-card__title">{reason.title}</h3>
              <p className="reason-card__description">{reason.description}</p>
            </article>
          ))}
        </div>

        <div className="reveal reveal-delay-2">
          <a href={telegram} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Обсудить проект в Telegram
          </a>
        </div>
      </div>
    </section>
  );
};

export default Why;
