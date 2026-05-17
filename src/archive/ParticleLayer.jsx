import { useEffect, useRef } from 'react';
import { useTheme } from '../context/useTheme';

const PARTICLE_COUNT = 150;
const POINTER_RADIUS = 230;
const POINTER_REPEL_FORCE = 0.18;
const POINTER_SWIRL_FORCE = 0.1;
const WANDER_FORCE = 0.016;
const DRAG = 0.984;
const MAX_SPEED = 1.45;
const RESEED_RADIUS = 12;
const OFFSCREEN_MARGIN = 80;
const LINK_DISTANCE = 116;
const MAX_LINKS_PER_PARTICLE = 3;
const ENERGY_LANE_COUNT = 84;
const PARALLAX_STRENGTH = 18;
const ORTHOGONAL_BLEND = 0.08;
const DIRECTION_PALETTES = {
  default: [
    'rgba(56, 189, 248, 0.86)',
    'rgba(34, 211, 238, 0.72)',
    'rgba(167, 139, 250, 0.64)',
    'rgba(52, 211, 153, 0.58)',
  ],
  'ai-compiler': [
    'rgba(244, 114, 182, 0.86)',
    'rgba(192, 132, 252, 0.72)',
    'rgba(96, 165, 250, 0.64)',
    'rgba(45, 212, 191, 0.58)',
  ],
  'llm-system': [
    'rgba(250, 204, 21, 0.86)',
    'rgba(251, 146, 60, 0.72)',
    'rgba(248, 113, 113, 0.64)',
    'rgba(167, 139, 250, 0.58)',
  ],
  'edge-ai': [
    'rgba(163, 230, 53, 0.86)',
    'rgba(74, 222, 128, 0.72)',
    'rgba(45, 212, 191, 0.64)',
    'rgba(56, 189, 248, 0.58)',
  ]
};

const getPalette = (direction) => DIRECTION_PALETTES[direction] || DIRECTION_PALETTES.default;

function createSeededRandom(seed = 1) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function respawnParticle(particle, width, height, random, currentDirection) {
  const edge = Math.floor(random() * 4);
  const z = random();
  const depth = 0.38 + z * 1.24;
  particle.z = z;
  particle.depth = depth;
  particle.size = 0.7 + z * 3.2;
  const palette = getPalette(currentDirection);
  particle.color = palette[Math.floor(random() * palette.length)];
  particle.age = 0;
  particle.life = 420 + random() * 620;
  particle.spin = random() > 0.5 ? 1 : -1;
  particle.phase = random() * Math.PI * 2;
  particle.bottomBias = random() > 0.35;
  particle.axis = Math.floor(random() * 8);

  if (particle.bottomBias && random() > 0.3) {
    particle.x = random() * width;
    particle.y = height * (0.5 + random() * 0.56);
    particle.vx = (random() - 0.5) * 0.72;
    particle.vy = -0.26 - random() * 0.36;
  } else if (edge === 0) {
    particle.x = -24;
    particle.y = random() * height;
    particle.vx = 0.12 + random() * 0.34;
    particle.vy = (random() - 0.5) * 0.4;
  } else if (edge === 1) {
    particle.x = width + 24;
    particle.y = random() * height;
    particle.vx = -0.12 - random() * 0.34;
    particle.vy = (random() - 0.5) * 0.4;
  } else if (edge === 2) {
    particle.x = random() * width;
    particle.y = -24;
    particle.vx = (random() - 0.5) * 0.4;
    particle.vy = 0.12 + random() * 0.34;
  } else {
    particle.x = random() * width;
    particle.y = height + 24;
    particle.vx = (random() - 0.5) * 0.4;
    particle.vy = -0.12 - random() * 0.34;
  }
}

function createParticles(width, height, random, currentDirection) {
  return Array.from({ length: PARTICLE_COUNT }, () => {
    const particle = {};
    respawnParticle(particle, width, height, random, currentDirection);
    particle.x = random() * width;
    particle.y = random() > 0.45 ? height * (0.5 + random() * 0.5) : random() * height;
    const angle = (Math.floor(random() * 8) * Math.PI) / 4;
    const speed = 0.25 + particle.z * 1.05;
    particle.vx = Math.cos(angle) * speed;
    particle.vy = Math.sin(angle) * speed;
    particle.age = random() * particle.life;
    return particle;
  });
}

function getScreenPosition(particle, parallax) {
  const parallaxDepth = 0.35 + particle.z * 0.9;
  return {
    x: particle.x + parallax.x * parallaxDepth,
    y: particle.y + parallax.y * parallaxDepth,
  };
}

function alignVelocityToTraceGrid(particle) {
  const speed = Math.hypot(particle.vx, particle.vy);
  if (speed < 0.001) return;

  const snappedAngle = Math.round(Math.atan2(particle.vy, particle.vx) / (Math.PI / 4)) * (Math.PI / 4);
  const targetVx = Math.cos(snappedAngle) * speed;
  const targetVy = Math.sin(snappedAngle) * speed;
  particle.vx += (targetVx - particle.vx) * ORTHOGONAL_BLEND;
  particle.vy += (targetVy - particle.vy) * ORTHOGONAL_BLEND;
}

