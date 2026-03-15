import { DT } from '../content/doubleTouch.ru';
import { withBase } from '../utils/site';

export const Quote = () => {
  const image = withBase(DT.quote.image);

  return (
    <section className="section relative overflow-hidden">
      <div className="container-dt">
        <div className="quote-shell reveal">
          <div className="grid items-center gap-8 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-12">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40">
              <img src={image} alt={DT.quote.author} className="h-full min-h-[320px] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />
            </div>

            <blockquote className="relative">
              <span className="poster-kicker">FOUNDER'S NOTE</span>
              <p className="mt-5 max-w-4xl font-heading text-2xl font-semibold leading-[1.45] text-white md:text-[2rem] lg:text-[2.3rem]">
                «{DT.quote.text}»
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="font-display text-3xl uppercase tracking-[0.12em] text-white">{DT.quote.author}</span>
                <span className="text-xs uppercase tracking-[0.28em] text-dt-accent2/85">{DT.quote.role}</span>
              </div>
              <span className="poster-script mt-5 inline-block">with love for the stage</span>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quote;
