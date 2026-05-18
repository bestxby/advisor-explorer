# 🤖 AI Agent Codebase Guidelines & Engineering Contracts

Welcome, AI Agent! You are pairing on the **Advisor Explorer** codebase.
This project is built using a highly decoupled, performance-tuned, and modular React 19 + Three.js stack. To keep this repository elegant, resilient to regression bugs, and blazing-fast, you **MUST** strictly adhere to the following architectural contracts and constraints.

---

## 🧭 1. Architectural Guardrails (Absolute Limits)

* **📏 File Size Limit (Rule of 300)**: **No single file may exceed 300 lines of code**. If your new feature, service, or component grows beyond this limit, you **MUST** decompose it into dedicated modular files immediately.
* **📦 No Raw Data Coupling**: Never import JSON files (e.g. `professors.json`, `directions.json`) directly into React components or lifecycle hooks. You **MUST** query them via the unified [DataRepository.js](file:///d:/advisor-explorer/advisor-explorer/src/services/DataRepository.js) class:
  ```javascript
  import { DataRepository } from '../services/DataRepository';
  const quiz = DataRepository.getQuiz();
  ```
* **🚫 Zero Raw DOM Queries in UI**: Do not write `document.querySelector` or raw scroll event bindings inside React views or common hooks. All hardware-bound scrolling, parallax, blur effects, or viewport observer triggers **MUST** be encapsulated inside [ScrollAnimationService.js](file:///d:/advisor-explorer/advisor-explorer/src/services/ScrollAnimationService.js).

---

## 🌌 2. WebGL & GPU Memory Management (Zero-Leak Policy)

When components unmount or research directions shift, WebGL buffers can easily leak and crash browser tabs. You must follow the **WebGL Cascade Lifetime** pattern:

* **💥 Disposing Geometries & Materials**: All interactive particle shapes and dust arrays created via Three.js must be recursively disposed. The `ThreeParticleEngine.destroy()` method propagates destruction down to subsystems:
  ```javascript
  // Mandatory unmount pipeline inside ThreeParticleEngine:
  if (this.geometry) this.geometry.dispose();
  if (this.material) this.material.dispose();
  if (this.renderer) {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
  ```
* **⚡ High-Performance Morph Loop**: Never allocate Float32Arrays or call `Math.random()` inside the active render requestAnimationFrame (`animate()`) loop. You **MUST** use pre-built random pools (like `this.randomPool` inside `ShapeManager`) and leverage pre-allocated GPU `BufferAttribute` targets to bypass CPU micro-stuttering.
* **🎨 Branchless Shader Optimization**: Never write dynamic conditional branches inside fragment shaders that require pixel `discard`. Always use branchless blending functions like `smoothstep()` paired with `AdditiveBlending` to let integrated GPUs leverage hardware **Early-Z / TBDR** tile-based rejection pipelines.

---

## 🎨 3. Chameleon Variable Theming System

The app morphs global color aesthetics on-the-fly based on the active matched or filtered research direction.
* The orchestrator sets the `data-active-theme="[theme]"` attribute on the `#content-wrapper` node.
* CSS variables in [index.css](file:///d:/advisor-explorer/advisor-explorer/src/index.css) automatically override the primary accent gradients:
  * Theme `default` $\rightarrow$ Teal/Blue (`--theme-accent-primary`)
  * Theme `ai-compiler` $\rightarrow$ Cyan/Emerald
  * Theme `llm-system` $\rightarrow$ Indigo/Violet
  * Theme `edge-ai` $\rightarrow$ Lime/NeonGreen
* Always use CSS Chameleon tokens (`var(--theme-accent-primary)`) rather than hardcoded Tailwind color overrides to ensure theme synchronization.

---

## 🧪 4. Testing, Building & Verification Guardrails

Before declaring your task done, you **MUST** run the following verification pipeline:

1. **一键数据体检 (CLI Validation)**:
   ```bash
   npm run validate-data
   ```
   Ensures that your data edits across `professors.json`, `directions.json`, `quiz.json`, and `roadmap.json` contain no broken referential IDs, out-of-range weights, or missing required attributes.
2. **Vitest Unit Regression Checks**:
   ```bash
   npm run test:run
   ```
   Vibe check: 8/8 test suites must pass 100% green.
3. **Vite Production Bundler**:
   ```bash
   npm run build
   ```
   Guarantees that your JS imports, lazy-load boundaries, and shaders compile successfully for web deployment.

*By respecting these rules, you keep this codebase robust, clean, and futuristic!*
