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

**注意**：API*KEY 在服务端使用，不会暴露到客户端，所以不需要 `NEXT_PUBLIC*` 前缀。

### 微信支付 V3 API 配置（用于支付功能）

```env
# 微信支付 AppID
WECHAT_APPID=wxe8bd8fdfe51fb6d8

# 微信支付商户号
WECHAT_MCH_ID=1730633244

# 微信支付商户私钥（PEM 格式，必需）
# 从微信支付商户平台下载的证书文件中提取私钥
# 格式必须包含 -----BEGIN PRIVATE KEY----- 和 -----END PRIVATE KEY-----
# 注意：在 .env.local 中，换行符需要使用 \n 表示，或者将整个私钥放在一行中
WECHAT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCw9jhtjuEvfmGP\n72sHQsTnhAzRXZ0vRlVMm3P+tobBm2TgPbI8aDOyr1ZUAJuDJZkeJd+DgBaa/ByV\nqRyKduoeQSX2zdslw+fNpWrMarY3IKuZ1JVlAo4TnaUPfSckyrYutztCvoPzIF62\ns2d0fCmQskVabr3A0D28040+lZf1s6oPBtNFM2F8sl6WPpbmIB4Gawfesmbg5djd\nyLOkHqBowrjlK5KVP3n3jGfKnDqO5uvguKujNFv3nAnirUcZ4SBvXYIgLxDl6gS5\nrzjbbZ4h76fDPHMz133AhzkdZgPeUROV9APvqx4Uo7Bi9Ysrynn06uwn4YQCdyil\nUdxxxSPVAgMBAAECggEAVD4y6L0PKIvyqBHjEsbPdCOh8n2tWZcS/nA2zThZeIug\nfzv/wNAeZF8iKsVLQyi/9uEywahVmpyQgxLJuoUXuSVsjEy9mgHkNTsdV4kpi57q\n8kWIhVitCFuQ+4mp+9Lg3eZuuLx3lmN/k1xe0M5W/0JOz9lOTh8UdPMFF5khiV6d\n5I9gvPGWqH+sQo93a+DUrxJMY+6zK+0EEgpP/4k4vucCegFDxYXFArNIncMcW19Y\nL2pwRCxhY3WQxs1MuA7quDFSl1qf3zcmWjQ/WcPUkuSmY+I9YZK4mse7ha1YOiJS\nRe0UcSe/f09z7Y5OaaRQeeRadn7DjUI1OkNwdn+R1QKBgQDqtNIbQhgfsYv1ueGP\nab931gOtqSIj19/W4xNjWvPTtuQFAG/f5hrOVuuPS5cMsfYSJaqcob0+/xiSeS96\n5hXBDKLi2eSYXtb9w7xpzyUUJoRk0PIKYe7rHB5PPE0q2rx75Ou/eTP93+PcpKMD\n86aG41BaXlP1LVdItV5m09JtPwKBgQDBBECSuWUPP2SiER47yMBRxdcnvoLBQwi3\nLbOdYolU4wnkjSSMXeF9DtlSH9LSWkGJqhjzJLXY04g/jhIGFqKs+ZWzHixIBMfe\njfLLyDnycGKPvH/IiZGkuQkQXg7czyS7ukKtuDas4PkCL5ZxyYiz2DNE1qFoCYjI\n7wjk6D9l6wKBgQDdh+Kwu8fNUmXKf7J5DNUeJTC/n16L+lxalWZdZyGxeXTri6gM\n60Ht9HjOfgiKgQbDxi2tPbREW78zsZKxK67o0iaEfCmZ8Bp412FldZGH3XslNVrf\nleROofGx1Db59g/l2QLzbVE3lTWbswHy3u0VcEUNpu8UAcHa7OW3pMN/PQKBgFEH\nsPgn3rZE/cFQAGpGv/5UWRv1Tb1GoA0OoZ4L9O1vFwMdAd/vta8jobZpZ78pZuQd\nRbYljjYFr+hGg2iM7iRB70ev/hUJ9MKIwwor96/A4I/JKbgNkNgfWh/F7OVkDN7G\ntiFp+YIgPElfowAIBFzEAdn/ZOlhP0xjlU9L9PmbAoGAKyA3XyokGkpCFppKLBPf\nUe4YpFb2AWESteAGeBbpYqxTS+M8t3gGm6WOv77y9f3ravF9cDqOZANvyEe9EihP\n6uRoQ6y9MQjC/ZHEHzFrRz7ulb28N2VgM0Abi6ifNNtEeJl8lln0UEOMB8D1eYsd\n5cYHFA4e5kzROTBhbikudXA=\n-----END PRIVATE KEY-----

# 微信支付商户证书序列号（必需）
# 从证书中提取的序列号（十六进制字符串，不包含空格和冒号）
WECHAT_SERIAL_NO=4C8A8EF319F652ACB98A7A2E30A2907D795E2D9D

# 微信支付回调地址
WECHAT_NOTIFY_URL=https://your-domain.com/api/payment/wechat/notify
```