function drawTraceLink(ctx, from, to, alpha, width) {
  const midX = from.x + (to.x - from.x) * 0.5;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = width;
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.92)';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(midX, from.y);
  ctx.lineTo(midX, to.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
}

function drawEnergyLanes(ctx, width, height, frame, palette) {
  const baseY = height * 0.44;
  ctx.lineCap = 'round';

  for (let lane = 0; lane < ENERGY_LANE_COUNT; lane += 1) {
    const row = lane % 14;
    const band = Math.floor(lane / 14);
    const y = baseY + row * 24 + band * 9;
    const offset = (frame * (0.72 + row * 0.035 + band * 0.06) + lane * 37) % (width + 260);
    const startX = offset - 230;
    const endX = startX + 96 + band * 14;
    const verticalStep = (lane % 2 === 0 ? 16 : -16) + (band % 3) * 5;

    ctx.globalAlpha = 0.05 + row * 0.01 + band * 0.02;
    ctx.lineWidth = 0.55 + (band % 3) * 0.12;
    ctx.strokeStyle = lane % 2 === 0 ? palette[1] : (palette[3] || palette[0]);
    ctx.beginPath();
    ctx.moveTo(Math.max(0, startX - 88), y);
    ctx.lineTo(Math.min(width, startX + 16), y);
    ctx.lineTo(Math.min(width, startX + 56), y + verticalStep);
    ctx.lineTo(Math.min(width, endX), y + verticalStep);
    ctx.lineTo(Math.min(width, endX + 38), y + verticalStep + (lane % 3 === 0 ? -12 : 12));
    ctx.stroke();
  }
}

