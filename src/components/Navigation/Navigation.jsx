import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';
import styles from './Navigation.module.css';

const Navigation = () => {
    const [isCompressed, setIsCompressed] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Use Lenis scroll listener
    useLenis(({ scroll }) => {
        // Compress after scrolling past the pinned hero duration (approx 1 viewport height)
        // The hero is pinned for 100vh, so at scroll > window.innerHeight, it unpins and starts scrolling away.
        // We want to compress as it scrolls away or slightly before.
        const threshold = window.innerHeight;

        if (scroll > threshold && !isCompressed) {
            setIsCompressed(true);
        } else if (scroll <= threshold && isCompressed) {
            setIsCompressed(false);
        }
    });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <nav className={`${styles.wrapper} ${isCompressed ? styles.compressed : ''}`}>
                <div className={styles.logo}>Zenith</div>
                <button className={styles.menuBtn} onClick={toggleMenu}>
                    {isMenuOpen ? 'Close' : 'Menu'}
                </button>
            </nav>

            <div className={`${styles.overlay} ${isMenuOpen ? styles.open : ''}`}>
                <ul className={styles.menuList}>
                    <li className={styles.menuItem}>Work</li>
                    <li className={styles.menuItem}>Studio</li>
                    <li className={styles.menuItem}>News</li>
                    <li className={styles.menuItem}>Contact</li>
                </ul>
            </div>
        </>
    );
};

export default Navigation;
