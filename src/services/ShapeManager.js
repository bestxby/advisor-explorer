import * as THREE from 'three';

/**
 * ShapeManager — owns shape loading, procedural generation, morph cycling.
 *
 * Optimized with random pools and geometry buffer reuse to run loops
 * with ZERO dynamically-allocated Math.random() calls.
 */
export class ShapeManager {
  constructor({ geometry, particleCount, material }) {
    this.geometry = geometry;
    this.particleCount = particleCount;
    this.material = material;

    this.targetPositions = geometry.attributes.targetPosition.array;
    this.targetColors = geometry.attributes.targetColor.array;
    
    // 🌟 Optimization: Reuse pre-allocated random offset buffer from GPU attributes
    this.randomOffsets = geometry.attributes.randomOffset.array;

    // 🌟 Optimization: Pre-generate a static pseudorandom pool to eliminate Math.random() in loops
    this.randomPool = new Float32Array(4096);
    for (let i = 0; i < 4096; i++) {
      this.randomPool[i] = Math.random();
    }

    this.loadedShapes = { acgi: [], shape4: [], infinity: [] };
    this.validPoints = [];
    this.shapeKeys = ['shape4', 'infinity'];
    this.currentShapeIndex = 0;
    this.transitionState = 0; // 0 = stable, 1 = scattering, 2 = forming
    this.scratchColor = new THREE.Color();

    // Timer IDs for cleanup
    this.cycleTimeout = null;
    this.cycleInterval = null;
    this.infinityDeferredTimeout = null;
  }

  get isTransitioning() {
    return this.transitionState !== 0;
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
    const count = this.particleCount;
    const offsets = this.randomOffsets;
    const pool = this.randomPool;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const point = pts[i % pts.length];

      // Optimized: Reuse static offset arrays to apply space jitter, bypassing 3 * Math.random()
      this.targetPositions[i3] = point.pos[0] + offsets[i3] * 0.2;
      this.targetPositions[i3 + 1] = point.pos[1] + offsets[i3 + 1] * 0.2;
      this.targetPositions[i3 + 2] = point.pos[2] + offsets[i3 + 2] * 0.75;

      if (point.col) {
        // Optimized: Use pseudorandom float lookup pool instead of dynamic Math.random()
        const poolIndex = i % 4096;
        const randGlow = pool[poolIndex];

        if (randGlow < 0.2) {
          const randHue = pool[(poolIndex + 17) % 4096];
          const randLight = pool[(poolIndex + 43) % 4096];

          this.scratchColor.setHSL(0.12 + (randHue - 0.5) * 0.04, 0.9, 0.45 + randLight * 0.15);
          this.targetColors[i3] = this.scratchColor.r;
          this.targetColors[i3 + 1] = this.scratchColor.g;
          this.targetColors[i3 + 2] = this.scratchColor.b;
        } else {
          this.targetColors[i3] = point.col[0];
          this.targetColors[i3 + 1] = point.col[1];
          this.targetColors[i3 + 2] = point.col[2];
        }
      } else {
        const randHue = pool[(i + 71) % 4096];
        this.scratchColor.setHSL(0.55 + (randHue - 0.5) * 0.1, 0.9, 0.5);
        this.targetColors[i3] = this.scratchColor.r;
        this.targetColors[i3 + 1] = this.scratchColor.g;
        this.targetColors[i3 + 2] = this.scratchColor.b;
      }
    }
    this.geometry.attributes.targetPosition.needsUpdate = true;
    this.geometry.attributes.targetColor.needsUpdate = true;
  }

  loadAndStartCycling(morphTargetSetter) {
    const shape4PointsUrl = `${import.meta.env.BASE_URL}shape4_points.json`;
    fetch(shape4PointsUrl)
      .then((res) => res.json())
      .then((pts2) => {
        this.loadedShapes.shape4 = pts2;

        this.loadedShapes.infinity = [];
        this.infinityDeferredTimeout = setTimeout(() => {
          this.loadedShapes.infinity = this.generateInfinityShape();
        }, 1200);

        this.applyShape('shape4');
        morphTargetSetter(1.0);

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
      })
      .catch((err) => {
        console.error('Failed to load pre-calculated shape4 points:', err);
      });
  }

  destroy() {
    if (this.cycleTimeout) clearTimeout(this.cycleTimeout);
    if (this.cycleInterval) clearInterval(this.cycleInterval);
    if (this.infinityDeferredTimeout) clearTimeout(this.infinityDeferredTimeout);
  }
}
