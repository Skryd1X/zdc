import { DT } from '../content/doubleTouch.ru';

export const Quote = () => {
  return (
    <section id="quote" className="section bg-transparent relative">
      <div className="container-dt max-w-4xl">
        <blockquote className="text-center reveal">
          <p className="text-3xl md:text-4xl font-bold leading-relaxed text-dt-text
                         drop-shadow-[0_2px_18px_rgba(0,0,0,.35)]">
            «{DT.quote}»
          </p>
        </blockquote>
      </div>
    </section>
  );
};
