import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = ({ src, alt, className, speed = 0.5 }) => {
    const containerRef = useRef(null);
    const imgRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const img = imgRef.current;

        if (!container || !img) return;

        let ctx = gsap.context(() => {
            gsap.fromTo(img,
                { y: '-10%' },
                {
                    y: '10%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [speed]);

    return (
        <div ref={containerRef} className={`${className} parallax-container`} style={{ overflow: 'hidden', position: 'relative' }}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                style={{ width: '100%', height: '120%', objectFit: 'cover', transform: 'translateY(-10%)' }}
            />
        </div>
    );
};

export default ParallaxImage;
