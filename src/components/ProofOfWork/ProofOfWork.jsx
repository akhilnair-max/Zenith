import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProofOfWork.module.css';

import img1 from '../../assets/pow-1.png';
import img2 from '../../assets/pow-2.png';
import img3 from '../../assets/pow-3.png';

gsap.registerPlugin(ScrollTrigger);

const images = [img1, img2, img3, img1, img2]; // Duplicate specific images for length if needed, or just use 3. User said "horizontal procession... reveal images". 3 might be short. I'll add duplicates to make it feel like a procession.

const ProofOfWork = () => {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const imagesRef = useRef([]);
    const textRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            const section = sectionRef.current;
            const track = trackRef.current;

            // Calc width dynamically
            const getScrollAmt = () => track.scrollWidth - window.innerWidth;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => `+=${getScrollAmt()}`,
                    invalidateOnRefresh: true, // Recalculate on resize
                    onUpdate: (self) => {
                        // Check center alignment logic
                        // (Keeping existing logic but ensuring safety if elements are missing)
                        imagesRef.current.forEach((imgWrapper) => {
                            if (!imgWrapper) return;
                            const rect = imgWrapper.getBoundingClientRect();
                            const center = window.innerWidth / 2;
                            const imgCenter = rect.left + rect.width / 2;
                            const dist = Math.abs(center - imgCenter);

                            if (dist < rect.width / 2) {
                                imgWrapper.classList.add(styles.active);
                            } else {
                                imgWrapper.classList.remove(styles.active);
                            }
                        });

                        if (self.progress > 0.8) {
                            textRef.current?.classList.add(styles.visible);
                        } else {
                            textRef.current?.classList.remove(styles.visible);
                        }
                    }
                }
            });

            tl.to(track, {
                x: () => -getScrollAmt(),
                ease: 'none',
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const addToRefs = (el) => {
        if (el && !imagesRef.current.includes(el)) {
            imagesRef.current.push(el);
        }
    };

    return (
        <section ref={sectionRef} className={styles.powSection}>
            <div ref={trackRef} className={styles.track}>
                {images.map((src, i) => (
                    <div key={i} className={styles.imageWrapper} ref={addToRefs}>
                        <img src={src} alt={`Project ${i + 1}`} className={styles.projectImage} />
                    </div>
                ))}
            </div>
            <div ref={textRef} className={styles.supportingText}>
                Selected landmark projects across corporate, hospitality, retail, and high-end residential environments.
            </div>
        </section>
    );
};

export default ProofOfWork;
