import { ArrowRight, ChevronDown, PhoneCall } from 'lucide-react';
import { DT } from '../content/doubleTouch.ru';
import { getTelegramUrl, smartScrollTo } from '../utils/site';

export const Hero = () => {
  const telegram = getTelegramUrl(DT.contacts.telegram, DT.contacts.telegramUrl);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden pt-24">
      <div className="container-dt relative flex min-h-[calc(100vh-6rem)] items-center py-14 lg:py-20">
        <div className="w-full">
          <div className="relative max-w-6xl">
            <span className="poster-kicker reveal">{DT.hero.kicker}</span>

            <div className="mt-4 reveal reveal-delay-1">
              <div className="poster-hero relative">
                <span className="poster-float poster-float-left hidden xl:block" aria-hidden="true">
                  {DT.hero.sideLabel}
                </span>

                <h1 className="poster-title max-w-5xl text-white">
                  <span className="poster-title-line">DOUBLE TOUCH</span>
                  <span className="poster-title-line poster-outline">PREMIUM</span>
                  <span className="poster-title-line poster-gradient">SHOW TEAM</span>
                </h1>

                <span className="poster-float poster-float-right hidden xl:block" aria-hidden="true">
                  {DT.hero.sideWord}
                </span>
              </div>
            </div>

            <div className="mt-7 max-w-3xl space-y-5 reveal reveal-delay-2">
              <p className="text-xl font-heading font-semibold uppercase tracking-[0.08em] text-white md:text-2xl">
                {DT.hero.title}
              </p>
              <p className="max-w-2xl text-base leading-7 text-white/76 md:text-lg">
                {DT.hero.subtitle}
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-4 reveal reveal-delay-3">
              <button type="button" onClick={() => smartScrollTo('#portfolio')} className="btn-primary">
                {DT.hero.cta1}
                <ArrowRight size={18} />
              </button>

              <a href={telegram} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                {DT.hero.cta2}
                <PhoneCall size={18} />
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3 reveal reveal-delay-3">
              {DT.hero.tags.map((tag) => (
                <div key={tag} className="glass-panel px-4 py-4 text-sm uppercase tracking-[0.18em] text-white/78">
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => smartScrollTo('#about')}
          className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/72 backdrop-blur hover:text-white"
        >
          Scroll
          <ChevronDown className="animate-bounce" size={16} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
