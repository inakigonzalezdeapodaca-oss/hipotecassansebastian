import Nav from "../sections/Nav";
import Hero from "../sections/Hero";
import Stats from "../sections/Stats";
import Simulator from "../sections/Simulator";
import Sistemas from "../sections/Sistemas";
import About from "../sections/About";
import HowItWorks from "../sections/HowItWorks";
import FAQ from "../sections/FAQ";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";

export default function Landing() {
  return (
    <main className="relative min-h-screen bg-[#080A0F] text-[#F3F2ED]" data-testid="landing-page">
      <Nav />
      <Hero />
      <Stats />
      <Simulator />
      <Sistemas />
      <About />
      <HowItWorks />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
