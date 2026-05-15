import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HEADER_VIEWPORT_THRESHOLD } from '../constants';

// Fallback: if GSAP animation doesn't fire, clear inline styles after timeout
function ensureVisible(selector, timeout = 2000) {
  const els = Array.from(document.querySelectorAll(selector));
  if (els.length === 0) return undefined;
  const timer = setTimeout(() => {
    els.forEach((el) => {
      if (gsap.getProperty(el, 'opacity') === 0) gsap.set(el, { clearProps: 'all' });
    });
  }, timeout);
  return () => clearTimeout(timer);
}

gsap.registerPlugin(ScrollTrigger);

const SELECTORS = {
  kpi: '[data-animate="kpi"]',
  tabbar: '[data-animate="tabbar"]',
  quiz: '[data-animate="quiz"]',
};

function queryAll(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function animateOnScroll(el, fromVars, toVars) {
  const rect = el.getBoundingClientRect();
  const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
  const tween = gsap.fromTo(el, fromVars, { ...toVars, paused: true });
  if (inViewport) {
    tween.play();
  } else {
    ScrollTrigger.create({
      trigger: el,
      start: `top ${HEADER_VIEWPORT_THRESHOLD}%`,
      onEnter: () => tween.play(),
    });
  }
}

export default function useScrollAnimations({ activeTab, refreshKey = 0 }) {
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cleanups = [];

    const ctx = gsap.context(() => {
      // KPI + TabBar — first load only
      if (isFirstLoad.current) {
        isFirstLoad.current = false;

        const kpiCards = queryAll(SELECTORS.kpi);
        if (kpiCards.length > 0) {
          // Spring overshoot for KPI — organic alive feel
          gsap.fromTo(
            kpiCards,
            { y: 40, opacity: 0, scale: 0.92 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.9,
              stagger: 0.1,
              ease: 'back.out(1.4)',
              scrollTrigger: {
                trigger: kpiCards[0].parentElement,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            },
          );
        }

        const tabBar = document.querySelector(SELECTORS.tabbar);
        if (tabBar) {
          gsap.fromTo(
            tabBar,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: tabBar,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            },
          );
        }
      }

      // Header parallax — Lusion spatial depth: elements move at different speeds
      const header = document.querySelector('[data-animate="header"]');
      if (header) {
        const parallaxSlow = header.querySelectorAll('[data-parallax="slow"]');
        const parallaxMed = header.querySelectorAll('[data-parallax="med"]');
        const parallaxFast = header.querySelectorAll('[data-parallax="fast"]');

        if (parallaxSlow.length) {
          gsap.to(parallaxSlow, {
            y: -60,
            ease: 'none',
            scrollTrigger: {
              trigger: header,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        }
        if (parallaxMed.length) {
          gsap.to(parallaxMed, {
            y: -120,
            ease: 'none',
            scrollTrigger: {
              trigger: header,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.5,
            },
          });
        }
        if (parallaxFast.length) {
          gsap.to(parallaxFast, {
            y: -180,
            ease: 'none',
            scrollTrigger: {
              trigger: header,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.3,
            },
          });
        }
      }

      // Lusion-style scroll snap between header and content
      const contentWrapper = document.getElementById('content-wrapper');
      if (contentWrapper) {
        ScrollTrigger.create({
          trigger: contentWrapper,
          start: 'top bottom',
          end: 'top top',
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.6, max: 1.0 },
            ease: 'power3.inOut',
            delay: 0.05,
          },
        });
      }

      // Content — professor cards: elastic spring reveal
      if (activeTab === 'professors') {
        const cards = queryAll('[data-animate="professor-card"]');
        if (cards.length > 0) {
          gsap.set(cards, { y: 48, opacity: 0, scale: 0.95 });
          cleanups.push(ensureVisible('[data-animate="professor-card"]'));
          ScrollTrigger.batch(cards, {
            onEnter: (elements) => {
              gsap.to(elements, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.9,
                stagger: 0.12,
                ease: 'elastic.out(1, 0.7)',
                overwrite: true,
              });
            },
            start: 'top 88%',
          });
        }
      }

      // Content — directions table rows: subtle slide-in
      if (activeTab === 'directions') {
        const rows = queryAll('[data-animate="direction-row"]');
        if (rows.length > 0) {
          gsap.set(rows, { y: 24, opacity: 0 });
          cleanups.push(ensureVisible('[data-animate="direction-row"]'));
          ScrollTrigger.batch(rows, {
            onEnter: (elements) => {
              gsap.to(elements, {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.06,
                ease: 'power2.out',
                overwrite: true,
              });
            },
            start: 'top 90%',
          });
        }
      }

      // Content — quiz panel entrance
      if (activeTab === 'quiz') {
        const quizEl = document.querySelector(SELECTORS.quiz);
        if (quizEl) {
          animateOnScroll(
            quizEl,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
          );
        }
      }

      // FilterBar dynamic depth blur — subtle, based on scroll position
      const filterBar = document.querySelector('[data-filterbar]');
      if (filterBar && contentWrapper) {
        ScrollTrigger.create({
          trigger: contentWrapper,
          start: 'top 80%',
          end: 'top 30%',
          onUpdate: (self) => {
            const blur = 12 + self.progress * 14; // 12px → 26px
            filterBar.style.backdropFilter = `blur(${blur}px)`;
          },
        });
      }

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn?.());
    };
  }, [activeTab, refreshKey]);
}
