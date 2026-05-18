import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../components/Background3DShaders';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import { detectHardwareQuality, getQualityProfile } from './HardwareProfile';
import { ShapeManager } from './ShapeManager';
import { AmbientDustSystem } from './AmbientDustSystem';

const particleSize = 120;

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

function parseColor(rgbaString) {
  const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return new THREE.Color(`rgb(${match[1]}, ${match[2]}, ${match[3]})`);
  }
  return new THREE.Color(0xffffff);
}

/**
 * ThreeParticleEngine — orchestrator for the 3D particle background.
 *
 * Delegates to:
 *   - HardwareProfile (quality detection)
 *   - AmbientDustSystem (background floating dust)
 *   - ShapeManager (shape loading, generation, morph cycling)
 *
 * Owns:
 *   - Scene / Camera / Renderer / Bloom (infrastructure)
 *   - Main particle BufferGeometry + ShaderMaterial
 *   - Mouse / resize / visibility event listeners
 *   - The animate() render loop
 *
 * External API (used by Background3D.jsx):
 *   - constructor(container, theme, activeDirection)
 *   - updateDirection(direction)
 *   - destroy()
 */
export class ThreeParticleEngine {
  constructor(container, theme, activeDirection) {
    this.container = container;
    this.activeDirection = activeDirection;

    // Hardware profiling (delegated)
    const quality = detectHardwareQuality();
    const profile = getQualityProfile(quality);
    this.particleCount = profile.particleCount;
    this.enableBloom = profile.enableBloom;
    this.pixelRatioCap = profile.pixelRatioCap;
    this.pointSizeMultiplier = profile.pointSizeMultiplier;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.time = 0;
    this.effectIntensity = 0;
    this.explosionAngle = 0;
    this.morphTarget = 0;
    this.currentMorph = 0;

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.isVisible = true;

    this.init(profile);
  }

  // ── Infrastructure setup ──────────────────────────────────────

