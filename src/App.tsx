import { Header } from './components/Header';
import BgVideoUntilPortfolio from './components/BgVideoUntilPortfolio';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { StyleBlock } from './components/StyleBlock';
import { Experience } from './components/Experience';
import { MediaPR } from './components/MediaPR';
import { Why } from './components/Why';
import { Quote } from './components/Quote';
import { MediaGrid } from './components/MediaGrid';
import { Contacts } from './components/Contacts';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-dt-bg">
      <Header />

      {/* Фиксированный фон-видео до портфолио */}
      <BgVideoUntilPortfolio />

      <main className="relative z-10">
        <Hero />
        <About />
        <Services />
        <StyleBlock />
        <Experience />
        <MediaPR />
        <Why />
        <Quote />

        {/* >>> ЯКОРЬ ПОРТФОЛИО — точка приземления для #portfolio <<< */}
        <div
          id="portfolio"
          data-anchor="portfolio"
          className="h-0 -mt-24 pointer-events-none"
          aria-hidden="true"
        />

        <MediaGrid />
        <Contacts />
      </main>

      <Footer />
    </div>
  );
}

export default App;
