import { useEffect, useRef, useState } from 'react';

function getPrefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export default function useCountUp(target, { duration = 1.2, decimals = 0 } = {}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const prefersReducedMotion = getPrefersReducedMotion();

  useEffect(() => {
    if (typeof target !== 'number' || Number.isNaN(target) || prefersReducedMotion) return;

    const startedAt = performance.now();
    const durationMs = duration * 1000;

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Number((target * eased).toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, decimals, prefersReducedMotion]);

  return prefersReducedMotion && typeof target === 'number' ? target : display;
}
