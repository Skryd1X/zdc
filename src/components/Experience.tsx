import { DT } from '../content/doubleTouch.ru';
import { withBase } from '../utils/site';

export const Experience = () => {
  return (
    <section id="experience" className="section relative overflow-hidden">
      <div className="container-dt space-y-8">
        <div className="section-shell reveal">
          <div className="mb-6 flex items-center justify-between gap-4">
            <span className="poster-kicker">{DT.experience.kicker}</span>
            <span className="poster-index">03</span>
          </div>

          <div className="relative max-w-4xl">
            <span className="section-watermark">OUR WORK</span>
            <h2 className="section-heading text-white">{DT.experience.title}</h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {DT.experience.stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <div className="font-display text-5xl uppercase tracking-[0.08em] text-white">{stat.value}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.24em] text-white/55">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="brand-strip reveal reveal-delay-1">
          {DT.experience.brands.map((brand) => (
            <div key={brand.name} className="brand-strip__item">
              <img src={withBase(brand.logo)} alt={brand.name} className="max-h-11 w-auto object-contain opacity-85 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0" />
            </div>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {DT.experience.projects.map((project, index) => (
            <article key={project.name} className="project-card reveal" style={{ animationDelay: `${index * 60}ms` }}>
              <div className="project-card__number">0{index + 1}</div>
              <h3 className="project-card__title">{project.name}</h3>
              <p className="project-card__description">{project.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
