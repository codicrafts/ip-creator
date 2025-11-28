# 部署环境变量配置指南

## 问题说明

如果遇到错误："微信支付配置不完整：缺少商户私钥或证书序列号"，说明部署环境缺少必要的环境变量配置。

## 必需的环境变量

### 微信支付配置（必需）

在部署平台（如 Vercel、Netlify、Railway 等）配置以下环境变量：

```env
# 微信支付 AppID
WECHAT_APPID=wxe8bd8fdfe51fb6d8

# 微信支付商户号
WECHAT_MCH_ID=1730633244

# 微信支付商户私钥（PEM 格式，必需）
# 注意：私钥包含换行符，在不同平台配置方式不同
WECHAT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCw9jhtjuEvfmGP\n...\n-----END PRIVATE KEY-----

# 微信支付商户证书序列号（必需）
WECHAT_SERIAL_NO=4C8A8EF319F652ACB98A7A2E30A2907D795E2D9D

# 微信支付回调地址（根据实际域名修改）
WECHAT_NOTIFY_URL=https://your-domain.com/api/payment/wechat/notify
```

## 不同部署平台的配置方式

### Vercel

1. 登录 Vercel Dashboard
2. 选择你的项目
3. 进入 **Settings** -> **Environment Variables**
4. 添加以下变量：
   - `WECHAT_APPID`
   - `WECHAT_MCH_ID`
   - `WECHAT_PRIVATE_KEY`（**重要**：直接粘贴完整私钥，包括换行符）
   - `WECHAT_SERIAL_NO`
   - `WECHAT_NOTIFY_URL`
5. 选择环境（Production、Preview、Development）
6. 点击 **Save**
7. **重新部署**应用使环境变量生效

**Vercel 私钥配置注意事项**：
- 可以直接粘贴包含换行符的私钥
- 或者使用 `\n` 表示换行符（但直接粘贴换行符更可靠）

### Netlify

1. 登录 Netlify Dashboard
2. 选择你的站点
3. 进入 **Site configuration** -> **Environment variables**
4. 添加环境变量（同上）
5. **重新部署**应用

**Netlify 私钥配置注意事项**：
- 建议使用 `\n` 表示换行符
- 或者将私钥放在一行中（去掉实际换行符）

### Railway

1. 登录 Railway Dashboard
2. 选择你的项目
3. 进入 **Variables** 标签
4. 添加环境变量
5. **重新部署**应用

### 其他平台

大多数平台都支持环境变量配置，通常在以下位置：
- **Settings** -> **Environment Variables**
- **Configuration** -> **Environment Variables**
- **Variables** 或 **Secrets**

## 私钥格式说明

微信支付商户私钥必须是 PEM 格式，包含以下标记：

```
-----BEGIN PRIVATE KEY-----
...私钥内容...
-----END PRIVATE KEY-----
```

或者：

```
-----BEGIN RSA PRIVATE KEY-----
...私钥内容...
-----END RSA PRIVATE KEY-----
```

## 获取私钥和证书序列号

1. 登录 [微信支付商户平台](https://pay.weixin.qq.com/)
2. 进入 **账户中心** -> **API 安全** -> **API 证书**
3. 下载商户证书（ZIP 文件）
4. 解压后找到 `apiclient_key.pem` 文件，这就是商户私钥
5. 打开 `apiclient_key.pem`，复制完整内容（包括 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`）
6. 查看证书序列号：
   - 在商户平台直接查看
   - 或使用命令：`openssl x509 -in apiclient_cert.pem -noout -serial`
   - 序列号格式：十六进制字符串，去掉冒号和空格

## 验证配置

配置完成后，可以通过以下方式验证：

1. **重新部署应用**
2. **检查日志**：查看是否有环境变量相关的错误
3. **测试支付**：尝试发起一笔支付请求，看是否还有配置错误

## 常见问题

### Q: 为什么本地可以，部署后不行？

A: 本地有 `.env.local` 文件配置了环境变量，但部署环境需要单独配置。`.env.local` 文件不会被提交到 Git，也不会自动同步到部署环境。

### Q: 私钥包含换行符，如何配置？

A: 不同平台处理方式不同：
- **Vercel**：可以直接粘贴包含换行符的私钥
- **Netlify**：建议使用 `\n` 表示换行符
- **其他平台**：根据平台文档，通常支持直接粘贴或使用 `\n`

### Q: 配置后还是报错？

A: 检查以下几点：
1. 环境变量名称是否正确（区分大小写）
2. 私钥是否完整（包括 BEGIN 和 END 标记）
3. 证书序列号格式是否正确（十六进制，无空格和冒号）
4. 是否重新部署了应用
5. 检查部署日志，确认环境变量是否被正确读取

### Q: 如何确认环境变量已配置？

A: 可以在代码中临时添加日志（仅用于调试，不要提交到生产环境）：

```typescript
console.log('WECHAT_PRIVATE_KEY exists:', !!process.env.WECHAT_PRIVATE_KEY);
console.log('WECHAT_SERIAL_NO exists:', !!process.env.WECHAT_SERIAL_NO);
```

## 安全提示

⚠️ **重要**：
- 商户私钥是敏感信息，请妥善保管
- 不要在代码中硬编码私钥
- 不要将私钥提交到 Git 仓库
- 定期更换私钥和证书
- 使用环境变量或密钥管理服务存储敏感信息

