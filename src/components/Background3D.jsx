import { useEffect, useRef } from 'react';
import { useTheme } from '../context/useTheme';
import { ThreeParticleEngine } from '../services/ThreeParticleEngine';

export default function Background3D({ activeDirection }) {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    if (theme !== 'dark') {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Instantiate the decoupled 3D particle engine service
    engineRef.current = new ThreeParticleEngine(container, theme, activeDirection);

    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Synchronize activeDirection changes to the particle engine in real-time
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateDirection(activeDirection);
    }
  }, [activeDirection]);

  if (theme !== 'dark') return null;

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 overflow-hidden pointer-events-none" 
      style={{ zIndex: 1, opacity: 0.72, width: '100vw', height: '100vh' }}
    />
  );
}
