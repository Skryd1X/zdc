import { DT } from '../content/doubleTouch.ru';

export const About = () => {
  return (
    <section
      id="about"
      data-section="about"
      aria-labelledby="about-heading"
      className="section relative overflow-hidden bg-dt-bg scroll-mt-24 md:scroll-mt-28"
    >
      {/* Мягкий фон-декор */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-16 -right-24 h-80 w-80 rounded-full bg-dt-accent/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-dt-accent2/15 blur-3xl" />
      </div>

      <div className="container-dt max-w-4xl">
        <header className="mb-8 md:mb-10 reveal">
          {DT.about?.kicker && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dt-accent2/90 mb-2">
              {DT.about.kicker}
            </p>
          )}
          <h2 id="about-heading" className="text-h2 text-dt-text">
            {DT.about.title}
          </h2>
          <div className="mt-3 h-[3px] w-20 rounded-full bg-gradient-to-r from-dt-accent to-dt-accent2 opacity-80" />
        </header>

        <div className="space-y-6 text-dt-muted leading-relaxed reveal reveal-delay-1">
          {DT.about.paragraphs.map((para: string, i: number) => (
            <p key={i} className="text-lg text-dt-text/85 tracking-[0.01em]">
              {para}
            </p>
          ))}
        </div>

        <div className="h-divider my-16 reveal reveal-delay-2" />
      </div>
    </section>
  );
};
