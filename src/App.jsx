import { useEffect } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import 'lenis/dist/lenis.css'
import Navigation from './components/Navigation/Navigation';
import Hero from './components/Hero/Hero';
import ProofOfWork from './components/ProofOfWork/ProofOfWork';
import WhatWeDo from './components/WhatWeDo/WhatWeDo';
import Applications from './components/Applications/Applications';
import QualityTrust from './components/QualityTrust/QualityTrust';
import Testimonials from './components/Testimonials/Testimonials';
import FeaturedCaseStudies from './components/FeaturedCaseStudies/FeaturedCaseStudies';
import CTA from './components/CTA/CTA';
import Footer from './components/Footer/Footer';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Force refresh to ensure pinning calc is correct after initial render/layout
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      lenis.destroy();
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <ProofOfWork />
        <WhatWeDo />
        <Applications />
        <QualityTrust />
        <Testimonials />
        <FeaturedCaseStudies />
        <Footer />
      </main>
    </>
  );
}

export default App;
