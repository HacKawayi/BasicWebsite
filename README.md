**项目概述**

- **项目名**: HacKawayi — 包含两个小游戏（`turingchat`, `challenge`）
- **描述**: 一个包含两条产品线的实验性 Web 项目：
  - `turingchat`: 多人/单人 Turing 测试游戏（Pusher presence、AI 对手、MongoDB 会话记录、评分）
  - `challenge`: 算法益智小游戏合集（图算法关卡，单人、本地存档）

**游戏概览（快速对比）**

- `turingchat` — 实时匹配、邀请、AI 回应（需要 Pusher + AI + 可选 MongoDB）
- `challenge` — 离线算法关卡（不需要后端，即可本地游玩）

**主要功能**

- **聊天匹配界面**: 左侧用户列表、中央聊天窗口、右侧个人资料面板（60/40 布局）。
- **本地 mock 数据**: 开发阶段无需后端即可运行。
- **AI 模型配置**: 数据驱动的 AI 模型注册器（见 [lib/aiProviders.ts](lib/aiProviders.ts)）。
- **后端路由（可选）**: 已保留的 API 路由用于快速集成真实后端和数据持久化。

**技术栈**

- **框架**: Next.js 14（App Router）
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: MongoDB（Mongoose，已准备好连接器）
- **AI SDK**: @ai-sdk/* 系列（已在 [lib/aiProviders.ts](lib/aiProviders.ts) 中配置）

**快速开始**

- 安装依赖:

```bash
npm install
```

- 复制环境变量模板并编辑:

```bash
cp .env.example .env.local
# 编辑 .env.local，填入需要的凭据
```

- 环境变量说明（按游戏）:

  - 全局（可选）:
    - `MONGODB_URI` —— 用于会话/评分持久化（`models/GameSession`）
    - `OPENAI_API_KEY` —— OpenAI 后备模型
    - `MODELSCOPE_API_KEY` / `MODELSCOPE_BASE_URL` —— ModelScope 提供器（lib/aiProviders）
  - `turingchat`（实时多人）:
    - `NEXT_PUBLIC_PUSHER_KEY` / `NEXT_PUBLIC_PUSHER_CLUSTER` —— Pusher Presence（若要启用真实匹配）
    - `MONGODB_URI` —— 推荐用于记录会话和评分
    - `OPENAI_API_KEY` 或 ModelScope 凭据 —— AI 对手
  - `challenge`（算法益智）:
    - 无必需后端环境变量（离线、使用 localStorage 保存进度）

- 启动开发服务器:

```bash
npm run dev
```

访问: http://localhost:3000

**重要文件速览**

- 项目依赖与脚本: [package.json](package.json)
- 数据库连接器: [lib/db.ts](lib/db.ts)
- AI 模型注册器: [lib/aiProviders.ts](lib/aiProviders.ts)
- App 入口/页面: [app/page.tsx](app/page.tsx)
- 后端路由样例: [app/api/chat/route.ts](app/api/chat/route.ts) 、 [app/api/game/init/route.ts](app/api/game/init/route.ts)
- 数据模型示例: [models/GameSession.ts](models/GameSession.ts)
- 环境变量模板: [.env.example](.env.example)

**游戏模块详述**

- `turingchat` (路径: `app/turingchat/`): 多人/单人 Turing 测试游戏，主要文件：
  - `app/turingchat/page.tsx`（前端 UI、Pusher 客户端、邀请/会话管理）
  - `app/api/pusher/*`（Pusher 授权路由）
  - `app/api/chat/route.ts`（AI 聊天流，支持 ModelScope / OpenAI）
  - `app/api/game/*`（`init` / `submit`：会话初始化与提交评分）
  - `models/GameSession.ts`（会话与评分数据模型）

- `challenge` (路径: `app/challenge/`): 算法益智小游戏，主要文件：
  - `app/challenge/page.tsx`（关卡列表与进度）
  - `app/challenge/data/levels.ts`（关卡与算法定义）
  - `app/challenge/[id]/page.tsx`（关卡实现：例如 `1/` Bipartite Matching）
  - `app/challenge/components/*`（`GraphNode` / `GraphEdge` 等可视化组件）
  - 进度保存在 localStorage（无需后端）

**目录结构（高层）**

- app/: 前端页面与 API 路由（App Router）
- lib/: 共享库（数据库、AI 提供器等）
- models/: Mongoose 数据模型
- public/（如存在）: 静态资源
- package.json、next.config.mjs、tailwind.config.ts、tsconfig.json

（详见仓库实际文件以获取完整结构）

**后端集成要点**

- 数据库连接: 使用 [lib/db.ts](lib/db.ts)，在 `.env.local` 中填入 MONGODB_URI。
- AI 调用: `lib/aiProviders.ts` 提供了统一的模型注册与生成/流式接口，需配置 MODELSCOPE_API_KEY 与 MODELSCOPE_BASE_URL（或相应的 AI 提供商凭据）。
- 可复用路由: 仓库内保留了早期的游戏相关路由（例如 [app/api/chat/route.ts](app/api/chat/route.ts) 与 [app/api/game/submit/route.ts](app/api/game/submit/route.ts)），可直接改造为消息/会话保存与 AI 应答。

**建议的演进步骤（优先级）**

1. 完成 `.env.local` 配置并验证 `lib/db.ts` 能建立连接。
2. 新增用户与消息 CRUD 路由（推荐路径：`app/api/users`、`app/api/chat/messages`）。
3. 将前端 mock 数据替换为 API 请求（`app/page.tsx` 中相关 useEffect）。
4. （可选）加入实时功能：Socket.io 或服务器发送事件。
5. 添加认证（NextAuth 或自建 JWT）、头像上传与生产报警/监控。

**脚本**

- 启动开发: `npm run dev`
- 构建: `npm run build`
- 启动生产: `npm run start`
- 代码检查: `npm run lint`

**贡献与流程**

- 欢迎提交 Issues 与 Pull Requests。
- 建议分支策略：feature/*、fix/*、chore/*，并在 PR 中附上变更说明与测试步骤。

**联系方式与维护者**

- 仓库维护者请见项目提交历史；如需帮助，请在 Issues 中描述重现步骤和日志。

---
