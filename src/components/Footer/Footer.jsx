import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.mainContent}>
                <h2 className={styles.headline}>Better Together</h2>
                <p className={styles.description}>
                    We collaborate with visionary architects, consultants, and contractors to build the systemic infrastructures shaping tomorrow's skyline. Reach out to Zenith® to explore strategic opportunities and create lasting impact together.
                </p>
                <a href="#contact" className={styles.ctaButton}>
                    Get in Touch <ArrowUpRight size={16} />
                </a>
            </div>

            <div className={styles.bottomBar}>
                <div className={styles.copyright}>
                    <p>© 2026 ZENITH®. All rights reserved.</p>
                    <p>Transparency by design. Innovation for impact.</p>
                </div>

                <div className={styles.social}>
                    <a href="#" className={styles.link}>Join us on LinkedIn <ArrowUpRight size={14} /></a>
                </div>

                <div className={styles.links}>
                    <a href="#" className={styles.link}>Privacy Policy <ArrowUpRight size={14} /></a>
                    <a href="#" className={styles.link}>Cookie Policy <ArrowUpRight size={14} /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
