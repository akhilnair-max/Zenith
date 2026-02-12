import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';
import heroImage from '../../assets/hero-glass.png';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const imageRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const section = sectionRef.current;
            const content = contentRef.current;

            // Timeline for pinning and resistance
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=100%',
                    pin: true,
                    pinSpacing: true, // Explicitly set spacing
                    scrub: true,
                }
            });

            // 1. Text moves up faster (Exit viewport)
            tl.to(content, {
                y: '-50vh', // Reduced from -150vh to avoid moving it too far too fast or off-screen improperly
                opacity: 0, // Fade out to ensure no overlap visuals
                ease: 'none',
                duration: 1,
            }, 0);
        }, sectionRef); // Scope to section

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.heroSection}>
            <div ref={contentRef} className={styles.content}>
                <h1 className={styles.headline}>Premium Architectural Glass Processing for Demanding Projects</h1>
                <div className={styles.ctaWrapper}>
                    <button className={styles.cta}>Discuss Your Project</button>
                </div>
            </div>
            <p className={styles.subheadline}>Zenith manufactures precision-processed structural and design glass for architects, façade consultants, and contractors.</p>
            <div ref={imageRef} className={styles.imageWrapper}>
                <img src={heroImage} alt="Architectural glass detail" className={styles.heroImage} />
            </div>
        </section>
    );
};

export default Hero;
