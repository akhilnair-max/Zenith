import React from 'react';
import LuminaInteractiveList from './LuminaInteractiveList';
// import styles from './Applications.module.css'; // Styles handled within LuminaInteractiveList

const Applications = () => {
    return (
        <section id="applications" style={{ position: 'relative', zIndex: 5 }}>
            <LuminaInteractiveList />
        </section>
    );
};

export default Applications;
