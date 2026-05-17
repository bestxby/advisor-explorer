import * as THREE from 'three';
import { vertexShader, fragmentShader } from '../components/Background3DShaders';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const PARTICLE_COUNT = 120000;
const particleSize = 212;

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

export class ThreeParticleEngine {
  constructor(container, theme, activeDirection) {
    this.container = container;
    this.theme = theme;
    this.activeDirection = activeDirection;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.time = 0;
    this.effectIntensity = 0;
    this.explosionAngle = 0;
    this.morphTarget = 0;
    this.currentMorph = 0;
    this.transitionState = 0; // 0 = stable, 1 = scattering, 2 = forming
    this.currentShapeIndex = 0;
    this.shapeKeys = ['shape4', 'infinity'];
    this.loadedShapes = { acgi: [], shape4: [], infinity: [] };
    this.validPoints = [];

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.isVisible = true;
    this.scratchColor = new THREE.Color();

    this.init();
  }

  init() {
    // 1. Scene and Camera Setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.1, 1000);
    this.adjustCameraZ();

    // 2. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // 3. Post-Processing / Bloom Setup
    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(this.width, this.height), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0.4;
    bloomPass.strength = 0.07;
    bloomPass.radius = 0.2;
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    // 4. Create Systems
    this.createAmbientDust();
    this.createMainParticles();
    this.setupEventListeners();
    this.startIntersectionObserver();

    // 5. Load and Cycle Shapes
    this.loadShapes();

    // 6. Start Render Loop
    this.animateBound = this.animate.bind(this);
    this.animateBound();
  }

  adjustCameraZ() {
    const aspect = this.width / this.height;
    if (aspect < 1.0) {
      // Scale camera Z distance in inverse proportion to the aspect ratio to fully fit
      // the wide particle shape inside narrow portrait mobile viewports without cropping.
      this.camera.position.z = 45 / aspect;
    } else {
      this.camera.position.z = 45;
    }
  }

