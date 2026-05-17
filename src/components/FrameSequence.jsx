import { useEffect, useRef } from 'react';

const FRAME_COUNT = 88;
const FRAME_DELAY = 16; // ms
const FRAME_PATH = `${import.meta.env.BASE_URL}consequense/frame_`;
const PRELOAD_BATCH = 8;

function padIndex(i) {
  return String(i).padStart(2, '0');
}

export default function FrameSequence({ activeDirection }) {
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const indexRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const frames = framesRef.current;
    let destroyed = false;
    let lastTick = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const loadFrame = (i) => {
      if (frames[i]) return Promise.resolve();
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (!destroyed) frames[i] = img;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = `${FRAME_PATH}${padIndex(i)}_delay-0.034s.webp`;
      });
    };

    const drawFrame = (i) => {
      const img = frames[i];
      if (!img) return;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const scale = Math.max(cw / img.width, ch / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const tick = (now) => {
      if (destroyed) return;
      if (now - lastTick >= FRAME_DELAY) {
        lastTick = now;
        drawFrame(indexRef.current);
        indexRef.current = (indexRef.current + 1) % FRAME_COUNT;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Load first batch then start
    Promise.all(
      Array.from({ length: PRELOAD_BATCH }, (_, i) => loadFrame(i)),
    ).then(() => {
      if (destroyed) return;
      resize();
      drawFrame(0);

      if (!reducedMotion) {
        rafRef.current = requestAnimationFrame(tick);
      }

      // Load remaining frames in background
      for (let i = PRELOAD_BATCH; i < FRAME_COUNT; i += 1) {
        loadFrame(i);
      }
    });

    window.addEventListener('resize', resize, { passive: true });

    return () => {
      destroyed = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const getHueRotation = (direction) => {
    switch (direction) {
      case 'ai-compiler': return 'hue-rotate(130deg)';
      case 'llm-system': return 'hue-rotate(-170deg)';
      case 'edge-ai': return 'hue-rotate(-110deg)';
      default: return 'hue-rotate(0deg)';
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full mix-blend-screen"
      style={{ 
        objectFit: 'cover', 
        filter: getHueRotation(activeDirection),
        transition: 'filter 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
      }}
      aria-hidden="true"
    />
  );
}
