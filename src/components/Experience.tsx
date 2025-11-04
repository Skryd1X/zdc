import { DT } from '../content/doubleTouch.ru';

type Project = {
  name: string;
  description: string;
  href?: string;
  tags?: string[];
};

export const Experience = () => {
  // разбивка описаний на пункты
  const splitDesc = (s: string) => {
    if (!s) return null;
    if (s.includes('•') || s.includes('\n')) {
      return s
        .split(/\n|•/g)
        .map(t => t.trim())
        .filter(Boolean);
    }
    return null;
  };
  const isAscii = (s: string) => /^[\x00-\x7F]+$/.test(s);

  return (
    <section
      id="experience"
      data-anchor="experience"
      className="section relative z-10 bg-transparent -mt-8 md:-mt-10"
    >
      <div className="container-dt">
        <header className="mb-10 md:mb-12 reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dt-accent2/90 mb-2">
            Highlights
          </p>
          <h2 className="text-h2 text-dt-text">{DT.experience.title}</h2>
          <div className="mt-3 h-[3px] w-24 rounded-full bg-gradient-to-r from-dt-accent to-dt-accent2 opacity-80" />
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {(DT.experience.projects as Project[]).map((p, i) => {
            const bullets = splitDesc(p.description);
            return (
              <article
                key={i}
                tabIndex={0}
                className="
                  group relative rounded-xl border border-dt-line/80 bg-dt-surface/70 p-6
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:border-dt-accent/50
                  hover:shadow-[0_0_32px_rgba(132,106,255,.22)]
                  focus-within:-translate-y-0.5 focus-within:border-dt-accent/50
                  focus-within:shadow-[0_0_32px_rgba(132,106,255,.22)]
                  reveal
                "
              >
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-dt-accent/10 via-transparent to-dt-accent2/10" />

                <h3 className="relative z-[1] text-[1.125rem] md:text-[1.25rem] font-extrabold text-dt-text mb-2 tracking-[0.02em]">
                  {p.name}
                </h3>

                {bullets ? (
                  <ul className="relative z-[1] space-y-2.5">
                    {bullets.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-dt-accent2/90 flex-shrink-0" />
                        <span
                          className="text-dt-text/85 leading-relaxed tracking-[0.01em]"
                          {...(isAscii(b) ? { lang: 'en' } : {})}
                        >
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p
                    className="relative z-[1] text-dt-text/85 leading-relaxed tracking-[0.01em]"
                    {...(isAscii(p.description) ? { lang: 'en' } : {})}
                  >
                    {p.description}
                  </p>
                )}

                {Array.isArray(p.tags) && p.tags.length > 0 && (
                  <div className="relative z-[1] mt-4 flex flex-wrap gap-2">
                    {p.tags.map((t, k) => (
                      <span key={k} className="chip-accent">{t}</span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
