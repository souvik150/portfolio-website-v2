import Background from "@/components/Background";
import ScrollChart from "@/components/ScrollChart";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import MetricsStrip from "@/components/MetricsStrip";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Credentials from "@/components/Credentials";
import PlayCTA from "@/components/PlayCTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Background />
      <ScrollChart />
      <Cursor />
      <Nav />
      <main id="content">
        <Hero />
        <div className="mt-20 sm:mt-28">
          <Ticker />
        </div>
        <MetricsStrip />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Credentials />
        <PlayCTA />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
