import { ArrowUpRight } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';
import { getInstagramUrl, smartScrollTo, withBase } from '../utils/site';

export const MediaPR = () => {
  const instagram = getInstagramUrl(DT.contacts.instagram, DT.contacts.instagramUrl);

  return (
    <section id="media" className="section relative overflow-hidden">
      <div className="container-dt space-y-8">
        <div className="section-shell reveal">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="poster-kicker">MEDIA & PARTNERS</span>
            <span className="poster-index">04</span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,430px)] lg:items-start lg:gap-10">
            <div>
              <div className="relative max-w-4xl">
                <span className="section-watermark">MEDIA</span>
                <h2 className="section-heading text-white">{DT.mediaPr.title}</h2>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/72">{DT.mediaPr.intro}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {DT.mediaPr.items.map((item) => (
                  <div key={item.label} className="media-metric">
                    <span className="text-[11px] uppercase tracking-[0.28em] text-white/46">{item.label}</span>
                    <h3 className="media-metric__value mt-3 font-display uppercase text-white whitespace-pre-line">{item.value}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/68">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal reveal-delay-2 lg:justify-self-end">
              <div className="media-collage media-collage--clean">
                {DT.mediaPr.gallery.map((image, index) => (
                  <a
                    key={image}
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`media-collage__item media-collage__item--${index + 1}`}
                    aria-label="Открыть Instagram Double Touch"
                  >
                    <img src={withBase(image)} alt="Double Touch media" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </a>
                ))}
                <span className="poster-script media-collage__script">digital energy</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 reveal reveal-delay-2">
          <a href={instagram} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {DT.mediaPr.cta}
            <ArrowUpRight size={18} />
          </a>
          <button type="button" className="btn-secondary" onClick={() => smartScrollTo('#contacts')}>
            Запросить бриф
          </button>
        </div>
      </div>
    </section>
  );
};

export default MediaPR;
