# 微信和支付宝支付接入指南

本文档说明如何将微信支付和支付宝支付集成到 IP 创想坊项目中。

## 📋 目录

- [架构说明](#架构说明)
- [后端 API 要求](#后端-api-要求)
- [环境配置](#环境配置)
- [微信支付接入](#微信支付接入)
- [支付宝支付接入](#支付宝支付接入)
- [测试流程](#测试流程)
- [常见问题](#常见问题)

## 🏗️ 架构说明

支付流程采用前后端分离架构：

```
前端 (React) → 后端 API → 微信/支付宝 → 后端回调 → 前端轮询
```

### 支付流程

1. **创建订单**：前端调用后端 API 创建支付订单
2. **调起支付**：前端使用返回的支付参数调起微信/支付宝支付
3. **支付完成**：用户完成支付后，支付平台回调后端
4. **查询状态**：前端轮询后端 API 查询订单状态
5. **更新会员**：支付成功后，前端更新用户会员状态

## 🔧 后端 API 要求

你的后端需要提供以下 API 接口：

### 1. 创建支付订单

**接口地址：** `POST /api/payment/create`

**请求体：**
```json
{
  "amount": 2990,           // 金额（分）
  "productName": "IP 创想坊会员",
  "productDesc": "解锁每日 50 次生成额度",
  "paymentMethod": "WECHAT" | "ALIPAY",
  "userId": "optional_user_id"
}
```

**响应体：**
```json
{
  "orderId": "ORDER_20240101_123456",
  "paymentParams": {
    // 微信支付参数
    "appId": "wx1234567890",
    "timeStamp": "1234567890",
    "nonceStr": "abc123",
    "package": "prepay_id=wx123456789",
    "signType": "RSA",
    "paySign": "signature_string"
    
    // 或支付宝支付参数
    "orderString": "app_id=xxx&biz_content=xxx&..."
  }
}
```

### 2. 查询订单状态

**接口地址：** `GET /api/payment/query/:orderId`

**响应体：**
```json
{
  "orderId": "ORDER_20240101_123456",
  "amount": 2990,
  "productName": "IP 创想坊会员",
  "paymentMethod": "WECHAT",
  "status": "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED",
  "createdAt": 1704067200000,
  "paidAt": 1704067300000
}
```

### 3. 支付回调接口（后端内部）

**微信支付回调：** `POST /api/payment/wechat/notify`
**支付宝支付回调：** `POST /api/payment/alipay/notify`

这些接口由支付平台调用，用于通知后端支付结果。

## ⚙️ 环境配置

### 1. 设置后端 API 地址

在项目根目录创建 `.env` 文件：

```env
VITE_PAYMENT_API_URL=https://your-api-domain.com/api/payment
```

或者在 `vite.config.ts` 中配置：

```typescript
define: {
  'process.env.VITE_PAYMENT_API_URL': JSON.stringify('https://your-api-domain.com/api/payment')
}
```

### 2. 安装依赖（如果需要）

当前实现使用原生 JavaScript API，无需额外依赖。如果需要更完善的支付 SDK，可以考虑：

```bash
# 微信支付 JSSDK（可选）
npm install weixin-js-sdk

# 支付宝 SDK（可选）
npm install alipay-sdk
```

## 💰 微信支付接入

### 1. 申请微信支付商户号

1. 访问 [微信支付商户平台](https://pay.weixin.qq.com/)
2. 注册并完成企业认证
3. 获取以下信息：
   - 商户号（mch_id）
   - API 密钥（API Key）
   - 小程序 AppID（如果使用小程序支付）
   - 公众号 AppID（如果使用公众号支付）

### 2. 后端实现

后端需要使用微信支付统一下单接口：

```javascript
// 示例：Node.js + axios
const axios = require('axios');
const crypto = require('crypto');

async function createWechatOrder(orderData) {
  const params = {
    appid: 'YOUR_APPID',
    mch_id: 'YOUR_MCH_ID',
    nonce_str: generateNonceStr(),
    body: orderData.productName,
    out_trade_no: orderData.orderId,
    total_fee: orderData.amount, // 单位：分
    spbill_create_ip: 'YOUR_SERVER_IP',
    notify_url: 'https://your-domain.com/api/payment/wechat/notify',
    trade_type: 'JSAPI', // 或 'MWEB' 用于 H5 支付
    openid: orderData.openid, // JSAPI 需要
  };
  
  // 生成签名
  params.sign = generateSign(params, 'YOUR_API_KEY');
  
  // 调用统一下单接口
  const response = await axios.post(
    'https://api.mch.weixin.qq.com/pay/unifiedorder',
    convertToXml(params)
  );
  
  // 解析返回的 prepay_id
  const prepayId = parseXmlResponse(response.data);
  
  // 生成前端调起支付所需的参数
  return {
    appId: params.appid,
    timeStamp: String(Math.floor(Date.now() / 1000)),
    nonceStr: generateNonceStr(),
    package: `prepay_id=${prepayId}`,
    signType: 'RSA', // 或 'MD5'
    paySign: generatePaySign(...) // 根据 signType 生成
  };
}
```

### 3. 前端调用

前端代码已实现，位于 `services/paymentService.ts` 的 `launchWechatPay` 函数。

**注意事项：**
- 微信支付需要在微信环境中打开
- 需要引入微信 JS-SDK 或使用 WeixinJSBridge
- H5 支付需要配置支付域名

### 4. 配置支付域名

在微信商户平台配置：
- **JSAPI 支付域名**：你的网站域名
- **H5 支付域名**：你的网站域名

## 💳 支付宝支付接入

### 1. 申请支付宝开放平台账号

1. 访问 [支付宝开放平台](https://open.alipay.com/)
2. 注册并完成企业认证
3. 创建应用并获取：
   - AppID
   - 应用私钥（RSA2）
   - 支付宝公钥

### 2. 后端实现

后端需要使用支付宝手机网站支付接口：

```javascript
// 示例：Node.js + alipay-sdk
const AlipaySdk = require('alipay-sdk').default;
const AlipayFormData = require('alipay-sdk/lib/form').default;

const alipaySdk = new AlipaySdk({
  appId: 'YOUR_APP_ID',
  privateKey: 'YOUR_PRIVATE_KEY',
  alipayPublicKey: 'YOUR_ALIPAY_PUBLIC_KEY',
  gateway: 'https://openapi.alipay.com/gateway.do',
});

async function createAlipayOrder(orderData) {
  const formData = new AlipayFormData();
  formData.setMethod('alipay.trade.wap.pay');
  formData.addField('bizContent', {
    out_trade_no: orderData.orderId,
    product_code: 'QUICK_WAP_WAY',
    total_amount: (orderData.amount / 100).toFixed(2), // 转换为元
    subject: orderData.productName,
    body: orderData.productDesc || '',
  });
  formData.addField('return_url', 'https://your-domain.com/payment/return');
  formData.addField('notify_url', 'https://your-domain.com/api/payment/alipay/notify');
  
  const result = await alipaySdk.exec('alipay.trade.wap.pay', {}, { formData });
  
  return {
    orderString: result // 返回订单字符串
  };
}
```

### 3. 前端调用

前端代码已实现，位于 `services/paymentService.ts` 的 `launchAlipay` 函数。

**注意事项：**
- 支付宝支付会跳转到支付宝页面
- 支付完成后会跳转回 `return_url`
- 需要通过轮询查询订单状态

## 🧪 测试流程

### 1. 开发环境测试

#### 微信支付测试

1. 使用微信支付沙箱环境
2. 配置测试商户号和测试密钥
3. 使用测试账号进行支付

#### 支付宝支付测试

1. 使用支付宝沙箱环境
2. 配置沙箱应用信息
3. 使用沙箱账号进行支付

### 2. 测试步骤

1. **启动开发服务器**
   ```bash
   npm run dev
   ```

2. **配置后端 API 地址**
   - 确保 `.env` 文件中的 `VITE_PAYMENT_API_URL` 指向你的后端

3. **测试支付流程**
   - 打开应用，进入"我的"页面
   - 点击"升级会员"按钮
   - 选择支付方式
   - 完成支付流程

4. **验证支付结果**
   - 检查订单状态是否正确更新
   - 验证会员状态是否已升级
   - 检查额度是否已更新

## ❓ 常见问题

### Q1: 微信支付提示"请在微信中打开"

**A:** 微信支付必须在微信环境中使用。如果需要在浏览器中测试，可以使用：
- 微信开发者工具的调试功能
- 微信支付 H5 支付（需要配置支付域名）

### Q2: 支付宝支付后无法获取支付结果

**A:** 支付宝支付是异步的，需要通过以下方式确认：
1. 轮询订单状态（已实现）
2. 配置 `return_url` 接收同步通知
3. 配置 `notify_url` 接收异步通知

### Q3: 支付成功后会员状态未更新

**A:** 检查以下几点：
1. 后端回调是否正确处理
2. 订单状态是否正确更新
3. 前端轮询是否正常工作
4. 会员状态更新逻辑是否正确

### Q4: 如何修改会员价格？

**A:** 在 `App.tsx` 中修改 `PaymentModal` 的 `amount` 属性：

```tsx
<PaymentModal
  amount={29.9} // 修改这里
  ...
/>
```

### Q5: 如何添加更多支付方式？

**A:** 
1. 在 `types.ts` 的 `PaymentMethod` 枚举中添加新类型
2. 在 `paymentService.ts` 中添加对应的调起支付函数
3. 在 `PaymentModal.tsx` 中添加支付方式选项

## 📚 参考资源

- [微信支付开发文档](https://pay.weixin.qq.com/wiki/doc/apiv3/index.shtml)
- [支付宝开放平台文档](https://opendocs.alipay.com/)
- [微信支付 JSAPI 调起支付](https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_4.shtml)
- [支付宝手机网站支付](https://opendocs.alipay.com/open/203/105285)

## 🔒 安全注意事项

1. **密钥安全**
   - 永远不要在前端代码中暴露支付密钥
   - 所有签名操作必须在后端完成
   - 使用 HTTPS 传输所有支付相关数据

2. **订单验证**
   - 后端必须验证订单金额和商品信息
   - 验证支付回调的签名
   - 防止重复支付

3. **用户数据**
   - 不要在前端存储敏感支付信息
   - 使用安全的用户认证机制

## 📝 更新日志

- **2024-01-01**: 初始版本，支持微信支付和支付宝支付

