import { HEADER_VIEWPORT_THRESHOLD } from '../constants';

/**
 * ScrollAnimationService — encapsulates DOM mutations, viewport measurements,
 * and high-performance RAF scroll parallax/filter logic.
 *
 * This keeps hook/UI files clean of direct document query selectors and CSS styling logic.
 */
export class ScrollAnimationService {
  static getPrefersReducedMotion() {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  static queryAll(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  static queryOne(selector) {
    return document.querySelector(selector);
  }

  static prepareElement(el, transform) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = transform;
    el.style.transition = 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.willChange = 'opacity, transform';
  }

  static revealElement(el, delay = 0) {
    if (!el) return;
    window.setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translate3d(0, 0, 0) scale(1)';
      el.style.willChange = 'auto';
    }, delay);
  }

  static instantReveal(elements, { transform = 'translate3d(0, 28px, 0)', stagger = 60 } = {}) {
    elements.forEach((el, i) => {
      this.prepareElement(el, transform);
      this.revealElement(el, i * stagger + 30);
    });
  }

  static observeReveal(elements, { transform = 'translate3d(0, 28px, 0)', stagger = 60 } = {}) {
    if (elements.length === 0) return () => {};

    elements.forEach((el) => this.prepareElement(el, transform));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = elements.indexOf(entry.target);
          this.revealElement(entry.target, Math.max(index, 0) * stagger);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: `0px 0px -${100 - HEADER_VIEWPORT_THRESHOLD}% 0px`, threshold: 0.05 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }

  static setupParallaxAndBlur({ headerSelector, filterBarSelector, contentWrapperId }) {
    let rafId = 0;

    const updateScrollEffects = () => {
      rafId = 0;
      const header = this.queryOne(headerSelector);
      const filterBar = this.queryOne(filterBarSelector);
      const contentWrapper = document.getElementById(contentWrapperId);

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
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }
}
