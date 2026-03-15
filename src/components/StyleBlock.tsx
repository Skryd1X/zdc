import { DT } from '../content/doubleTouch.ru';
import { withBase } from '../utils/site';

export const StyleBlock = () => {
  return (
    <section id="style" className="section relative overflow-hidden">
      <div className="container-dt">
        <div className="style-shell reveal">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40">
              <img src={withBase(DT.style.image)} alt={DT.style.title} className="h-full min-h-[420px] w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
              <span className="absolute left-5 top-5 rounded-full border border-white/12 bg-black/55 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-white/70 backdrop-blur">
                {DT.style.kicker}
              </span>
              <span className="absolute bottom-4 left-4 font-script text-5xl text-dt-accent">movement</span>
            </div>

            <div className="relative">
              <span className="section-watermark">OUR STORY</span>
              <span className="poster-kicker">{DT.style.kicker}</span>
              <h2 className="section-heading mt-4 text-white">{DT.style.title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/74">{DT.style.description}</p>

              <div className="mt-8 space-y-4">
                {DT.style.bullets.map((bullet, index) => (
                  <div key={bullet} className="mini-card flex items-start gap-4 text-white/78" style={{ animationDelay: `${index * 70}ms` }}>
                    <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r from-dt-accent to-dt-accent2" />
                    <span className="text-sm uppercase tracking-[0.16em] md:text-[15px]">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StyleBlock;