  createAmbientDust() {
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 6000;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const colorObj = new THREE.Color();

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      dustPositions[i3] = (Math.random() - 0.5) * 100;
      dustPositions[i3 + 1] = (Math.random() - 0.5) * 100;
      dustPositions[i3 + 2] = (Math.random() - 0.5) * 100;
      
      const rand = Math.random();
      if (rand < 0.6) {
        colorObj.setHSL(0.58 + (Math.random() - 0.5) * 0.1, 0.9, 0.6 + Math.random() * 0.2);
      } else if (rand < 0.9) {
        colorObj.setHSL(0.75 + (Math.random() - 0.5) * 0.1, 0.8, 0.6 + Math.random() * 0.2);
      } else {
        colorObj.setHSL(0.12 + (Math.random() - 0.5) * 0.05, 0.8, 0.8 + Math.random() * 0.2);
      }
      
      dustColors[i3] = colorObj.r;
      dustColors[i3 + 1] = colorObj.g;
      dustColors[i3 + 2] = colorObj.b;
    }
    
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    
    const dustMaterial = new THREE.PointsMaterial({
      size: 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });
    this.dustParticles = new THREE.Points(dustGeometry, dustMaterial);
    this.scene.add(this.dustParticles);
  }

  createMainParticles() {
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    this.targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    this.targetColors = new Float32Array(PARTICLE_COUNT * 3);
    const randomOffsets = new Float32Array(PARTICLE_COUNT * 3);
    
    const palette = getPalette(this.activeDirection).map(parseColor);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 40;
      
      positions[i3] = x; positions[i3 + 1] = y; positions[i3 + 2] = z;
      this.targetPositions[i3] = x; this.targetPositions[i3 + 1] = y; this.targetPositions[i3 + 2] = z;
      
      randomOffsets[i3] = (Math.random() - 0.5) * 2;
      randomOffsets[i3 + 1] = (Math.random() - 0.5) * 2;
      randomOffsets[i3 + 2] = (Math.random() - 0.5) * 2;
      
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r; colors[i3 + 1] = color.g; colors[i3 + 2] = color.b;
      this.targetColors[i3] = color.r; this.targetColors[i3 + 1] = color.g; this.targetColors[i3 + 2] = color.b;
    }

    this.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute("targetPosition", new THREE.BufferAttribute(this.targetPositions, 3));
    this.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute("targetColor", new THREE.BufferAttribute(this.targetColors, 3));
    this.geometry.setAttribute("randomOffset", new THREE.BufferAttribute(randomOffsets, 3));

    this.material = new THREE.ShaderMaterial({
      vertexShader, 
      fragmentShader, 
      transparent: true,
      uniforms: { 
        uTime: { value: 0 }, 
        uMorph: { value: 0 }, 
        uPointSize: { value: particleSize }, 
        uEffectMode: { value: 0 }, 
        uEffectIntensity: { value: 0 }, 
        uExplosionTime: { value: 0 } 
      },
      depthWrite: false, 
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.visible = true;
    this.points.position.x = window.innerWidth > 1024 ? 3.121 * (window.innerWidth / window.innerHeight) : 0;
    
    this.scene.add(this.points);
  }

  processImageToPoints(imageUrl, { threshold = 15, zDepth = 3 } = {}) {
    return new Promise((resolve) => {
      if (!imageUrl) {
        resolve([]); return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxDim = 120;
        const aspect = img.width / img.height;
        const canvasW = aspect >= 1 ? maxDim : Math.round(maxDim * aspect);
        const canvasH = aspect >= 1 ? Math.round(maxDim / aspect) : maxDim;
        canvas.width = canvasW; canvas.height = canvasH;
        ctx.fillStyle = "black"; ctx.fillRect(0, 0, canvasW, canvasH);
        ctx.drawImage(img, 0, 0, canvasW, canvasH);
        
        const imgData = ctx.getImageData(0, 0, canvasW, canvasH).data;
        const valid = [];
        
        const worldSize = 38;
        const scaleX = aspect >= 1 ? worldSize : worldSize * aspect;
        const scaleY = aspect >= 1 ? worldSize / aspect : worldSize;
        
        for (let y = 0; y < canvasH; y++) {
          for (let x = 0; x < canvasW; x++) {
            const idx = (y * canvasW + x) * 4;
            const r = imgData[idx], g = imgData[idx + 1], b = imgData[idx + 2];
            if ((r + g + b) / 3 > threshold) {
              valid.push({ 
                pos: [(x / canvasW - 0.5) * scaleX, (0.5 - y / canvasH) * scaleY, ((r + g + b) / 765 - 0.5) * zDepth],
                col: [r / 255, g / 255, b / 255]
              });
            }
          }
        }
        resolve(valid);
      };
    });
  }

  generateInfinityShape() {
    const infPoints = [];
    const infScale = 30; 
    for (let i = 0; i < 12000; i++) {
      const t = (i / 12000) * Math.PI * 6; 
      const denom = 1 + Math.sin(t) * Math.sin(t); 
      let x = infScale * Math.cos(t) / denom; 
      let y = infScale * Math.sin(t) * Math.cos(t) / denom; 
      const verticalSpread = (Math.random() - 0.5) * 20; 
      const z = (Math.random() - 0.5) * 4 + Math.sin(t * 2) * 1.5; 
      const thickness = 6.0; 
      const offsetX = (Math.random() - 0.5) * thickness; 
      const offsetY = (Math.random() - 0.5) * thickness + verticalSpread * 0.3; 
      const offsetZ = (Math.random() - 0.5) * thickness * 0.3; 
      
      const hue = (0.5 + (i / 12000) * 0.6 + Math.sin(t * 0.5) * 0.1) % 1.0;
      this.scratchColor.setHSL(hue, 0.95, 0.45 + Math.random() * 0.15);
      
      infPoints.push({ pos: [(x + offsetX)*0.45, (y + offsetY)*0.45, (z + offsetZ)*0.45], col: [this.scratchColor.r, this.scratchColor.g, this.scratchColor.b] }); 
    }
    return infPoints;
  }

  applyShape(shapeName) {
    const pts = this.loadedShapes[shapeName];
    if (!pts || pts.length === 0) return;
    
    this.validPoints = pts;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const point = pts[i % pts.length];
      
      this.targetPositions[i3] = point.pos[0] + (Math.random() - 0.5) * 0.4;
      this.targetPositions[i3 + 1] = point.pos[1] + (Math.random() - 0.5) * 0.4;
      this.targetPositions[i3 + 2] = point.pos[2] + (Math.random() - 0.5) * 1.5;
      
      if (point.col) {
        if (Math.random() < 0.2) {
          this.scratchColor.setHSL(0.12 + (Math.random() - 0.5) * 0.04, 0.9, 0.45 + Math.random() * 0.15);
          this.targetColors[i3] = this.scratchColor.r; 
          this.targetColors[i3 + 1] = this.scratchColor.g; 
          this.targetColors[i3 + 2] = this.scratchColor.b;
        } else {
          this.targetColors[i3] = point.col[0]; 
          this.targetColors[i3 + 1] = point.col[1]; 
          this.targetColors[i3 + 2] = point.col[2];
        }
      } else {
        this.scratchColor.setHSL(0.55 + (Math.random() - 0.5) * 0.1, 0.9, 0.5);
        this.targetColors[i3] = this.scratchColor.r; 
        this.targetColors[i3 + 1] = this.scratchColor.g; 
        this.targetColors[i3 + 2] = this.scratchColor.b;
      }
    }
    this.geometry.attributes.targetPosition.needsUpdate = true;
    this.geometry.attributes.targetColor.needsUpdate = true;
  }

  loadShapes() {
    const shape4Url = `${import.meta.env.BASE_URL}shape4.jpg`;
    this.processImageToPoints(shape4Url, { threshold: 35, zDepth: 5 }).then((pts2) => {
      this.loadedShapes.shape4 = pts2;
      
      // Defer math-heavy infinity shape generation by 1.2s to prevent startup frame drop
      this.loadedShapes.infinity = [];
      this.infinityDeferredTimeout = setTimeout(() => {
        this.loadedShapes.infinity = this.generateInfinityShape();
      }, 1200);
      
      this.applyShape('shape4');
      this.morphTarget = 1.0;
      
      this.cycleTimeout = setTimeout(() => {
        this.cycleInterval = setInterval(() => {
          this.transitionState = 1;
          this.material.uniforms.uEffectMode.value = 1;
          
          setTimeout(() => {
            this.currentShapeIndex = (this.currentShapeIndex + 1) % this.shapeKeys.length;
            this.applyShape(this.shapeKeys[this.currentShapeIndex]);
            this.transitionState = 2;
            
            setTimeout(() => {
              this.transitionState = 0;
            }, 1200);
          }, 1200);
        }, 5000);
      }, 1500);
    });
  }

  updateDirection(direction) {
    this.activeDirection = direction;
    if (this.validPoints && this.validPoints.length > 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const point = this.validPoints[i % this.validPoints.length];
        
        if (point.col) {
          this.targetColors[i3] = point.col[0];
          this.targetColors[i3 + 1] = point.col[1];
          this.targetColors[i3 + 2] = point.col[2];
        }
      }
      this.geometry.attributes.targetColor.needsUpdate = true;
    }
  }

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
    this.composer.setSize(this.width, this.height);
    
    if (this.points) {
      this.points.position.x = this.width > 1024 ? 3.121 * (this.width / this.height) : 0;
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

  animate() {
    this.rafId = requestAnimationFrame(this.animateBound);
    
    if (!this.isVisible) return;
    
    this.time += 0.008;
    this.targetX = this.mouseX * 0.5;
    this.targetY = this.mouseY * 0.5;
    
    if (this.transitionState === 1) {
      this.effectIntensity += (4.0 - this.effectIntensity) * 0.15;
      this.explosionAngle += 0.08;
    } else if (this.transitionState === 2) {
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
    
    if (this.dustParticles) {
      this.dustParticles.rotation.y += 0.0005;
      this.dustParticles.rotation.x += 0.0002;
    }
    
    if (this.composer) {
      this.composer.render();
    }
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
    window.removeEventListener("resize", this.resizeBound);
    window.removeEventListener("mousemove", this.mouseMoveBound);
    cancelAnimationFrame(this.rafId);
    if (this.cycleTimeout) clearTimeout(this.cycleTimeout);
    if (this.cycleInterval) clearInterval(this.cycleInterval);
    if (this.infinityDeferredTimeout) clearTimeout(this.infinityDeferredTimeout);
    
    if (this.renderer && this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
    
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}
