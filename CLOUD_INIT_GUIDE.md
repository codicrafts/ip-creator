# 云开发初始化指南

## 问题：云开发未初始化错误

如果遇到 `云开发未初始化，请先调用 initCloud() 或引入云开发 SDK` 错误，请根据你的运行环境选择对应的解决方案。

## 解决方案

### 方案 1：小程序环境（推荐）

如果是在微信小程序中运行，云开发会自动初始化。确保：

1. 在 `app.json` 中配置云开发：
```json
{
  "cloud": true,
  "cloudfunctionRoot": "cloudfunctions/"
}
```

2. 在 `app.js` 中初始化云开发：
```javascript
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloudbase-5gqcz0ab010d3288',
        traceUser: true,
      });
    }
  }
});
```

### 方案 2：Web 环境 - 使用云开发 Web SDK

如果是在 Web 环境中运行（Next.js），需要引入云开发 Web SDK：

1. 在 `.env.local` 中配置：
```env
NEXT_PUBLIC_USE_CLOUD_WEB_SDK=true
```

2. 或者在 `app/layout.tsx` 中手动引入（已自动配置）：
```tsx
<Script
  src="https://res.wx.qq.com/open/libs/wecloud/1.0.0/wecloud.min.js"
  strategy="beforeInteractive"
/>
```

### 方案 3：Web 环境 - 使用 HTTP API（推荐用于生产环境）

如果无法使用云开发 Web SDK，可以通过 HTTP API 调用云函数：

1. 在云开发控制台中为云函数配置 HTTP 触发
2. 获取 HTTP 触发 URL
3. 在 `.env.local` 中配置：
```env
NEXT_PUBLIC_CLOUD_API_URL=https://your-cloud-api-domain.com
```

### 方案 4：创建 Next.js API 路由（中间层）

如果以上方案都不可行，可以创建 Next.js API 路由作为中间层：

创建 `app/api/cloud/[...path]/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const functionName = params.path[0];
  const body = await request.json();
  
  // 这里需要实现调用微信云函数的逻辑
  // 可以使用云开发 HTTP API 或 SDK
  
  try {
    // 示例：通过云开发 HTTP API 调用
    const response = await fetch(
      `https://api.weixin.qq.com/tcb/invokecloudfunction?env=cloudbase-5gqcz0ab010d3288&name=${functionName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 需要添加认证信息
        },
        body: JSON.stringify(body),
      }
    );
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '调用云函数失败' },
      { status: 500 }
    );
  }
}
```

然后更新 `lib/cloud.ts` 中的 `callCloudFunction` 使用这个 API 路由。

## 快速检查清单

- [ ] 确认运行环境（小程序 or Web）
- [ ] 小程序环境：检查 `app.json` 和 `app.js` 配置
- [ ] Web 环境：检查是否引入了云开发 Web SDK 或配置了 HTTP API URL
- [ ] 检查云环境ID是否正确：`cloudbase-5gqcz0ab010d3288`
- [ ] 检查云函数是否已部署
- [ ] 检查网络连接和权限

## 调试建议

1. 在浏览器控制台检查 `wx` 对象是否存在
2. 检查 `wx.cloud` 是否已初始化
3. 查看网络请求，确认云函数调用是否发送
4. 查看云开发控制台的云函数日志

