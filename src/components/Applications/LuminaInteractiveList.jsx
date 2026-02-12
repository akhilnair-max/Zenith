import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import styles from './LuminaInteractiveList.module.css';

// ... imports ...
import img1 from '../../assets/lumina-1.jpg';
import img2 from '../../assets/lumina-2.jpg';
import img3 from '../../assets/lumina-3.jpg';
import img4 from '../../assets/lumina-4.jpg';
import img5 from '../../assets/lumina-5.jpg';
import img6 from '../../assets/lumina-6.jpg';

export default function LuminaInteractiveList() {
    const containerRef = useRef(null);
    const userInteracted = useRef(false); // Track user interaction

    useEffect(() => {
        // ... config ...
        const SLIDER_CONFIG = {
            settings: {
                transitionDuration: 2.5, autoSlideSpeed: 5000, currentEffect: "glass",
                globalIntensity: 1.0, speedMultiplier: 1.0, distortionStrength: 1.0,
                glassRefractionStrength: 1.0, glassChromaticAberration: 1.0, glassBubbleClarity: 1.0, glassEdgeGlow: 1.0, glassLiquidFlow: 1.0,
            }
        };

        const slides = [
            { title: "Corporate & Office", description: "Precision-engineered internal partitions and acoustic glass systems.", media: img1 },
            { title: "Retail Facades", description: "High-clarity, low-iron glazing for maximizing visual engagement.", media: img2 },
            { title: "Hospitality", description: "Bespoke structural glass features for luxury environments.", media: img3 },
            { title: "Residential", description: "Custom laminated solutions for high-end architectural homes.", media: img4 },
            { title: "Structural", description: "Load-bearing glass beams and floors engineered for safety.", media: img5 },
            { title: "Design", description: "Textured and processed surfaces for unique visual effects.", media: img6 }
        ];

        // ... state ...
        let currentSlideIndex = 0;
        let isTransitioning = false;
        let shaderMaterial, renderer, scene, camera;
        let slideTextures = [];
        let texturesLoaded = false;
        let autoSlideTimer = null;
        let progressAnimation = null;
        let sliderEnabled = false;

        const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
        const PROGRESS_UPDATE_INTERVAL = 50;
        const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;

        // ... shaders (unchanged) ...
        const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
        const fragmentShader = `
            uniform sampler2D uTexture1, uTexture2;
            uniform float uProgress;
            uniform vec2 uResolution, uTexture1Size, uTexture2Size;
            uniform int uEffectType; // 0=glass
            uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength;
            uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
            varying vec2 vUv;

            vec2 getCoverUV(vec2 uv, vec2 textureSize) {
                vec2 s = uResolution / textureSize;
                float scale = max(s.x, s.y);
                vec2 scaledSize = textureSize * scale;
                vec2 offset = (uResolution - scaledSize) * 0.5;
                return (uv * uResolution - offset) / scaledSize;
            }
            
            vec4 glassEffect(vec2 uv, float progress) {
                float time = progress * 5.0 * uSpeedMultiplier;
                vec2 uv1 = getCoverUV(uv, uTexture1Size); vec2 uv2 = getCoverUV(uv, uTexture2Size);
                float maxR = length(uResolution) * 0.85; float br = progress * maxR;
                vec2 p = uv * uResolution; vec2 c = uResolution * 0.5;
                float d = length(p - c); float nd = d / max(br, 0.001);
                float param = smoothstep(br + 3.0, br - 3.0, d); // Inside circle
                vec4 img;
                if (param > 0.0) {
                     float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
                     vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
                     vec2 distUV = uv2 - dir * ro;
                     distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
                     float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
                     img = vec4(texture2D(uTexture2, distUV + dir * ca * 1.2).r, texture2D(uTexture2, distUV + dir * ca * 0.2).g, texture2D(uTexture2, distUV - dir * ca * 0.8).b, 1.0);
                     if (uGlassEdgeGlow > 0.0) {
                        float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
                        img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
                     }
                } else { img = texture2D(uTexture2, uv2); }
                vec4 oldImg = texture2D(uTexture1, uv1);
                if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
                return mix(oldImg, img, param);
            }

            void main() {
                gl_FragColor = glassEffect(vUv, uProgress);
            }
        `;

        // ... core functions ...
        const splitText = (text) => {
            return text.split('').map(char => `<span style="display: inline-block; opacity: 0;">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
        };

        const updateContent = (idx) => {
            const titleEl = document.getElementById('mainTitle');
            const descEl = document.getElementById('mainDesc');
            if (titleEl && descEl) {
                gsap.to(titleEl.children, { y: -20, opacity: 0, duration: 0.5, stagger: 0.02, ease: "power2.in" });
                gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in" });

                setTimeout(() => {
                    titleEl.innerHTML = splitText(slides[idx].title);
                    descEl.textContent = slides[idx].description;
                    gsap.set(titleEl.children, { y: 20, opacity: 0 });
                    gsap.set(descEl, { y: 20, opacity: 0 });

                    const children = titleEl.children;
                    gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                    gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                }, 500);
            }
        };

        const navigateToSlide = (targetIndex, isUserAction = false) => {
            if (isTransitioning || targetIndex === currentSlideIndex) return;

            if (isUserAction) {
                userInteracted.current = true;
                stopAutoSlideTimer();
            } else {
                stopAutoSlideTimer(); // Temporary stop for transition
            }

            quickResetProgress(currentSlideIndex);

            const currentTexture = slideTextures[currentSlideIndex];
            const targetTexture = slideTextures[targetIndex];
            if (!currentTexture || !targetTexture) return;

            isTransitioning = true;
            shaderMaterial.uniforms.uTexture1.value = currentTexture;
            shaderMaterial.uniforms.uTexture2.value = targetTexture;
            shaderMaterial.uniforms.uTexture1Size.value = currentTexture.userData.size;
            shaderMaterial.uniforms.uTexture2Size.value = targetTexture.userData.size;

            updateContent(targetIndex);

            currentSlideIndex = targetIndex;
            updateCounter(currentSlideIndex);
            updateNavigationState(currentSlideIndex);

            gsap.fromTo(shaderMaterial.uniforms.uProgress,
                { value: 0 },
                {
                    value: 1,
                    duration: TRANSITION_DURATION(),
                    ease: "power2.inOut",
                    onComplete: () => {
                        shaderMaterial.uniforms.uProgress.value = 0;
                        shaderMaterial.uniforms.uTexture1.value = targetTexture;
                        shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
                        isTransitioning = false;
                        if (!userInteracted.current) {
                            safeStartTimer(100);
                        }
                    }
                }
            );
        };

        const handleSlideChange = () => {
            if (isTransitioning || !texturesLoaded || !sliderEnabled || userInteracted.current) return;
            navigateToSlide((currentSlideIndex + 1) % slides.length);
        };

        const createSlidesNavigation = () => {
            const nav = containerRef.current.querySelector("." + styles.slidesNavigation); if (!nav) return;
            nav.innerHTML = "";
            slides.forEach((slide, i) => {
                const item = document.createElement("div");
                item.className = `${styles.slideNavItem} ${i === 0 ? styles.active : ""}`;
                item.dataset.slideIndex = String(i);

                const line = document.createElement("div");
                line.className = styles.slideProgressLine;
                const fill = document.createElement("div");
                fill.className = styles.slideProgressFill;
                line.appendChild(fill);

                const title = document.createElement("div");
                title.className = styles.slideNavTitle;
                title.textContent = slide.title;

                item.appendChild(line);
                item.appendChild(title);

                item.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (!isTransitioning && i !== currentSlideIndex) {
                        navigateToSlide(i, true); // User action = true
                    }
                });
                nav.appendChild(item);
            });
        };

        const updateNavigationState = (idx) => {
            const navItems = containerRef.current.querySelectorAll("." + styles.slideNavItem);
            navItems.forEach((el, i) => {
                if (i === idx) el.classList.add(styles.active);
                else el.classList.remove(styles.active);
            });
        };

        const updateSlideProgress = (idx, prog) => {
            const navItems = containerRef.current.querySelectorAll("." + styles.slideNavItem);
            const el = navItems[idx]?.querySelector("." + styles.slideProgressFill);
            if (el) { el.style.width = `${prog}%`; el.style.opacity = '1'; }
        };

        const fadeSlideProgress = (idx) => {
            const navItems = containerRef.current.querySelectorAll("." + styles.slideNavItem);
            const el = navItems[idx]?.querySelector("." + styles.slideProgressFill);
            if (el) { el.style.opacity = '0'; setTimeout(() => el.style.width = "0%", 300); }
        };

        const quickResetProgress = (idx) => {
            const navItems = containerRef.current.querySelectorAll("." + styles.slideNavItem);
            const el = navItems[idx]?.querySelector("." + styles.slideProgressFill);
            if (el) { el.style.transition = "width 0.2s ease-out"; el.style.width = "0%"; setTimeout(() => el.style.transition = "width 0.1s ease, opacity 0.3s ease", 200); }
        };

        const updateCounter = (idx) => {
            const sn = document.getElementById("slideNumber"); if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
            const st = document.getElementById("slideTotal"); if (st) st.textContent = String(slides.length).padStart(2, "0");
        };

        const startAutoSlideTimer = () => {
            if (!texturesLoaded || !sliderEnabled || userInteracted.current) return;
            stopAutoSlideTimer();
            let progress = 0;
            const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_INTERVAL;
            progressAnimation = setInterval(() => {
                if (!sliderEnabled || userInteracted.current) { stopAutoSlideTimer(); return; }
                progress += increment;
                updateSlideProgress(currentSlideIndex, progress);
                if (progress >= 100) {
                    clearInterval(progressAnimation); progressAnimation = null;
                    fadeSlideProgress(currentSlideIndex);
                    if (!isTransitioning) handleSlideChange();
                }
            }, PROGRESS_UPDATE_INTERVAL);
        };
        const stopAutoSlideTimer = () => { if (progressAnimation) clearInterval(progressAnimation); if (autoSlideTimer) clearTimeout(autoSlideTimer); progressAnimation = null; autoSlideTimer = null; };
        const safeStartTimer = (delay = 0) => { stopAutoSlideTimer(); if (sliderEnabled && texturesLoaded && !userInteracted.current) { if (delay > 0) autoSlideTimer = setTimeout(startAutoSlideTimer, delay); else startAutoSlideTimer(); } };

        const loadImageTexture = (src) => new Promise((resolve, reject) => {
            const l = new THREE.TextureLoader();
            l.load(src, (t) => { t.minFilter = t.magFilter = THREE.LinearFilter; t.userData = { size: new THREE.Vector2(t.image.width, t.image.height) }; resolve(t); }, undefined, (err) => { console.warn("Tex load err", err); resolve(null); });
        });

        const initRenderer = async () => {
            const canvas = containerRef.current.querySelector("." + styles.webglCanvas); if (!canvas) return;
            scene = new THREE.Scene(); camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
            renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            shaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 0 },
                    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                    uTexture1Size: { value: new THREE.Vector2(1, 1) }, uTexture2Size: { value: new THREE.Vector2(1, 1) },
                    uEffectType: { value: 0 },
                    uGlobalIntensity: { value: 1.0 }, uSpeedMultiplier: { value: 1.0 }, uDistortionStrength: { value: 1.0 },
                    uGlassRefractionStrength: { value: 1.0 }, uGlassChromaticAberration: { value: 1.0 }, uGlassBubbleClarity: { value: 1.0 }, uGlassEdgeGlow: { value: 1.0 }, uGlassLiquidFlow: { value: 1.0 },
                },
                vertexShader, fragmentShader
            });
            scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

            for (const s of slides) {
                const tex = await loadImageTexture(s.media);
                if (tex) slideTextures.push(tex);
                else {
                    // Fallback texture?
                }
            }

            if (slideTextures.length >= 2) {
                shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
                shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
                shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
                shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;
                texturesLoaded = true; sliderEnabled = true;
                safeStartTimer(500);
            }

            const render = () => { requestAnimationFrame(render); renderer.render(scene, camera); };
            render();
        };

        // Initial setup
        createSlidesNavigation(); updateCounter(0);

        const tEl = document.getElementById('mainTitle');
        const dEl = document.getElementById('mainDesc');
        if (tEl && dEl) {
            tEl.innerHTML = splitText(slides[0].title);
            dEl.textContent = slides[0].description;
            gsap.fromTo(tEl.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power3.out", delay: 0.5 });
            gsap.fromTo(dEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
        }

        initRenderer();

        const handleResize = () => { if (renderer) { renderer.setSize(window.innerWidth, window.innerHeight); shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight); } };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            stopAutoSlideTimer();
            if (renderer) renderer.dispose();
        };
    }, []);

    return (
        <main className={styles.sliderWrapper} ref={containerRef}>
            <canvas className={styles.webglCanvas}></canvas>
            <div className={styles.overlay}></div>
            <span className={styles.slideNumber} id="slideNumber">01</span>
            <span className={styles.slideTotal} id="slideTotal">06</span>

            <div className={styles.slideContent}>
                <h1 className={styles.slideTitle} id="mainTitle"></h1>
                <p className={styles.slideDescription} id="mainDesc"></p>
            </div>

            <nav className={styles.slidesNavigation}></nav>
        </main>
    );
}
