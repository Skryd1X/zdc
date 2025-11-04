import { DT } from '../content/doubleTouch.ru';

export const MediaPR = () => {
  return (
    // якорь остаётся #media (старые ссылки будут работать)
    <section
      id="media"
      data-anchor="media"
      aria-labelledby="media-heading"
      className="section relative z-10 bg-transparent -mt-8 md:-mt-10"
    >
      <div className="container-dt">
        <header className="mb-10 md:mb-12 reveal">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dt-accent2/90 mb-2">
            Media & Partners
          </p>
          <h2 id="media-heading" className="text-h2 text-dt-text">
            {DT.mediaPr.title}
          </h2>
          <div className="mt-3 h-[3px] w-20 rounded-full bg-gradient-to-r from-dt-accent to-dt-accent2 opacity-80" />
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {DT.mediaPr.items.map(
            (
              item: { label: string; value: string; description?: string },
              i: number
            ) => {
              const descIsHandle =
                Boolean(item.description) &&
                item.description!.trim().startsWith('@');
              const handle = descIsHandle
                ? item.description!.trim().slice(1)
                : '';
              const igHref = descIsHandle
                ? DT.contacts.instagramUrl ||
                  `https://instagram.com/${handle}`
                : undefined;

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
                  "
                >
                  {/* мягкий внутренний градиент при hover/focus */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-dt-accent/10 via-transparent to-dt-accent2/10" />

                  <h3 className="relative z-[1] text-[1.125rem] md:text-[1.25rem] font-extrabold text-dt-text mb-1 tracking-[0.02em]">
                    {item.label}
                  </h3>

                  <p className="relative z-[1] text-[1.05rem] font-semibold tracking-[0.01em] text-dt-text/90">
                    {item.value}
                  </p>

                  {item.description && (
                    <p className="relative z-[1] mt-1 leading-relaxed tracking-[0.01em] text-dt-text/82">
                      {descIsHandle ? (
                        <a
                          href={igHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-accent"
                        >
                          {item.description}
                        </a>
                      ) : (
                        item.description
                      )}
                    </p>
                  )}
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};
