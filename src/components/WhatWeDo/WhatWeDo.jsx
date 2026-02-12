import React, { useEffect, useRef } from 'react';
import styles from './WhatWeDo.module.css';
import processImage from '../../assets/process-material.png';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParallaxImage from '../ParallaxImage/ParallaxImage';

gsap.registerPlugin(ScrollTrigger);

const WhatWeDo = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(contentRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    const capabilities = [
        {
            title: "Structural and Safety Glass",
            desc: "Heat-treated, laminated, and engineered assemblies produced to specified load and impact requirements."
        },
        {
            title: "Architectural & Design Glass",
            desc: "Low-iron, coated, back-painted, and custom-finished glass tailored for visual clarity and consistency."
        },
        {
            title: "Precision Fabrication",
            desc: "CNC cutting, drilling, edging, polishing, and cut-out detailing within controlled tolerances."
        },
        {
            title: "Finishing & Surface Treatments",
            desc: "Acid-etching, sandblasting, digital printing, and specialty coatings applied with repeatable accuracy."
        }
    ];

    return (
        <section ref={sectionRef} className={styles.section}>
            <div className={styles.container}>
                <div ref={contentRef} className={styles.textColumn}>
                    <h2 className={styles.headline}>Glass Processing,<br />Controlled at Every Stage</h2>

                    <div className={styles.capabilitiesList}>
                        {capabilities.map((cap, i) => (
                            <div key={i} className={styles.capability}>
                                <h3 className={styles.capTitle}>{cap.title}</h3>
                                <p className={styles.capDesc}>{cap.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.ctaWrapper}>
                        <a href="#consult" className={styles.inlineLink}>Consult With Our Technical Team</a>
                    </div>
                </div>
                <div className={styles.imageColumn}>
                    <ParallaxImage src={processImage} alt="Glass Processing Detail" className={styles.image} speed={0.5} />
                </div>
            </div>
        </section>
    );
};

export default WhatWeDo;
