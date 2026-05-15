import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function useCountUp(target, { duration = 1.2, decimals = 0 } = {}) {
  const [display, setDisplay] = useState(0);
  const proxyRef = useRef({ value: 0 });

  useEffect(() => {
    if (typeof target !== 'number' || Number.isNaN(target)) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplay(target);
      return;
    }

    proxyRef.current.value = 0;
    gsap.to(proxyRef.current, {
      value: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplay(Number(proxyRef.current.value.toFixed(decimals)));
      },
    });

    return () => {
      gsap.killTweensOf(proxyRef.current);
    };
  }, [target, duration, decimals]);

  return display;
}
