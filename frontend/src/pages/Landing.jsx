import Nav from "../sections/Nav";
import Hero from "../sections/Hero";
import Stats from "../sections/Stats";
import Simulator from "../sections/Simulator";
import Sistemas from "../sections/Sistemas";
import About from "../sections/About";
import FAQ from "../sections/FAQ";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

export default function Landing() {
  return (
    <main className="relative min-h-screen bg-[#0B1B33] text-[#FFFFFF]" data-testid="landing-page">
      <Nav />
      <Hero />
      <Stats />
      <Simulator />
      <Sistemas />
      <About />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
