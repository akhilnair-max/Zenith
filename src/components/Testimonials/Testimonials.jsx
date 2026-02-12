import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Testimonials.module.css';

const testimonials = [
    {
        id: 1,
        quote: "The attention to detail and creative vision transformed our brand identity completely.",
        author: "Sarah Chen",
        role: "Creative Director",
        company: "Studio Forma",
        image: "https://plus.unsplash.com/premium_photo-1689551671548-79ff30459d2a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
    },
    {
        id: 2,
        quote: "Working with them felt like a true creative partnership from day one.",
        author: "Marcus Webb",
        role: "Head of Design",
        company: "Minimal Co",
        image: "https://images.unsplash.com/photo-1649123245135-4db6ead931b5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
    },
    {
        id: 3,
        quote: "They understand that great design is invisible yet unforgettable.",
        author: "Elena Voss",
        role: "Art Director",
        company: "Pixel & Co",
        image: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D$0",
    },
];

const Testimonials = () => {
    const [active, setActive] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleChange = (index) => {
        if (index === active || isTransitioning) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setActive(index);
            setTimeout(() => setIsTransitioning(false), 50);
        }, 300);
    };

    const handlePrev = () => {
        const newIndex = active === 0 ? testimonials.length - 1 : active - 1;
        handleChange(newIndex);
    };

    const handleNext = () => {
        const newIndex = active === testimonials.length - 1 ? 0 : active + 1;
        handleChange(newIndex);
    };

    const current = testimonials[active];

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.contentWrapper}>
                    {/* Large index number */}
                    <span className={styles.indexNumber}>
                        {String(active + 1).padStart(2, "0")}
                    </span>

                    <div className={styles.textContent}>
                        <blockquote
                            className={`${styles.quote} ${isTransitioning ? styles.transitioning : ''}`}
                        >
                            "{current.quote}"
                        </blockquote>

                        <div className={`${styles.authorBlock} ${styles.group} ${isTransitioning ? styles.transitioning : ''}`}>
                            <div className={styles.avatarWrapper}>
                                <img
                                    src={current.image}
                                    alt={current.author}
                                    className={styles.avatar}
                                />
                            </div>
                            <div className={styles.authorInfo}>
                                <h4>{current.author}</h4>
                                <p className={styles.roleInfo}>
                                    {current.role}
                                    <span className={styles.separator}>/</span>
                                    <span className={styles.company}>{current.company}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className={styles.navigation}>
                    <div className={styles.progressContainer}>
                        <div className={styles.indicators}>
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleChange(index)}
                                    className={`${styles.indicatorBtn} ${styles.group}`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                >
                                    <span
                                        className={`${styles.indicatorLine} ${index === active ? styles.active : ''}`}
                                    />
                                </button>
                            ))}
                        </div>
                        <span className={styles.pageCounter}>
                            {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                        </span>
                    </div>

                    <div className={styles.arrows}>
                        <button onClick={handlePrev} className={styles.arrowBtn} aria-label="Previous">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={handleNext} className={styles.arrowBtn} aria-label="Next">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