export default function ParticleLayer({ activeDirection }) {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  const activeDirectionRef = useRef(activeDirection);

  useEffect(() => {
    activeDirectionRef.current = activeDirection;
  }, [activeDirection]);

  useEffect(() => {
    if (theme !== 'dark') return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const random = createSeededRandom(20260515);
    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5, active: false, idle: true };
    const smooth = { x: pointer.x, y: pointer.y };
    const parallax = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = 0;
    let frame = 0;
    
    let idleTimeout = null;
    const IDLE_DELAY = 3000;
    let scrollY = window.scrollY;
    let targetScrollY = scrollY;
    let scrollVelocity = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = createParticles(width, height, random, activeDirectionRef.current);
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
      pointer.idle = false;
      parallax.targetX = -(event.clientX / Math.max(window.innerWidth, 1) - 0.5) * PARALLAX_STRENGTH;
      parallax.targetY = -(event.clientY / Math.max(window.innerHeight, 1) - 0.5) * PARALLAX_STRENGTH * 0.7;
      
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        pointer.idle = true;
      }, IDLE_DELAY);
    };
    
    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      const bottomGlow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.8,
        0,
        width * 0.5,
        height * 0.8,
        Math.max(width, height) * 0.8,
      );
      bottomGlow.addColorStop(0, 'rgba(34, 211, 238, 0.08)');
      bottomGlow.addColorStop(0.4, 'rgba(59, 130, 246, 0.04)');
      bottomGlow.addColorStop(0.8, 'rgba(168, 85, 247, 0.015)');
      bottomGlow.addColorStop(1, 'rgba(2, 6, 18, 0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, 0, width, height);
      drawEnergyLanes(ctx, width, height, frame, getPalette(activeDirectionRef.current));

      if (pointer.active) {
        smooth.x += (pointer.x - smooth.x) * 0.18;
        smooth.y += (pointer.y - smooth.y) * 0.18;
        parallax.x += (parallax.targetX - parallax.x) * 0.08;
        parallax.y += (parallax.targetY - parallax.y) * 0.08;
      }

      scrollVelocity += (targetScrollY - scrollY) * 0.08;
      scrollY += scrollVelocity;
      scrollVelocity *= 0.85;
      const scrollEffectY = scrollVelocity * 0.05;

      const currentWanderForce = pointer.idle ? WANDER_FORCE * 0.25 : WANDER_FORCE;
      const breatheScale = pointer.idle ? 1 + Math.sin(frame * 0.03) * 0.15 : 1;

      for (const particle of particles) {
        // Apply scroll spatial movement
        particle.y -= scrollEffectY * (0.5 + particle.z * 1.5);
        particle.x += scrollEffectY * particle.spin * 0.2; // Slight diverging on scroll
      
        const screen = getScreenPosition(particle, parallax);
        const dx = screen.x - smooth.x;
        const dy = screen.y - smooth.y;
        const distance = pointer.active ? Math.max(Math.hypot(dx, dy), 0.001) : Infinity;
        const outOfBounds =
          particle.x < -OFFSCREEN_MARGIN ||
          particle.x > width + OFFSCREEN_MARGIN ||
          particle.y < -OFFSCREEN_MARGIN ||
          particle.y > height + OFFSCREEN_MARGIN;

        particle.age += 1;

        if ((pointer.active && distance < RESEED_RADIUS) || particle.age > particle.life || outOfBounds) {
          respawnParticle(particle, width, height, random, activeDirectionRef.current);
          continue;
        }

        if (!reducedMotion) {
          const wave = particle.age * 0.018 + particle.phase;
          particle.vx += Math.cos(wave) * currentWanderForce * particle.depth + (random() - 0.5) * 0.004;
          particle.vy += Math.sin(wave * 1.17) * currentWanderForce * particle.depth + (random() - 0.5) * 0.004;

          if (pointer.idle) {
             // Breathing subtle movement
             particle.vx += Math.cos(particle.phase + frame * 0.01) * 0.01;
             particle.vy += Math.sin(particle.phase + frame * 0.01) * 0.01;
          } else if (pointer.active && distance < POINTER_RADIUS) {
            const nx = dx / distance;
            const ny = dy / distance;
            const proximity = 1 - distance / POINTER_RADIUS;
            const force = proximity * proximity * (0.75 + particle.z * 1.25);
            particle.vx += nx * POINTER_REPEL_FORCE * force + -ny * POINTER_SWIRL_FORCE * particle.spin * force;
            particle.vy += ny * POINTER_REPEL_FORCE * force + nx * POINTER_SWIRL_FORCE * particle.spin * force;
          }

          alignVelocityToTraceGrid(particle);
          particle.vx *= DRAG;
          particle.vy *= DRAG;

          const speed = Math.hypot(particle.vx, particle.vy);
          const maxSpeed = MAX_SPEED * (0.58 + particle.z * 0.72);
          if (speed > maxSpeed) {
            const scale = maxSpeed / speed;
            particle.vx *= scale;
            particle.vy *= scale;
          }

          particle.x += particle.vx;
          particle.y += particle.vy;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        const particleScreen = getScreenPosition(particle, parallax);
        let links = 0;

        for (let j = i + 1; j < particles.length; j += 1) {
          if (links >= MAX_LINKS_PER_PARTICLE) break;
          const neighbor = particles[j];
          const neighborScreen = getScreenPosition(neighbor, parallax);

          const dx = particleScreen.x - neighborScreen.x;
          const dy = particleScreen.y - neighborScreen.y;
          const distance = Math.hypot(dx, dy);
          if (distance > LINK_DISTANCE) continue;

          const lowerWeight = Math.min(Math.max((particle.y + neighbor.y) / (height * 2), 0), 1);
          const proximity = 1 - distance / LINK_DISTANCE;
          const depthWeight = (particle.z + neighbor.z) * 0.5;
          const alpha = proximity * proximity * lowerWeight * (0.08 + depthWeight * 0.28);
          const lineWidth = 0.3 + proximity * proximity * (0.4 + depthWeight * 1.35);
          drawTraceLink(ctx, particleScreen, neighborScreen, alpha, lineWidth);
          links += 1;
        }
      }

      for (const particle of particles) {
        const screen = getScreenPosition(particle, parallax);
        const dx = screen.x - smooth.x;
        const dy = screen.y - smooth.y;
        const distance = pointer.active ? Math.max(Math.hypot(dx, dy), 0.001) : Infinity;

        const lifeProgress = particle.age / particle.life;
        const lifeFade = Math.min(lifeProgress * 6, 1, (1 - lifeProgress) * 6);
        const pointerGlow = pointer.active ? Math.max(0, 1 - distance / POINTER_RADIUS) : 0;
        const verticalBoost = 0.6 + Math.min(Math.max((particle.y) / height, 0), 1) * 0.6;
        const alpha = (0.3 + 0.42 * pointerGlow) * verticalBoost * Math.max(0, lifeFade);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;

        if (!reducedMotion && particle.depth > 0.9) {
          ctx.lineWidth = particle.size * 0.72;
          ctx.strokeStyle = particle.color;
          ctx.globalAlpha = alpha * 0.34;
          ctx.beginPath();
          ctx.moveTo(screen.x, screen.y);
          ctx.lineTo(screen.x - particle.vx * 12, screen.y - particle.vy * 12);
          ctx.stroke();
          ctx.globalAlpha = alpha;
        }

        const currentSize = particle.size * breatheScale;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        if (particle.depth > 1.05) {
          ctx.globalAlpha = alpha * 0.2;
          ctx.beginPath();
          ctx.arc(screen.x, screen.y, currentSize * 2.7, 0, Math.PI * 2);
          ctx.fill();
        }
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
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      if (idleTimeout) clearTimeout(idleTimeout);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [theme]);

  if (theme !== 'dark') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, opacity: 0.72 }}
      aria-hidden="true"
    />
  );
}
