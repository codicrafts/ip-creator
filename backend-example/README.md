# 后端支付 API 示例

这个目录包含了支付后端 API 的示例实现。

## 文件说明

- `payment-api-example.js`: Express.js 路由示例，包含：
  - 创建支付订单接口
  - 查询订单状态接口
  - 微信支付回调接口
  - 支付宝支付回调接口

## 使用方法

### 1. 安装依赖

```bash
npm install express axios
```

### 2. 配置支付参数

在 `payment-api-example.js` 中修改以下配置：

```javascript
const WECHAT_CONFIG = {
  appId: 'YOUR_WECHAT_APPID',
  mchId: 'YOUR_MCH_ID',
  apiKey: 'YOUR_API_KEY',
  notifyUrl: 'https://your-domain.com/api/payment/wechat/notify',
};

const ALIPAY_CONFIG = {
  appId: 'YOUR_ALIPAY_APPID',
  privateKey: 'YOUR_PRIVATE_KEY',
  alipayPublicKey: 'YOUR_ALIPAY_PUBLIC_KEY',
  notifyUrl: 'https://your-domain.com/api/payment/alipay/notify',
};
```

### 3. 集成到你的 Express 应用

```javascript
const express = require('express');
const paymentRouter = require('./backend-example/payment-api-example');

const app = express();

app.use(express.json());
app.use(express.text({ type: 'application/xml' })); // 用于微信回调
app.use('/api/payment', paymentRouter);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
```

## 注意事项

1. **订单存储**: 示例中使用内存 Map 存储订单，生产环境应使用数据库（如 MongoDB、MySQL 等）

2. **签名验证**: 
   - 微信支付使用 MD5 签名
   - 支付宝使用 RSA2 签名，需要实现相应的签名函数

3. **用户状态更新**: 在支付回调成功后，需要调用你的用户服务更新会员状态

4. **错误处理**: 实际应用中需要更完善的错误处理和日志记录

5. **安全性**: 
   - 使用 HTTPS
   - 验证回调签名
   - 防止重复支付
   - 验证订单金额

## 其他后端框架

如果你使用其他后端框架，可以参考这个示例的实现逻辑：

- **Python (Flask/Django)**: 使用 `requests` 库调用支付接口
- **Java (Spring Boot)**: 使用 `RestTemplate` 或 `WebClient`
- **Go**: 使用 `net/http` 包
- **PHP**: 使用 `curl` 或 `Guzzle`

核心逻辑相同，只是语法和 HTTP 客户端不同。

