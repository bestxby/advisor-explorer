# 🗺️ Advisor Explorer 核心架构说明文档 (AI-Friendly Architecture)

> **AI 助手阅读指南**：在开始进行任何局部代码修改或新特征开发之前，请**务必先阅读并理解**此文档。它规定了整个系统的领域边界、数据流向以及核心接口协议，任何重构或新增逻辑均不得打破此设计约定。

---

## 1. 系统核心分层设计

本系统采用严格的 **页面 (Page) → 模块 (Module) → 组件 (Component) & 领域服务 (Service) → 状态模型 (Model)** 分层设计，禁止跨层调用和逆向数据流。

```
                       ┌──────────────────────┐
                       │      Index.html      │
                       └──────────┬───────────┘
                                  ▼
                       ┌──────────────────────┐
                       │     App / Context    │ (全局状态 / 主题上下文)
                       └──────────┬───────────┘
                                  ▼
                       ┌──────────────────────┐
                       │    AppPanels.jsx     │ (面板编排中枢)
                       └─────┬──────────┬─────┘
                             │          │
        ┌────────────────────┘          └────────────────────┐
        ▼                                                    ▼
┌──────────────┐                                     ┌──────────────┐
│ ActTwoPanel  │ (第二幕模块)                         │ActThreePanel │ (第三幕模块)
└──────┬───────┘                                     └──────┬───────┘
       │                                                    │
       ├─────────────────────────┐                          ├─────────────────────────┐
       ▼                         ▼                          ▼                         ▼
┌──────────────┐         ┌──────────────┐           ┌──────────────┐         ┌──────────────┐
│  QuizSection │         │RoadmapSection│           │ProfessorList │         │DirectionTable│
└──────────────┘         └──────────────┘           └──────────────┘         └──────────────┘
       │                                                    │
       ▼                                                    ▼
┌──────────────┐                                     ┌──────────────┐
│MatchingEngine│ (测评服务)                           │ ScrollAnim   │ (视差滚动服务)
└──────────────┘                                     └──────────────┘
```

---

## 2. 核心目录与职责契约

* `src/context/`：
  * **职责**：维护全局过滤器状态 (`useFilter.js`) 和页面级变色龙主题状态 (`useTheme.js`)。通过 React Context 向下分发。
* `src/components/layout/`：
  * **职责**：包含 `AppPanels.jsx`，以及两个解耦的主干视图面板组件 `ActTwoPanel.jsx`（掌控第二幕的测评状态流转）与 `ActThreePanel.jsx`（掌控第三幕的页签探索）。
* `src/hooks/`：
  * **职责**：充当粘合剂（Bridge Hooks）。只维护声明式副作用，**禁止**直接写底层 DOM 操纵或纯算法。
* `src/services/`：
  * **职责**：**系统的核心大脑**。纯 JavaScript 类或无状态工具包，与 React 完全解耦，支持独立测试。

---

## 3. 核心领域服务契约 (Service Contracts)

### 🧠 3.1 核心数据仓储服务 (DataRepository)
* **路径**：[DataRepository.js](file:///d:/advisor-explorer/advisor-explorer/src/services/DataRepository.js)
* **契约协议**：
  ```javascript
  import { DataRepository } from '../services/DataRepository';

  const quiz = DataRepository.getQuiz();
  const professors = DataRepository.getProfessors();
  const directions = DataRepository.getDirections();
  const roadmap = DataRepository.getRoadmap(directionId);
  ```
  * **作用**：解耦组件对底层本地静态 `.json` 资产的强硬依赖。未来若迁移至真正的 REST/GraphQL 后端 API 接口，仅需重写此类，即可实现全站 UI 与测试用例的零改动热插拔！

### 🧠 3.2 学术特征匹配服务 (MatchingEngine)
* **路径**：[MatchingEngine.js](file:///d:/advisor-explorer/advisor-explorer/src/services/MatchingEngine.js)
* **契约协议**：
  ```javascript
  import { MatchingEngine } from '../services/MatchingEngine';

  const engine = new MatchingEngine({ quiz, professors, directions });
  const matches = engine.findMatches(selectedTags: string[]);
  // 返回: { direction, score, rawScore, rank, directionName, professors: string[], strengths[], cautions[] }[]
  ```

### 🌌 3.3 3D 粒子特效中枢 (ThreeParticleEngine)
* **路径**：[ThreeParticleEngine.js](file:///d:/advisor-explorer/advisor-explorer/src/services/ThreeParticleEngine.js)
* **契约协议**：
  ```javascript
  import { ThreeParticleEngine } from '../services/ThreeParticleEngine';

  const engine = new ThreeParticleEngine(domContainer, theme, activeDirection);
  engine.updateDirection(newDirection); // 触发变色龙转场形态与调色盘切换
  engine.destroy(); // 🚨 释放所有 GPU Buffer, Material, Geometry, WebGLContext 以防内存泄漏
  ```

### 🏃 3.4 滚动特效服务 (ScrollAnimationService)
* **路径**：[ScrollAnimationService.js](file:///d:/advisor-explorer/advisor-explorer/src/services/ScrollAnimationService.js)
* **契约协议**：
  ```javascript
  import { ScrollAnimationService } from '../services/ScrollAnimationService';

  // 1. 实现全站硬件级 RAF 节流滚动视差与模糊
  const cleanup = ScrollAnimationService.setupParallaxAndBlur({
    headerSelector,
    filterBarSelector,
    contentWrapperId
  });
  
  // 2. 视口曝光淡入动效
  const cleanupObserver = ScrollAnimationService.observeReveal(domElements, { transform, stagger });
  ```

---

## 4. 全站设计标记与主题契约 (Design Tokens)

* **全局变量**：均统一定义在 [index.css](file:///d:/advisor-explorer/advisor-explorer/src/index.css) 中。
* **变色龙引擎工作机制**：
  页面包裹器节点 `#content-wrapper` 会依据当前触发的学派主题，被动态挂载 `data-active-theme="[theme]"` 属性。CSS 变量会依据该属性自动覆盖全站的主题高亮色与微光扩散 Orb：
  * `default`：科幻湛蓝 `#0ea5e9`
  * `ai-compiler`：量子青碧 `#22d3ee`
  * `llm-system`：极客霓紫 `#a78bfa`
  * `edge-ai`：极光荧绿 `#a3e635`

---

## 5. 开发规范约束

1. **零内存泄漏**：凡是引入 Canvas 绘制或 Three.js 互动的模块，在销毁时**必须**依次调用 `geometry.dispose()`、`material.dispose()` 并注销事件监听与 RAF。
2. **零裸 DOM 直操**：任何 React UI 视图层**禁止**直接通过 `document.querySelector` 修改样式，必须经过 `ScrollAnimationService` 进行领域收敛。
3. **单一职责**：任何单一文件的代码行数严格控制在 **300 行以下**。
