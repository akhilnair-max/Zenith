import React from 'react';
import styles from './CTA.module.css';

const CTA = () => {
    return (
        <section className={styles.section} id="contact">
            <h2 className={styles.headline}>Start a Conversation About Your Next Glass Requirement.</h2>
            <button className={styles.ctaButton}>Contact Zenith</button>
        </section>
    );
};

export default CTA;
