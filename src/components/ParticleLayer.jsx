import { useEffect, useRef } from 'react';
import { useTheme } from '../context/useTheme';

const PARTICLE_COUNT = 180;
const BASE_SPEED = 0.004;
const PROXIMITY_BOOST = 0.012;
const DIE_RADIUS = 18;
const COLORS = ['rgba(74, 158, 255, 0.72)', 'rgba(74, 158, 255, 0.42)', 'rgba(217, 119, 6, 0.48)'];

function createSeededRandom(seed = 1) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function respawnParticle(particle, width, height, random) {
  const edge = Math.floor(random() * 4);
  const depth = 0.35 + random() * 0.9;
  particle.depth = depth;
  particle.size = 0.8 + depth * 1.6;
  particle.color = COLORS[Math.floor(random() * COLORS.length)];

  if (edge === 0) {
    particle.x = -24;
    particle.y = random() * height;
  } else if (edge === 1) {
    particle.x = width + 24;
    particle.y = random() * height;
  } else if (edge === 2) {
    particle.x = random() * width;
    particle.y = -24;
  } else {
    particle.x = random() * width;
    particle.y = height + 24;
  }
}

function createParticles(width, height, random) {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const particle = {};
    respawnParticle(particle, width, height, random);
    particle.x = random() * width;
    particle.y = random() * height;
    return particle;
  });
}

export default function ParticleLayer() {
  const { theme } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (theme !== 'dark') return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const random = createSeededRandom(20260515);
    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    const smooth = { x: pointer.x, y: pointer.y };
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height, random);
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      smooth.x += (pointer.x - smooth.x) * 0.06;
      smooth.y += (pointer.y - smooth.y) * 0.06;

      for (const particle of particles) {
        const dx = smooth.x - particle.x;
        const dy = smooth.y - particle.y;
        const distance = Math.max(Math.hypot(dx, dy), 0.001);

        if (distance < DIE_RADIUS) {
          respawnParticle(particle, width, height, random);
          continue;
        }

        if (!reducedMotion) {
          const proximity = Math.max(0, 1 - distance / Math.max(width, height));
          const speed = (BASE_SPEED + PROXIMITY_BOOST * proximity) * particle.depth;
          particle.x += dx * speed;
          particle.y += dy * speed;
          particle.x += (random() - 0.5) * 0.16;
          particle.y += (random() - 0.5) * 0.16;
        }

        const alpha = 0.16 + 0.72 * Math.max(0, 1 - distance / 520);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw();

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [theme]);

  if (theme !== 'dark') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
