import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/useTheme';
import { vertexShader, fragmentShader } from './Background3DShaders';
import { uploadedImage4 } from '../utils/particleShapeImage4';

const PARTICLE_COUNT = 110000;
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

export default function Background3D({ activeDirection }) {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const sceneDataRef = useRef(null);
  const activeDirectionRef = useRef(activeDirection);
  
  useEffect(() => {
    activeDirectionRef.current = activeDirection;
    
    // If scene is loaded, update colors dynamically using original image colors
    if (sceneDataRef.current && sceneDataRef.current.validPoints && sceneDataRef.current.validPoints.length > 0) {
      const { targetColors, geometry, validPoints } = sceneDataRef.current;
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const point = validPoints[i % validPoints.length];
        
        if (point.col) {
          targetColors[i3] = point.col[0];
          targetColors[i3 + 1] = point.col[1];
          targetColors[i3 + 2] = point.col[2];
        }
      }
      geometry.attributes.targetColor.needsUpdate = true;
    }
  }, [activeDirection]);

  useEffect(() => {
    if (theme !== 'dark') return;
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targetPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const targetColors = new Float32Array(PARTICLE_COUNT * 3);
    const randomOffsets = new Float32Array(PARTICLE_COUNT * 3);
    
    const palette = getPalette(activeDirectionRef.current).map(parseColor);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Start scattered everywhere (explosion-like initial state)
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

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("targetPosition", new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("targetColor", new THREE.BufferAttribute(targetColors, 3));
    geometry.setAttribute("randomOffset", new THREE.BufferAttribute(randomOffsets, 3));

    const material = new THREE.ShaderMaterial({
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

    const points = new THREE.Points(geometry, material);
    points.visible = true; // Show scattered particles immediately
    
    // Position object exactly 36% from the right (64% from the left) on desktop, centered on mobile
    points.position.x = window.innerWidth > 1024 ? 3.121 * (window.innerWidth / window.innerHeight) : 0;
    
    scene.add(points);

    sceneDataRef.current = { 
      scene, camera, renderer, points, geometry, material, 
      originalPositions: positions.slice(), targetPositions, 
      originalColors: colors.slice(), targetColors,
      validPoints: []
    };

    const loadedShapes = { acgi: [], shape4: [], infinity: [] };

    const processImageToPoints = (imageUrl, { threshold = 15, zDepth = 3 } = {}) => {
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
          const maxDim = 300;
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
    };

    const generateInfinityShape = () => {
        const infPoints = [];
        const infScale = 30; 
        for (let i = 0; i < 40000; i++) { // Huge number of points for dense volume
            const t = (i / 40000) * Math.PI * 6; 
            const denom = 1 + Math.sin(t) * Math.sin(t); 
            let x = infScale * Math.cos(t) / denom; 
            let y = infScale * Math.sin(t) * Math.cos(t) / denom; 
            const verticalSpread = (Math.random() - 0.5) * 20; 
            const z = (Math.random() - 0.5) * 4 + Math.sin(t * 2) * 1.5; 
            const thickness = 6.0; 
            const offsetX = (Math.random() - 0.5) * thickness; 
            const offsetY = (Math.random() - 0.5) * thickness + verticalSpread * 0.3; 
            const offsetZ = (Math.random() - 0.5) * thickness * 0.3; 
            // Holographic gradient cycling along the curve: cyan -> blue -> purple -> magenta -> cyan
            const hue = (0.5 + (i / 40000) * 0.6 + Math.sin(t * 0.5) * 0.1) % 1.0;
            const color = new THREE.Color();
            color.setHSL(hue, 0.95, 0.45 + Math.random() * 0.15);
            // Scale down slightly to match ACGI size
            infPoints.push({ pos: [(x + offsetX)*0.45, (y + offsetY)*0.45, (z + offsetZ)*0.45], col: [color.r, color.g, color.b] }); 
        }
        return infPoints;
    };

    const applyShape = (shapeName) => {
        const pts = loadedShapes[shapeName];
        if (!pts || pts.length === 0 || !sceneDataRef.current) return;
        
        sceneDataRef.current.validPoints = pts;
        const { targetPositions, targetColors, geometry } = sceneDataRef.current;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const point = pts[i % pts.length];
            // Original jitter values
            targetPositions[i3] = point.pos[0] + (Math.random() - 0.5) * 0.4;
            targetPositions[i3 + 1] = point.pos[1] + (Math.random() - 0.5) * 0.4;
            targetPositions[i3 + 2] = point.pos[2] + (Math.random() - 0.5) * 1.5;
            
            // Use original image pixel colors, with 20% gold particles mixed in
            if (point.col) {
              if (Math.random() < 0.2) {
                // Gold accent particles
                const color = new THREE.Color();
                color.setHSL(0.12 + (Math.random() - 0.5) * 0.04, 0.9, 0.45 + Math.random() * 0.15);
                targetColors[i3] = color.r; 
                targetColors[i3 + 1] = color.g; 
                targetColors[i3 + 2] = color.b;
              } else {
                targetColors[i3] = point.col[0]; 
                targetColors[i3 + 1] = point.col[1]; 
                targetColors[i3 + 2] = point.col[2];
              }
            } else {
              // Fallback for generated shapes (infinity)
              const color = new THREE.Color();
              color.setHSL(0.55 + (Math.random() - 0.5) * 0.1, 0.9, 0.5);
              targetColors[i3] = color.r; 
              targetColors[i3 + 1] = color.g; 
              targetColors[i3 + 2] = color.b;
            }
        }
        geometry.attributes.targetPosition.needsUpdate = true;
        geometry.attributes.targetColor.needsUpdate = true;
    };

    let transitionState = 0; // 0 = stable, 1 = scattering, 2 = forming
    let currentShapeIndex = 0;
    // Cycle between Computer Architecture and infinity
    const shapeKeys = ['shape4', 'infinity'];
    let cycleInterval;

    processImageToPoints(uploadedImage4, { threshold: 35, zDepth: 5 }).then((pts2) => {
      loadedShapes.shape4 = pts2;
      loadedShapes.infinity = generateInfinityShape();
      
      // Set target shape (particles will converge from scattered state)
      applyShape('shape4');
      morphTarget = 1.0; // Signal the animate loop to start morphing
      
      // Start 5-second cycle after initial convergence completes
      setTimeout(() => {
        cycleInterval = setInterval(() => {
          transitionState = 1; // start scatter
          if (sceneDataRef.current) {
             sceneDataRef.current.material.uniforms.uEffectMode.value = 1;
          }
          
          setTimeout(() => {
              currentShapeIndex = (currentShapeIndex + 1) % shapeKeys.length;
              applyShape(shapeKeys[currentShapeIndex]);
              transitionState = 2; // start forming back
              
              setTimeout(() => {
                  transitionState = 0; // stable
              }, 1200);
          }, 1200);
        }, 5000);
      }, 1500); // Wait for initial convergence animation to finish
    });

    let time = 0;
    let effectIntensity = 0;
    let explosionAngle = 0;
    let morphTarget = 0; // Start at 0 (scattered), will ramp to 1 after images load
    let currentMorph = 0; // Smoothly follows morphTarget
    let rafId;

    const handleResize = () => {
      if (!sceneDataRef.current) return;
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      sceneDataRef.current.camera.aspect = newWidth / newHeight;
      sceneDataRef.current.camera.updateProjectionMatrix();
      sceneDataRef.current.renderer.setSize(newWidth, newHeight);
      
      // Update position responsively (36% from right)
      if (sceneDataRef.current.points) {
        sceneDataRef.current.points.position.x = newWidth > 1024 ? 3.121 * (newWidth / newHeight) : 0;
      }
    };

    window.addEventListener("resize", handleResize);

    // Mouse movement interaction (parallax)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Pause animation when scrolled out of view
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(container);
    
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      
      // Skip rendering when not visible (saves GPU while scrolling)
      if (!isVisible) return;
      
      time += 0.008;
      
      if (!sceneDataRef.current) return;
      const { renderer, scene, camera, points, material } = sceneDataRef.current;
      
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
      
      // Handle transition scattering intensity
      if (transitionState === 1) {
          effectIntensity += (4.0 - effectIntensity) * 0.15;
          explosionAngle += 0.08;
      } else if (transitionState === 2) {
          effectIntensity += (0.0 - effectIntensity) * 0.04;
          explosionAngle *= 0.92;
      } else {
          effectIntensity += (0.0 - effectIntensity) * 0.1;
          explosionAngle *= 0.85;
      }
      
      if (Math.abs(explosionAngle) < 0.001) explosionAngle = 0;
      
      points.rotation.y = targetX + explosionAngle;
      points.rotation.x = targetY + explosionAngle * 0.5;
      points.rotation.z = explosionAngle * 0.3;

      material.uniforms.uTime.value = time;
      
      // Smoothly animate morph from 0 (scattered) to 1 (formed)
      currentMorph += (morphTarget - currentMorph) * 0.15;
      material.uniforms.uMorph.value = currentMorph;
      
      material.uniforms.uEffectIntensity.value = effectIntensity;
      
      renderer.render(scene, camera);
    };
    
    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
      if (cycleInterval) clearInterval(cycleInterval);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme]);

  if (theme !== 'dark') return null;

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full pointer-events-none" 
      style={{ zIndex: 1, opacity: 0.72, height: '100vh' }}
    />
  );
}