  init(profile) {
    // 1. Scene and Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.1, 1000);
    this.adjustCameraZ();

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.pixelRatioCap);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // 3. Post-processing (conditional)
    if (this.enableBloom) {
      const renderScene = new RenderPass(this.scene, this.camera);
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 1.5, 0.4, 0.85);
      bloomPass.threshold = 0.4;
      bloomPass.strength = 0.07;
      bloomPass.radius = 0.2;
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(renderScene);
      this.composer.addPass(bloomPass);
    } else {
      this.composer = null;
    }

    // 4. Subsystems
    this.dustSystem = new AmbientDustSystem(this.scene, profile.dustCount);
    this.createMainParticles();
    this.shapeManager = new ShapeManager({
      geometry: this.geometry,
      particleCount: this.particleCount,
      material: this.material,
    });

    // 5. Events + visibility
    this.setupEventListeners();
    this.startIntersectionObserver();

    // 6. Load shapes and start cycling
    this.shapeManager.loadAndStartCycling((val) => { this.morphTarget = val; });

    // 7. Render loop
    this.animateBound = this.animate.bind(this);
    this.animateBound();
  }

  adjustCameraZ() {
    const aspect = this.width / this.height;
    this.camera.position.z = 45 * Math.max(1.0, 1.55 / aspect);
  }

  // ── Main particle system ──────────────────────────────────────

  createMainParticles() {
    this.geometry = new THREE.BufferGeometry();
    const count = this.particleCount;
    const positions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const targetColors = new Float32Array(count * 3);
    const randomOffsets = new Float32Array(count * 3);

    const palette = getPalette(this.activeDirection).map(parseColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 40;

      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      targetPositions[i3] = x; targetPositions[i3 + 1] = y; targetPositions[i3 + 2] = z;

      randomOffsets[i3] = (Math.random() - 0.5) * 2;
      randomOffsets[i3 + 1] = (Math.random() - 0.5) * 2;
      randomOffsets[i3 + 2] = (Math.random() - 0.5) * 2;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
      targetColors[i3] = color.r; targetColors[i3 + 1] = color.g; targetColors[i3 + 2] = color.b;
    }

    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("targetPosition", new THREE.BufferAttribute(targetPositions, 3));
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute("targetColor", new THREE.BufferAttribute(targetColors, 3));
    this.geometry.setAttribute("randomOffset", new THREE.BufferAttribute(randomOffsets, 3));

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uMorph: { value: 0 },
        uPointSize: { value: particleSize * this.pointSizeMultiplier },
        uEffectMode: { value: 0 },
        uEffectIntensity: { value: 0 },
        uExplosionTime: { value: 0 }
      },
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.visible = true;
    this.points.position.x = window.innerWidth > 1024 ? 3.6 : 0;

    this.scene.add(this.points);
  }

  // ── Direction theme switching ─────────────────────────────────

  updateDirection(direction) {
    this.activeDirection = direction;
    const palette = getPalette(direction).map(parseColor);
    const count = this.particleCount;

    if (this.geometry && this.geometry.attributes.color && this.geometry.attributes.targetColor) {
      const colorsAttr = this.geometry.attributes.color.array;
      const targetColorsAttr = this.geometry.attributes.targetColor.array;

      colorsAttr.set(targetColorsAttr);
      this.geometry.attributes.color.needsUpdate = true;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const color = palette[Math.floor(Math.random() * palette.length)];
        targetColorsAttr[i3] = color.r;
        targetColorsAttr[i3 + 1] = color.g;
        targetColorsAttr[i3 + 2] = color.b;
      }
      this.geometry.attributes.targetColor.needsUpdate = true;

      this.currentMorph = 0.0;
      this.morphTarget = 1.0;
    }
  }

  // ── Events ────────────────────────────────────────────────────

  setupEventListeners() {
    this.resizeBound = this.handleResize.bind(this);
    this.mouseMoveBound = this.handleMouseMove.bind(this);

    window.addEventListener("resize", this.resizeBound);
    window.addEventListener('mousemove', this.mouseMoveBound);
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.adjustCameraZ();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    if (this.enableBloom && this.composer) {
      this.composer.setSize(this.width, this.height);
    }

    if (this.points) {
      this.points.position.x = this.width > 1024 ? 3.6 : 0;
    }
  }

  handleMouseMove(event) {
    this.mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
    this.mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
  }

  startIntersectionObserver() {
    this.observer = new IntersectionObserver(
      ([entry]) => { this.isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    this.observer.observe(this.container);
  }

  // ── Render loop ───────────────────────────────────────────────

  animate() {
    this.rafId = requestAnimationFrame(this.animateBound);

    if (!this.isVisible) return;

    this.time += 0.008;
    this.targetX = this.mouseX * 0.5;
    this.targetY = this.mouseY * 0.5;

    // Transition state from ShapeManager
    const ts = this.shapeManager.transitionState;
    if (ts === 1) {
      this.effectIntensity += (4.0 - this.effectIntensity) * 0.15;
      this.explosionAngle += 0.08;
    } else if (ts === 2) {
      this.effectIntensity += (0.0 - this.effectIntensity) * 0.04;
      this.explosionAngle *= 0.92;
    } else {
      this.effectIntensity += (0.0 - this.effectIntensity) * 0.1;
      this.explosionAngle *= 0.85;
    }

    if (Math.abs(this.explosionAngle) < 0.001) this.explosionAngle = 0;

    if (this.points) {
      this.points.rotation.y = this.targetX + this.explosionAngle;
      this.points.rotation.x = this.targetY + this.explosionAngle * 0.5;
      this.points.rotation.z = this.explosionAngle * 0.3;
    }

    if (this.material) {
      this.material.uniforms.uTime.value = this.time;
      this.currentMorph += (this.morphTarget - this.currentMorph) * 0.15;
      this.material.uniforms.uMorph.value = this.currentMorph;
      this.material.uniforms.uEffectIntensity.value = this.effectIntensity;
    }

    // Delegate dust rotation to subsystem
    this.dustSystem.update();

    if (this.enableBloom && this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ── Cleanup ───────────────────────────────────────────────────

  destroy() {
    // Events
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.resizeBound);
    window.removeEventListener("mousemove", this.mouseMoveBound);
    cancelAnimationFrame(this.rafId);

    // Subsystems — each handles its own timers/resources
    this.shapeManager.destroy();
    this.dustSystem.destroy();

    // Renderer DOM
    if (this.renderer && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }

    // Core resources
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}
