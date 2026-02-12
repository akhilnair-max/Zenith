import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import styles from './FeaturedCaseStudies.module.css';
import caseStudyHero from '../../assets/case-study-hero.png';
import projectFacade from '../../assets/pow-1.png'; // Corrected from project-facade.png
import projectStructure from '../../assets/process-material.png'; // Corrected from project-structure.png
import ParallaxImage from '../ParallaxImage/ParallaxImage';

const CASE_STUDIES = [
    {
        id: 1,
        title: "Landmark Commercial Headquarters",
        info: "Custom laminated low-iron structural glazing system",
        image: caseStudyHero
    },
    {
        id: 2,
        title: "Modern Cultural Arts Center",
        info: "Acoustic glass envelope with thermal performance coating",
        image: projectFacade
    },
    {
        id: 3,
        title: "Luxury Residential Tower",
        info: "Frameless balcony balustrades and wind-load engineered panels",
        image: projectStructure
    }
];

const FeaturedCaseStudies = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const imageRef = useRef(null);
    const textRef = useRef(null);

    const handleNext = () => {
        const nextIndex = (currentIndex + 1) % CASE_STUDIES.length;
        animateWebTransition(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (currentIndex - 1 + CASE_STUDIES.length) % CASE_STUDIES.length;
        animateWebTransition(prevIndex);
    };

    const animateWebTransition = (targetIndex) => {
        // Instant image swap to prevent white flash
        setCurrentIndex(targetIndex);

        // Animate text content only
        if (textRef.current) {
            gsap.fromTo(textRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    };

    const currentStudy = CASE_STUDIES[currentIndex];

    return (
        <section className={styles.section} id="case-study">
            <div className={styles.imageWrapper}>
                <ParallaxImage
                    src={currentStudy.image}
                    alt={currentStudy.title}
                    className={styles.caseStudyImage}
                    speed={0.5}
                />

                <div className={styles.arrowsOverlay}>
                    <button className={styles.navButton} onClick={handlePrev} aria-label="Previous Case Study">
                        <ChevronLeft size={32} strokeWidth={1.5} />
                    </button>
                    <button className={styles.navButton} onClick={handleNext} aria-label="Next Case Study">
                        <ChevronRight size={32} strokeWidth={1.5} />
                    </button>
                </div>
            </div>
            <div className={styles.contentWrapper}>
                <div className={styles.infoGroup} ref={textRef}>
                    <h2 className={styles.headline}>{currentStudy.title}</h2>
                    <p className={styles.subInfo}>{currentStudy.info}</p>
                </div>

                <a href="#case-study" className={styles.ctaView}>View Case Study</a>
            </div>
        </section>
    );
};

export default FeaturedCaseStudies;
