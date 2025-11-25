# Next.js App Router 重构说明

## 项目结构

```
generate-web/
├── app/                    # Next.js App Router 目录
│   ├── layout.tsx         # 根布局（包含 ReduxProvider 和 TabBar）
│   ├── page.tsx           # 首页 (/)
│   ├── create/            # 创作页 (/create)
│   │   └── page.tsx
│   ├── edit/              # 编辑页 (/edit)
│   │   └── page.tsx
│   ├── result/            # 结果页 (/result)
│   │   └── page.tsx
│   ├── profile/           # 我的页 (/profile)
│   │   └── page.tsx
│   ├── meme-editor/       # 表情包编辑器 (/meme-editor)
│   │   └── page.tsx
│   ├── providers/         # 提供者组件
│   │   └── ReduxProvider.tsx
│   ├── components/        # 应用级组件
│   │   └── TabBarWrapper.tsx
│   └── globals.css        # 全局样式
├── store/                 # Redux Store
│   ├── store.ts          # Store 配置
│   ├── hooks.ts          # Typed hooks
│   └── slices/           # Redux Slices
│       ├── appSlice.ts
│       ├── imageSlice.ts
│       ├── memeSlice.ts
│       └── userSlice.ts
├── components/            # 共享组件
│   ├── Loader.tsx
│   ├── PaymentModal.tsx
│   └── TabBar.tsx
├── services/              # 服务层
│   ├── geminiService.ts
│   └── paymentService.ts
├── lib/                   # 工具和常量
│   └── constants.ts
└── types.ts               # TypeScript 类型定义
```

## 主要变更

### 1. 路由系统
- 从 React Router 迁移到 Next.js App Router
- 路由基于文件系统：
  - `/` → `app/page.tsx`
  - `/create` → `app/create/page.tsx`
  - `/edit` → `app/edit/page.tsx`
  - `/result` → `app/result/page.tsx`
  - `/profile` → `app/profile/page.tsx`
  - `/meme-editor` → `app/meme-editor/page.tsx`

### 2. 状态管理
- 使用 Redux Toolkit 进行状态管理
- 状态分为 4 个 slices：
  - `appSlice`: 应用状态（视图、加载状态等）
  - `imageSlice`: 图片相关状态（源图、结果、历史等）
  - `memeSlice`: 表情包相关状态
  - `userSlice`: 用户相关状态（等级、使用量等）

### 3. 组件迁移
- 所有页面组件标记为 `'use client'`（因为使用了 hooks 和交互）
- 组件导入路径使用 `@/` 别名
- TabBar 使用 Next.js 的 `Link` 和 `usePathname`

### 4. 样式配置
- Tailwind CSS 配置在 `tailwind.config.ts`
- 全局样式和动画在 `app/globals.css`
- 保持原有的 UI 和布局不变

## 运行项目

```bash
# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 环境变量

创建 `.env.local` 文件：

```
GEMINI_API_KEY=your_api_key_here
```

## 注意事项

1. 所有客户端组件需要 `'use client'` 指令
2. Redux store 在 `ReduxProvider` 中初始化，并自动同步 localStorage
3. TabBar 通过 `TabBarWrapper` 在 layout 中渲染，根据路径自动显示/隐藏
4. 服务文件（如 `geminiService.ts`）保持不变，可以直接使用

