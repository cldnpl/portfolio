import AnimatedBackground from "@/components/landing/AnimatedBackground";
import IPhoneScrollScene from "@/components/landing/IPhoneScrollScene";
import NameModelHero from "@/components/landing/NameModelHero";
import QuoteRevealSection from "@/components/landing/QuoteRevealSection";

const Index = () => {
  return (
    <main className="portfolio-landing">
      <AnimatedBackground />

      <header className="portfolio-nav">
        <a href="#top" className="portfolio-mark" aria-label="Claudia Napolitano home">
          CN
        </a>

        <nav className="portfolio-links" aria-label="Primary">
          <a href="#projects">Progetti</a>
          <a href="#about">Chi sono</a>
          <a href="#contact">Contatti</a>
          <a href="https://github.com/cldnpl" target="_blank" rel="noreferrer">
            Github
          </a>
          <a href="https://www.linkedin.com/in/claudia-napolitano/" target="_blank" rel="noreferrer">
            Linkedin
          </a>
        </nav>
      </header>

      <section id="top" className="hero-section" aria-label="Claudia Napolitano portfolio">
        <div className="hero-content">
          <NameModelHero />
        </div>
      </section>

      <QuoteRevealSection />

      <section id="projects">
        <IPhoneScrollScene />
      </section>

      <section id="about" className="portfolio-anchor" aria-hidden="true" />
      <section id="contact" className="portfolio-anchor" aria-hidden="true" />
    </main>
  );
};

export default Index;