#### 获取微信支付商户证书和私钥：

1. 登录 [微信支付商户平台](https://pay.weixin.qq.com/)
2. 进入"账户中心" -> "API 安全" -> "API 证书"
3. 下载商户证书（通常是一个 ZIP 文件，包含以下文件）：
   - `apiclient_cert.pem` - 商户证书
   - `apiclient_key.pem` - 商户私钥（**这是您需要的私钥文件**）
   - `rootca.pem` - 根证书
4. 打开 `apiclient_key.pem` 文件，复制完整的私钥内容（包括 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`）
5. 从证书文件中提取序列号，或使用以下命令查看：
   ```bash
   openssl x509 -in apiclient_cert.pem -noout -serial
   ```
   序列号格式通常是十六进制字符串，需要去掉冒号和空格

#### 开通支付产品权限：

**重要**：在使用支付功能前，需要在微信支付商户平台开通相应的支付产品：

1. 登录 [微信支付商户平台](https://pay.weixin.qq.com/)
2. 进入"产品中心"
3. 开通以下产品（根据您的需求）：
   - **Native 支付（扫码支付）**：用于 PC 端扫码支付
   - **H5 支付**：用于移动端浏览器支付
4. 等待产品审核通过（通常需要 1-3 个工作日）
5. 审核通过后即可使用相应的支付功能

**注意**：

- 如果遇到"商户号该产品权限未开通"的错误，说明对应的支付产品尚未开通
- 不同产品可能需要不同的资质和审核材料
- 建议同时开通 Native 支付和 H5 支付，以支持 PC 端和移动端

**重要提示**：

- 商户私钥是敏感信息，请妥善保管，不要泄露
- 私钥格式必须是 PEM 格式（包含 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`）
- 在 `.env.local` 中，如果私钥包含换行符，可以使用 `\n` 表示换行，或者将整个私钥放在一行中（去掉实际的换行符）
- 证书序列号应该是十六进制字符串，不包含空格、冒号或连字符
- 当前配置的证书序列号：`4C8A8EF319F652ACB98A7A2E30A2907D795E2D9D`

**配置示例（.env.local）**：

```env
# 方式 1：使用 \n 表示换行（推荐）
WECHAT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCw9jhtjuEvfmGP\n72sHQsTnhAzRXZ0vRlVMm3P+tobBm2TgPbI8aDOyr1ZUAJuDJZkeJd+DgBaa/ByV\n...\n-----END PRIVATE KEY-----

# 方式 2：将整个私钥放在一行中（去掉所有换行符）
WECHAT_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCw9jhtjuEvfmGP72sHQsTnhAzRXZ0vRlVMm3P+tobBm2TgPbI8aDOyr1ZUAJuDJZkeJd+DgBaa/ByV...-----END PRIVATE KEY-----
```

### 支付宝支付配置（用于支付功能）

#### 正式环境配置

```env
# 支付宝 AppID（应用ID）
ALIPAY_APPID=your_alipay_appid_here

# 支付宝应用私钥（RSA 或 RSA2 私钥，PEM 格式）
# 从支付宝开放平台下载的应用私钥
ALIPAY_PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----

# 支付宝公钥（支付宝公钥，用于验签）
# 从支付宝开放平台获取的支付宝公钥
ALIPAY_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...\n-----END PUBLIC KEY-----

# 支付宝异步通知回调地址
ALIPAY_NOTIFY_URL=https://your-domain.com/api/payment/alipay/notify

# 支付宝网关地址（可选，默认使用正式环境）
# 正式环境：https://openapi.alipay.com/gateway.do
# 沙箱环境：https://openapi.alipaydev.com/gateway.do
ALIPAY_GATEWAY=https://openapi.alipay.com/gateway.do

# 支付宝签名类型（可选，默认为 RSA2）
# 可选值：RSA 或 RSA2（推荐使用 RSA2）
ALIPAY_SIGN_TYPE=RSA2
```

#### 沙箱环境配置（用于测试）

```env
# 支付宝沙箱 AppID（沙箱应用ID）
# 从支付宝开放平台沙箱环境获取
SENDBOX_ALIPAY_APPID=9021000158608077

# 支付宝沙箱应用私钥（RSA 或 RSA2 私钥）
# 从支付宝开放平台沙箱环境下载的应用私钥
# 注意：私钥值应该是完整的密钥字符串，不需要包含 BEGIN/END 标记（代码会自动处理）
SENDBOX_PRIVATE_KEY=MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnTzms59EZmb3sqXgdJNkjeMWkWS4f/NsehZiclVOVBc4FXKZN8zCWFysY/1/uSAeC4c3+Iaw1JZElp9+tLNhXQ40qcBC/z79poXgJGx7MSNQVTTwdDg4egHI+Wf/E3pYc/+8NwLEwPkxxetHR3NVIV49iIp7JoLb4xWdwW3Ds+m6cc23ipdQp0qSr8rbcpqP9EXKBFWGnyET4yq/W1PlAB45m5jnNM2I60nWIOYqdRL8340QjqRQtZFSMDT5aotdK/lmGfjWi8drjBNbflcKHPCALrsbA29Lf0T9rHn/znd/I898w4vMPHfdnOPHrXQ9xK1SKhsq7C8gSoFeCCMftAgMBAAECggEAHDWledvUS8a6WS7xy6gs3Gg+mslWl5ogr/LCmpQq9ZN2+zx15eq9JHFfmOVmHV0TtyOvgcvXp1ZgNMMrWZ2YFI6VPLSMfmre0UaiYJasCLG24KiXHCcEhmwN1ymBkIYfNWCJw/3bYlD+vpuAySu84mexC1DfCQwKDcPq/uzMC4igTbU0EnLKbobblmxSSJLWBMLHh7zRiKd8dKZz4EW80eECGI3PKwB7bIXQfKAYB/XPjgoodHkVZWdP/irqeiRuTxZn3qzw09g28MX5LLmQoinrRnzQvH6s061PUSm8CL5CXiqA04FvCzSh+FImXbDdcB2EKZ747Dw3t/Uk+aiXwQKBgQDV9DsnPWoVgYFdM7hjDf//RLRq3ykMunFp/iBPjkKEfV7DR0BHfYMlFk9VpeXxgyVyYMZL8oK2jwaj9QN8o3qUzkmxYzsHNU/B8EY3pHr1M7b/mlcC3eUXZvUG5edHsg4zHk6zRySXa36uRJoR10w9bIqUXtNuuu5mjs2lUqRRuQKBgQDIMFzukit1+VPHUvoLaVZI/Iy/eijohAr6wv8QYqrlRTBG8MJy6wLMM4rWzclpj61rnC6QtjAZWyn+fawBog3KxOD6IBfG8cGKZjx3+BZeaCwtRKCq+XMoNjpB6lcd4Wjd0WhDup1yj2GiE3dh0dMfX+Ktv9poNHJcLq+ZVL+R1QKBgQC+UxuH5ZcH+INWoJqm6x5OOxTveQLwQq5/JkQh4SAE8e2pcymYLuvJwxXhz8lEVXCrVbEwgFONCKBUm7F1X4u88eEWPnqVB/SiRhaAiv2iQFXK/MXoU/HmJn1TnJJn8dm12YES8/d2B3bSmU4hDs/QWEzSfaRB/WHzs5b2ORTZaQKBgQCSNIAq3SZQqx+826Uy4GPcOlaxIY7vAkDik7elR+p4N+fiZ8QcGfeZG6uy5ejL59tIVHDNz8GhQyuQakhNiQV5qgCFrRqwebBYXAKdu9raaEqbZRvSwwyPucsiiPvHHvFvz5jOnmSPXph3vq/aCVyf9W+gZhYlNOiw2of0/ChNYQKBgFscRHKU//JM/fRWAxYjVI9PrixFCctgbjj8Aj2Bfb4GvLoG6IZI+uOKdhHMou55PxEepmo3VmK/ghI3iPetH2vwO3i+yGYNqOSc/uZS6IKWIKJUpFSuYGNaTqaWSToaSSsHfis8DQA6ut9YlqVtnmnvsYxEQNWzZB+BxfMt1D5X

# 支付宝沙箱公钥（支付宝公钥，用于验签）
# 从支付宝开放平台沙箱环境获取的支付宝公钥
# 注意：公钥值应该是完整的密钥字符串，不需要包含 BEGIN/END 标记（代码会自动处理）
SENDBOX_ALIPAY_PUBLIC_KEY=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlcP+jJKdmlFW3medtW954AJTU+1ghd8gr+VUunoR7agYF+OA+ZRcEvDCAMUvvqyVRG/5jiIS9MDKdYLOLZVvBKaH+h/lYyloe+OD/C6ytvYC9OxkcyzpkjHZiqBBhgubwhmoE2NrzoKXQRTBLYtldnwiSGWCpg3W3e+4kp4C7qdaouq1r61MKw/WPRJyN9HIpv+djCVzAhXqKiZhJsrPWRQF7Ixg4i7tBXrgLX9PBbueiT0/6vXuYb1b0FTCGjpna+bXU7QtXmT1hMgV1LQQUUWvvGPAnc1u3yHM9OymSVLjlFJSHAB0oc8lmQYUWtCEqfRkP7eO8f+7r60K2rW0qQIDAQAB
```

**注意**：

- 沙箱环境变量用于测试功能（`/api/payment/alipay/test` 接口）
- 正式环境变量用于生产支付功能
- 沙箱和正式环境的配置是独立的，不会互相影响
- 沙箱私钥和公钥的值应该是完整的密钥字符串，代码会自动添加 `-----BEGIN...-----` 和 `-----END...-----` 标记

#### 获取支付宝配置信息：

1. **登录支付宝开放平台**：

   - 访问 [支付宝开放平台](https://open.alipay.com/)
   - 使用支付宝账号登录

2. **创建应用**：

   - 进入"控制台" -> "网页&移动应用"
   - 创建应用，选择"网页应用"或"移动应用"
   - 获取 `APPID`（应用 ID）

3. **配置应用信息**：

   - 设置应用名称、应用图标等
   - 配置"接口加签方式"：
     - 选择"公钥"模式（推荐）
     - 生成或上传 RSA2 密钥对
     - 下载应用私钥（`ALIPAY_PRIVATE_KEY`）
     - 上传应用公钥，获取支付宝公钥（`ALIPAY_PUBLIC_KEY`）

4. **开通产品权限**：

   - 进入"产品列表"
   - 开通"电脑网站支付"产品
   - 等待审核通过（通常需要 1-3 个工作日）

5. **配置回调地址**：
   - 在应用设置中配置"服务器异步通知页面路径"
   - 设置为：`https://your-domain.com/api/payment/alipay/notify`
   - 确保该地址可以通过公网访问

#### 支付宝密钥生成方式：

**方式 1：使用支付宝提供的密钥生成工具**

- 访问 [支付宝开放平台密钥工具](https://opendocs.alipay.com/common/02kkv7)
- 下载密钥生成工具，生成 RSA2 密钥对
- 私钥用于 `ALIPAY_PRIVATE_KEY`
- 公钥上传到支付宝开放平台，获取支付宝公钥用于 `ALIPAY_PUBLIC_KEY`

**方式 2：使用 OpenSSL 生成密钥**

```bash
# 生成私钥
openssl genrsa -out rsa_private_key.pem 2048

# 生成公钥
openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem

# 查看私钥内容（用于 ALIPAY_PRIVATE_KEY）
cat rsa_private_key.pem

# 查看公钥内容（上传到支付宝开放平台）
cat rsa_public_key.pem
```

**重要提示**：

- 支付宝私钥和公钥是敏感信息，请妥善保管，不要泄露
- 私钥格式必须是 PEM 格式（包含 `-----BEGIN RSA PRIVATE KEY-----` 和 `-----END RSA PRIVATE KEY-----`）
- 公钥格式必须是 PEM 格式（包含 `-----BEGIN PUBLIC KEY-----` 和 `-----END PUBLIC KEY-----`）
- 在 `.env.local` 中，如果密钥包含换行符，可以使用 `\n` 表示换行
- 推荐使用 RSA2（2048 位）签名方式，安全性更高
- 沙箱环境用于测试，正式环境用于生产

### 阿里云短信服务配置（用于短信验证码登录）

```env
# 阿里云 AccessKey ID
# 从阿里云控制台获取：https://ram.console.aliyun.com/manage/ak
ALIYUN_ACCESS_KEY_ID=your_access_key_id_here

# 阿里云 AccessKey Secret
# 从阿里云控制台获取：https://ram.console.aliyun.com/manage/ak
ALIYUN_ACCESS_KEY_SECRET=your_access_key_secret_here

# 短信签名名称
# 在阿里云短信服务控制台申请：https://dysms.console.aliyun.com/
ALIYUN_SMS_SIGN_NAME=your_sign_name_here

# 短信模板代码
# 在阿里云短信服务控制台申请验证码模板，获取模板CODE
ALIYUN_SMS_TEMPLATE_CODE=SMS_123456789
```

#### 获取配置信息：

1. **开通阿里云短信服务**：
   - 访问 [阿里云短信服务控制台](https://dysms.console.aliyun.com/)
   - 按照提示开通短信服务

2. **申请短信签名**：
   - 在短信服务控制台，选择"国内消息" > "签名管理"
   - 点击"添加签名"，填写签名信息（如：您的应用名称）
   - 提交后等待审核通过（通常1-2个工作日）
   - 审核通过后，将签名名称填入 `ALIYUN_SMS_SIGN_NAME`

3. **申请短信模板**：
   - 在短信服务控制台，选择"国内消息" > "模板管理"
   - 点击"添加模板"，选择"验证码"类型
   - 填写模板内容，例如：`您的验证码是${code}，5分钟内有效，请勿泄露给他人。`
   - 提交后等待审核通过（通常1-2个工作日）
   - 审核通过后，将模板CODE填入 `ALIYUN_SMS_TEMPLATE_CODE`

4. **获取 AccessKey**：
   - 登录 [阿里云控制台](https://ram.console.aliyun.com/manage/ak)
   - 进入"AccessKey 管理"页面
   - 创建新的 AccessKey，获取 `AccessKey ID` 和 `AccessKey Secret`
   - **注意**：AccessKey Secret 只显示一次，请妥善保管

#### 注意事项：

- **短信模板规范**：
  - 验证码模板必须包含 `${code}` 变量
  - 模板内容需符合 [验证码模板申请与审核规范](https://help.aliyun.com/zh/sms/user-guide/verification-code-template-specifications)
  - 建议在模板中说明验证码有效期（如：5分钟内有效）

- **安全提示**：
  - `AccessKey Secret` 是敏感信息，请妥善保管，不要泄露
  - 不要将 `AccessKey Secret` 暴露在前端代码中
  - 建议定期更换 AccessKey
  - 生产环境建议使用 RAM 子账号，并授予最小权限

- **费用说明**：
  - 阿里云短信服务按条计费
  - 验证码短信通常价格较低（约0.04-0.05元/条）
  - 建议设置每日发送上限，防止恶意刷量

- **开发环境测试**：
  - 开发环境下，发送验证码成功后会返回验证码内容（方便测试）
  - 生产环境不会返回验证码，确保安全性

#### 配置示例（.env.local）：

```env
# 阿里云短信服务配置
ALIYUN_ACCESS_KEY_ID=LTAI5txxxxxxxxxxxxx
ALIYUN_ACCESS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ALIYUN_SMS_SIGN_NAME=IP创想坊
ALIYUN_SMS_TEMPLATE_CODE=SMS_123456789
```

### 支付 API 地址（已废弃，不再需要）

```env
# 此配置已不再使用，支付功能通过云函数实现
# NEXT_PUBLIC_PAYMENT_API_URL=https://your-api-domain.com/api/payment
```

## 快速开始

1. 复制 `.env.example` 为 `.env.local`（如果存在）
2. 填入你的腾讯云凭证
3. 重启开发服务器：`pnpm dev`
