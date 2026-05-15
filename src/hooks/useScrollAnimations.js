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
          gsap.fromTo(
            kpiCards,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              stagger: 0.08,
              ease: 'power2.out',
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
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: tabBar,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            },
          );
        }
      }

      // Content — professor cards stagger animation
      if (activeTab === 'professors') {
        const cards = queryAll('[data-animate="professor-card"]');
        if (cards.length > 0) {
          gsap.set(cards, { y: 60, opacity: 0, scale: 0.95 });
          cleanups.push(ensureVisible('[data-animate="professor-card"]'));
          ScrollTrigger.batch(cards, {
            onEnter: (elements) => {
              gsap.to(elements, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                overwrite: true,
              });
            },
            start: 'top 85%',
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

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn?.());
    };
  }, [activeTab, refreshKey]);
}
