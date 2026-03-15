import { ArrowUpRight, Check } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';
import { smartScrollTo, withBase } from '../utils/site';

const blocks = [DT.services.brands, DT.services.private];

export const Services = () => {
  return (
    <section id="services" className="section relative overflow-hidden">
      <div className="container-dt space-y-8">
        <div className="section-shell reveal">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="poster-kicker">SERVICES</span>
            <span className="poster-index">02</span>
          </div>
          <div className="relative max-w-4xl">
            <span className="section-watermark">SERVICES</span>
            <h2 className="section-heading text-white">{DT.services.title}</h2>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/72">{DT.services.intro}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {blocks.map((block, index) => (
            <article key={block.title} className="service-card reveal" style={{ animationDelay: `${index * 90}ms` }}>
              <div className="service-card__media">
                <img src={withBase(block.image)} alt={block.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <span className="service-card__eyebrow">{block.eyebrow}</span>
              </div>

              <div className="service-card__content">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-[2.1rem] uppercase leading-[0.95] tracking-[0.08em] text-white md:text-[2.5rem]">
                    {block.title}
                  </h3>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/6 text-dt-accent2">
                    <ArrowUpRight size={18} />
                  </span>
                </div>

                <div className="mt-6 space-y-3 text-white/74">
                  {block.items.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm leading-6 md:text-[15px]">
                      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-dt-accent to-dt-accent2 text-black">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 reveal reveal-delay-2">
          <button type="button" className="btn-primary" onClick={() => smartScrollTo('#portfolio')}>
            Смотреть кейсы
          </button>
          <button type="button" className="btn-secondary" onClick={() => smartScrollTo('#contacts')}>
            Обсудить формат шоу
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
