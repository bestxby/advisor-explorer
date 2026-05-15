import { useEffect, useRef } from 'react';
import { HEADER_VIEWPORT_THRESHOLD } from '../constants';

const SELECTORS = {
  kpi: '[data-animate="kpi"]',
  tabbar: '[data-animate="tabbar"]',
};

function getPrefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function queryAll(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function prepareElement(el, transform) {
  el.style.opacity = '0';
  el.style.transform = transform;
  el.style.transition = 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)';
  el.style.willChange = 'opacity, transform';
}

function revealElement(el, delay = 0) {
  window.setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translate3d(0, 0, 0) scale(1)';
    el.style.willChange = 'auto';
  }, delay);
}

function instantReveal(elements, { transform = 'translate3d(0, 28px, 0)', stagger = 60 } = {}) {
  elements.forEach((el, i) => {
    prepareElement(el, transform);
    revealElement(el, i * stagger + 30);
  });
}

function observeReveal(elements, { transform = 'translate3d(0, 28px, 0)', stagger = 60 } = {}) {
  if (elements.length === 0) return undefined;

  elements.forEach((el) => prepareElement(el, transform));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = elements.indexOf(entry.target);
        revealElement(entry.target, Math.max(index, 0) * stagger);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: `0px 0px -${100 - HEADER_VIEWPORT_THRESHOLD}% 0px`, threshold: 0.05 },
  );

  elements.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

export default function useScrollAnimations({ activeTab, refreshKey = 0 }) {
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (getPrefersReducedMotion()) return undefined;

    const cleanups = [];

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      // KPI cards and tab bar: reveal immediately with stagger (no observer)
      instantReveal(queryAll(SELECTORS.kpi), {
        transform: 'translate3d(0, 40px, 0) scale(0.96)',
        stagger: 90,
      });
      instantReveal(queryAll(SELECTORS.tabbar), {
        transform: 'translate3d(0, 20px, 0)',
        stagger: 0,
      });
    }

    if (activeTab === 'professors') {
      cleanups.push(
        observeReveal(queryAll('[data-animate="professor-card"]'), {
          transform: 'translate3d(0, 36px, 0) scale(0.98)',
          stagger: 70,
        }),
      );
    }

    if (activeTab === 'directions') {
      cleanups.push(
        observeReveal(queryAll('[data-animate="direction-row"]'), {
          transform: 'translate3d(0, 22px, 0)',
          stagger: 35,
        }),
      );
    }

    const header = document.querySelector('[data-animate="header"]');
    const filterBar = document.querySelector('[data-filterbar]');
    const contentWrapper = document.getElementById('content-wrapper');
    let rafId = 0;

    const updateScrollEffects = () => {
      rafId = 0;

      if (header) {
        const rect = header.getBoundingClientRect();
        const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
        header.querySelectorAll('[data-parallax="slow"]').forEach((el) => {
          el.style.transform = `translate3d(0, ${progress * -60}px, 0)`;
        });
        header.querySelectorAll('[data-parallax="med"]').forEach((el) => {
          el.style.transform = `translate3d(0, ${progress * -120}px, 0)`;
        });
        header.querySelectorAll('[data-parallax="fast"]').forEach((el) => {
          el.style.transform = `translate3d(0, ${progress * -180}px, 0)`;
        });
      }

      if (filterBar && contentWrapper) {
        const rect = contentWrapper.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        const progress = Math.min(Math.max((viewport * 0.8 - rect.top) / (viewport * 0.5), 0), 1);
        filterBar.style.backdropFilter = `blur(${12 + progress * 14}px)`;
      }
    };

    const requestUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateScrollEffects);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });

    return () => {
      cleanups.forEach((fn) => fn?.());
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [activeTab, refreshKey]);
}
