# 微信云开发配置说明

本项目使用微信云开发（wx-server-sdk）作为后端，云环境ID为 `cloudbase-5gqcz0ab010d3288`。

## 📋 目录结构

```
cloudfunctions/
├── auth/              # 用户认证云函数
│   ├── index.js
│   └── package.json
├── user/              # 用户信息管理云函数
│   ├── index.js
│   └── package.json
└── README.md
```

## 🚀 部署步骤

### 1. 在微信开发者工具中部署云函数

1. 打开微信开发者工具
2. 创建或打开小程序项目
3. 在项目根目录创建 `cloudfunctions` 文件夹
4. 将 `cloudfunctions/auth` 和 `cloudfunctions/user` 复制到项目中
5. 右键点击 `cloudfunctions/auth` 文件夹，选择"上传并部署：云端安装依赖"
6. 右键点击 `cloudfunctions/user` 文件夹，选择"上传并部署：云端安装依赖"

### 2. 创建数据库集合

在云开发控制台中：

1. 进入"数据库"页面
2. 创建集合 `users`
3. 设置集合权限为"仅创建者可读写"（或根据需求设置）

### 3. 配置云环境

确保云环境ID为：`cloudbase-5gqcz0ab010d3288`

### 4. 配置腾讯云凭证（必需）

在服务端使用 `wx-server-sdk` 需要配置腾讯云的 `secretId` 和 `secretKey`：

1. 在微信云开发控制台获取凭证：
   - 进入"设置" -> "环境设置" -> "安全配置"
   - 获取 `secretId` 和 `secretKey`

2. 在项目根目录创建 `.env.local` 文件：
```env
TENCENT_CLOUD_SECRET_ID=your_secret_id
TENCENT_CLOUD_SECRET_KEY=your_secret_key
```

3. 重启开发服务器使环境变量生效

**注意**：`.env.local` 文件不要提交到 Git，应添加到 `.gitignore`

## 🌐 Web 环境调用（Next.js）

由于 Next.js 是 Web 应用，不能直接使用 `wx.cloud.callFunction`，需要通过 HTTP API 调用云函数。

### 方案 1：使用云函数 HTTP 触发（推荐）

1. 在云开发控制台中，为每个云函数配置 HTTP 触发
2. 获取 HTTP 触发 URL
3. 在 `.env.local` 中配置：

```env
NEXT_PUBLIC_CLOUD_API_URL=https://your-cloud-api-domain.com
```

### 方案 2：创建中间层 API

如果无法使用 HTTP 触发，可以创建一个中间层 API 服务，在服务器端调用云函数。

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
  
  // 示例：通过 HTTP API 调用
  const response = await fetch(
    `https://api.weixin.qq.com/tcb/invokecloudfunction?env=${process.env.CLOUD_ENV_ID}&name=${functionName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  
  const data = await response.json();
  return NextResponse.json(data);
}
```

## 📊 数据库集合结构

### users 集合

```javascript
{
  _id: String,              // 用户ID（自动生成）
  phone: String,            // 手机号（唯一）
  password: String,         // 密码（建议加密存储）
  userTier: String,         // 会员等级: 'FREE' | 'PREMIUM'
  sceneUsage: {             // 场景扩展使用次数
    date: String,           // 日期: 'YYYY-MM-DD'
    count: Number           // 使用次数
  },
  memeUsage: {              // 表情包制作使用次数
    date: String,           // 日期: 'YYYY-MM-DD'
    count: Number           // 使用次数
  },
  createdAt: Date,          // 创建时间
  updatedAt: Date           // 更新时间
}
```

### 索引建议

为了提高查询性能，建议创建以下索引：

1. `phone` 字段：唯一索引
2. `_id` 字段：主键索引（自动创建）

## 🔒 安全建议

1. **密码加密**：生产环境应该对密码进行加密存储（如使用 bcrypt）
2. **数据验证**：在云函数中添加输入验证
3. **权限控制**：设置合适的数据库权限
4. **HTTPS**：确保所有 API 调用使用 HTTPS

## 🧪 测试

### 测试登录

```javascript
// 调用 auth 云函数
{
  action: 'login',
  phone: '13800138000',
  password: '123456'
}
```

### 测试注册

```javascript
// 调用 auth 云函数
{
  action: 'register',
  phone: '13800138000',
  password: '123456'
}
```

### 测试获取用户信息

```javascript
// 调用 user 云函数
{
  action: 'getInfo',
  userId: 'user_id_here'
}
```

## 📝 注意事项

1. 云函数部署后需要等待几分钟才能生效
2. 首次调用云函数可能较慢（冷启动）
3. 建议在生产环境启用云函数日志监控
4. 定期备份数据库数据

## 🔧 故障排查

### 云函数调用失败

1. 检查云环境ID是否正确
2. 检查云函数是否已部署
3. 查看云函数日志排查错误

### 数据库操作失败

1. 检查集合权限设置
2. 检查数据库连接
3. 查看数据库操作日志

## 📚 相关文档

- [微信云开发文档](https://developers.weixin.qq.com/minigame/dev/wxcloud/basis/getting-started.html)
- [wx-server-sdk 文档](https://developers.weixin.qq.com/minigame/dev/wxcloud/reference-server-api/)

