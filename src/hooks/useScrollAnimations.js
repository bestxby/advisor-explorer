import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
      start: 'top 92%',
      onEnter: () => tween.play(),
    });
  }
}

export default function useScrollAnimations({ activeTab, refreshKey = 0 }) {
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
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

      // Content — quiz panel entrance
      if (activeTab === 'quiz') {
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
