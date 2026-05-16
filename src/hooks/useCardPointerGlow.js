import { useCallback, useRef } from 'react';

export default function useCardPointerGlow() {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((event) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cardRef.current.style.setProperty('--card-mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--card-mouse-y', `${y}px`);
  }, []);

  return { cardRef, handleMouseMove };
}
