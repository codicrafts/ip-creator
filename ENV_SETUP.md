# 环境变量配置说明

## 必需的环境变量

### 腾讯云凭证（用于 wx-server-sdk）

在服务端使用 `wx-server-sdk` 需要配置腾讯云的 `secretId` 和 `secretKey`。

#### 获取方式：

1. 登录 [微信云开发控制台](https://console.cloud.tencent.com/tcb)
2. 选择对应的云环境（cloudbase-5gqcz0ab010d3288）
3. 进入"设置" -> "环境设置" -> "安全配置"
4. 获取 `secretId` 和 `secretKey`

#### 配置方式：

在项目根目录创建 `.env.local` 文件（此文件不会被提交到 Git）：

```env
# 腾讯云凭证（必需）
TENCENT_CLOUD_SECRET_ID=your_secret_id_here
TENCENT_CLOUD_SECRET_KEY=your_secret_key_here
```

#### 注意事项：

- `.env.local` 文件已添加到 `.gitignore`，不会被提交
- 修改环境变量后需要重启开发服务器
- 生产环境需要在部署平台配置这些环境变量

## 可选的环境变量

### Gemini API Key（用于图像生成）

```env
# 使用 API_KEY 或 GEMINI_API_KEY（两者都可以）
API_KEY=your_gemini_api_key_here
# 或者
GEMINI_API_KEY=your_gemini_api_key_here
```

**注意**：API_KEY 在服务端使用，不会暴露到客户端，所以不需要 `NEXT_PUBLIC_` 前缀。

### 支付 API 地址

```env
NEXT_PUBLIC_PAYMENT_API_URL=https://your-api-domain.com/api/payment
```

## 快速开始

1. 复制 `.env.example` 为 `.env.local`（如果存在）
2. 填入你的腾讯云凭证
3. 重启开发服务器：`pnpm dev`

