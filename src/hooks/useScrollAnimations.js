import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SELECTORS = {
  header: '[data-animate="header"]',
  kpi: '[data-animate="kpi"]',
  tabbar: '[data-animate="tabbar"]',
  professorCard: '[data-animate="professor-card"]',
  directionRow: '[data-animate="direction-row"]',
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
    // Already visible — play immediately (one-time on load)
    tween.play();
  } else {
    // Below fold — play when scrolled into view
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      onEnter: () => tween.play(),
    });
  }
}

function animateCollection(selector, fromVars, toVars) {
  queryAll(selector).forEach(el => {
    animateOnScroll(el, fromVars, toVars);
  });
}

export default function useScrollAnimations({ activeTab, refreshKey = 0 }) {
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header parallax
      const header = document.querySelector(SELECTORS.header);
      if (header) {
        gsap.to(header, {
          yPercent: 25,
          opacity: 0.4,
          ease: 'none',
          scrollTrigger: {
            trigger: header,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }

      // KPI + TabBar — first load only
      if (isFirstLoad.current) {
        isFirstLoad.current = false;

        const kpiCards = queryAll(SELECTORS.kpi);
        if (kpiCards.length > 0) {
          gsap.fromTo(kpiCards,
            { y: 30, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out',
              scrollTrigger: {
                trigger: kpiCards[0].parentElement,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        const tabBar = document.querySelector(SELECTORS.tabbar);
        if (tabBar) {
          gsap.fromTo(tabBar,
            { y: 20, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.5, ease: 'power2.out',
              scrollTrigger: {
                trigger: tabBar,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      }

      // Content — each element independent scroll trigger
      if (activeTab === 'professors') {
        animateCollection(
          SELECTORS.professorCard,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      } else if (activeTab === 'directions') {
        animateCollection(
          SELECTORS.directionRow,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      } else if (activeTab === 'quiz') {
        const quizEl = document.querySelector(SELECTORS.quiz);
        if (quizEl) {
          animateOnScroll(quizEl,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
          );
        }
      }

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
    };
  }, [activeTab, refreshKey]);
}
