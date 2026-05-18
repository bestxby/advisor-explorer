import { useEffect, useRef } from 'react';
import { ScrollAnimationService } from '../services/ScrollAnimationService';

const SELECTORS = {
  kpi: '[data-animate="kpi"]',
  tabbar: '[data-animate="tabbar"]',
};

/**
 * useScrollAnimations Hook — pure declarative interface to manage scroll & reveal effects.
 *
 * All low-level DOM reads, writes, and performance optimizations are delegated
 * to ScrollAnimationService.
 */
export default function useScrollAnimations({ activeTab }) {
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (ScrollAnimationService.getPrefersReducedMotion()) return undefined;

    const cleanups = [];

    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      // KPI cards and tab bar: reveal immediately with stagger (no observer)
      ScrollAnimationService.instantReveal(
        ScrollAnimationService.queryAll(SELECTORS.kpi),
        {
          transform: 'translate3d(0, 40px, 0) scale(0.96)',
          stagger: 20,
        }
      );
      ScrollAnimationService.instantReveal(
        ScrollAnimationService.queryAll(SELECTORS.tabbar),
        {
          transform: 'translate3d(0, 20px, 0)',
          stagger: 0,
        }
      );
    }

    if (activeTab === 'professors') {
      cleanups.push(
        ScrollAnimationService.observeReveal(
          ScrollAnimationService.queryAll('[data-animate="professor-card"]'),
          {
            transform: 'translate3d(0, 36px, 0) scale(0.98)',
            stagger: 15,
          }
        )
      );
    }

    if (activeTab === 'directions') {
      cleanups.push(
        ScrollAnimationService.observeReveal(
          ScrollAnimationService.queryAll('[data-animate="direction-row"]'),
          {
            transform: 'translate3d(0, 22px, 0)',
            stagger: 35,
          }
        )
      );
    }

    // Set up high performance scroll parallax and header blur
    const parallaxCleanup = ScrollAnimationService.setupParallaxAndBlur({
      headerSelector: '[data-animate="header"]',
      filterBarSelector: '[data-filterbar]',
      contentWrapperId: 'content-wrapper',
    });
    cleanups.push(parallaxCleanup);

    return () => {
      cleanups.forEach((fn) => fn?.());
    };
  }, [activeTab]);
}
