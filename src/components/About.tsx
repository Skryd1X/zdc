import { DT } from '../content/doubleTouch.ru';
import { withBase } from '../utils/site';

export const About = () => {
  const image = withBase(DT.about.image);

  return (
    <section id="about" className="section relative overflow-hidden">
      <div className="container-dt">
        <div className="poster-grid gap-8 lg:gap-12">
          <div className="section-shell poster-cut reveal">
            <div className="mb-6 flex items-center justify-between gap-4">
              <span className="poster-kicker">{DT.about.kicker}</span>
              <span className="poster-index">01</span>
            </div>

            <div className="relative">
              <span className="section-watermark">ABOUT US</span>
              <h2 className="section-heading section-heading--story whitespace-pre-line text-white">{DT.about.title}</h2>
            </div>

            <div className="mt-6 grid gap-5 text-base leading-7 text-white/75 md:grid-cols-[minmax(0,1.15fr)_220px]">
              <div className="space-y-4">
                {DT.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="space-y-3">
                {DT.about.facts.map((fact) => (
                  <div key={fact} className="mini-card text-sm uppercase tracking-[0.18em] text-white/78">
                    {fact}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative reveal reveal-delay-2">
            <div className="photo-stack aspect-[4/5] overflow-hidden rounded-[2rem]">
              <img src={image} alt={DT.about.imageAlt} className="h-full w-full object-cover grayscale-[0.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/10" />
            </div>

            <div className="absolute -left-6 bottom-8 rounded-[1.6rem] border border-white/12 bg-black/78 px-5 py-4 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/45">{DT.about.caption}</p>
              <p className="font-display text-4xl uppercase tracking-[0.12em] text-white">{DT.about.overlayTitle}</p>
            </div>

            <span className="poster-script absolute -right-4 top-4">collective</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
