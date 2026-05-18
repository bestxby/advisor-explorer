import * as THREE from 'three';

/**
 * AmbientDustSystem — creates and manages the background floating dust particles.
 *
 * Cleanup: call destroy() to dispose geometry/material and remove from scene.
 */
export class AmbientDustSystem {
  constructor(scene, dustCount) {
    this.scene = scene;
    this.dustParticles = null;

    if (dustCount <= 0) return;

    const dustGeometry = new THREE.BufferGeometry();
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

  /** Called each frame from the main animate loop. */
  update() {
    if (this.dustParticles) {
      this.dustParticles.rotation.y += 0.0005;
      this.dustParticles.rotation.x += 0.0002;
    }
  }

  destroy() {
    if (this.dustParticles) {
      this.scene.remove(this.dustParticles);
      this.dustParticles.geometry?.dispose();
      this.dustParticles.material?.dispose();
      this.dustParticles = null;
    }
  }
}
