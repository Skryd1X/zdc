import { lazy, Suspense } from 'react';
import { Header } from './components/Header';
import BgVideoUntilPortfolio from './components/BgVideoUntilPortfolio';
import Hero from './components/Hero';
import About from './components/About';
import { Services } from './components/Services';
import { StyleBlock } from './components/StyleBlock';
import { Experience } from './components/Experience';
import { MediaPR } from './components/MediaPR';
import { InstagramSection } from './components/InstagramSection';
import { Why } from './components/Why';
import { Contacts } from './components/Contacts';
import { Footer } from './components/Footer';

const Quote = lazy(() =>
  import('./components/Quote').then((module) => ({ default: module.Quote })),
);
const MediaGrid = lazy(() =>
  import('./components/MediaGrid').then((module) => ({ default: module.MediaGrid })),
);

function App() {
  return (
    <div className="min-h-screen bg-dt-bg text-dt-text">
      <a
        href="#portfolio"
        className="sr-only focus:not-sr-only focus:fixed focus:z-[999] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded-full"
      >
        Перейти к портфолио
      </a>

      <Header />
      <BgVideoUntilPortfolio />

      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <StyleBlock />
        <Experience />
        <MediaPR />
        <InstagramSection />
        <Why />

        <Suspense fallback={<div className="container-dt py-20 text-dt-muted">Загрузка блока…</div>}>
          <Quote />
        </Suspense>

        <div id="portfolio" data-anchor="portfolio" className="h-0 -mt-24 pointer-events-none" aria-hidden="true" />

        <Suspense fallback={<div className="container-dt py-20 text-dt-muted">Загружаем портфолио…</div>}>
          <MediaGrid />
        </Suspense>

        <Contacts />
      </main>

      <Footer />
    </div>
  );
}

export default App;
