import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './QualityTrust.module.css';

import micro1 from '../../assets/micro-surface.png';
import micro2 from '../../assets/micro-layers.png';

gsap.registerPlugin(ScrollTrigger);

const content = [
    { id: '01', img: micro1, label: 'Architectural-Grade Tempering & Lamination', desc: 'Processed to comply with relevant structural and safety standards.' },
    { id: '02', img: micro2, label: 'Dimensional Tolerances Maintained', desc: 'Controlled fabrication environments to ensure fit and finish consistency.' },
    { id: '03', img: micro1, label: 'Production Capacity at Scale', desc: 'High-volume capability without deviation in clarity or edge quality.' },
    { id: '04', img: micro2, label: 'Quality Inspection at Every Stage', desc: 'Multi-point checks from raw sheet to final dispatch.' },
];

const QualityTrust = () => {
    const sectionRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const section = sectionRef.current;
            const grid = gridRef.current;

            if (!section || !grid) return;

            // Simple reveal animation instead of scroll-linked expansion
            gsap.fromTo(grid.children,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className={styles.section}>
            {/* Headline removed if duplicate, but here it is the only one in component. The duplicate is likely in App.jsx */}
            <h2 className={styles.headline}>Measured Performance. Verified Standards.</h2>
            <div ref={gridRef} className={styles.grid}>
                {content.map((item) => (
                    <div key={item.id} className={styles.item}>
                        <div className={styles.backgroundNumber}>{item.id}</div>
                        <div className={styles.imageWrapper}>
                            <img src={item.img} alt={item.label} className={styles.image} />
                        </div>
                        <div className={styles.details}>
                            <h3 className={styles.label}>{item.label}</h3>
                            <p className={styles.desc}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default QualityTrust;
