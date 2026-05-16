# Advisor Explorer

计算机体系结构研究方向智能匹配平台。通过 8 个研究方向的深度对比、导师档案展示和个性化问卷，帮助你找到最适合的导师和研究方向。

**在线体验：** [https://bestxby.github.io/advisor-explorer/](https://bestxby.github.io/advisor-explorer/)

## 功能

- **个性化问卷匹配** — 多维度性格测试，加权算法推荐最佳方向 Top 3
- **8 个研究方向对比** — AI 编译器、RISC-V、FPGA、LLM 加速、存算一体、神经形态等
- **导师档案卡** — 研究方向、代表论文、技术栈、推荐资源、起步项目
- **行动路线图** — 分阶段课程规划和学习资源
- **一键导出** — Markdown 格式匹配报告，含排名、导师详情和路线图
- **深色模式** — 自动跟随系统主题，支持手动切换
- **响应式设计** — 移动端、平板、桌面端自适应布局

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | React 19 |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 4 |
| 测试 | Vitest + Testing Library |
| 代码规范 | ESLint + Prettier |
| 部署 | GitHub Actions → GitHub Pages |

## 快速开始

```bash
# 克隆项目
git clone https://github.com/bestxby/advisor-explorer.git
cd advisor-explorer

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:5173/advisor-explorer/`

## 常用命令

```bash
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run preview    # 本地预览构建产物
npm run lint       # ESLint 检查
npm run test:run   # 运行全部测试
npm run format     # Prettier 格式化
```

## 项目结构

```
src/
├── components/
│   ├── direction/      # 方向对比表
│   ├── filter/         # 筛选与排序控件
│   ├── layout/         # 页面布局组件
│   ├── professor/      # 导师档案卡子组件
│   ├── quiz/           # 问卷流程组件
│   └── roadmap/        # 行动路线图组件
├── config/             # UI 配置（Tab 定义等）
├── context/            # React Context（主题、筛选状态）
├── data/               # 静态 JSON 数据
├── hooks/              # 自定义 Hooks
├── utils/              # 纯函数工具（匹配、排序、统计、导出）
└── __tests__/          # 测试文件
```

## 数据

应用数据全部来自 `src/data/` 目录下的 JSON 文件：

| 文件 | 内容 |
|------|------|
| `directions.json` | 8 个研究方向详情、难度、就业、风险 |
| `professors.json` | 导师信息、论文、资源、评价 |
| `quiz.json` | 问卷题目、选项、匹配规则 |
| `roadmap.json` | 各方向阶段路线图和推荐资源 |

修改数据即可更新应用内容，无需改动代码。

## 部署

项目通过 GitHub Actions 自动部署。推送到 `master` 分支后自动触发构建和发布。

工作流程：`npm ci` → `lint` → `test` → `build` → 部署到 GitHub Pages

## License

MIT
