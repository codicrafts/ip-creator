/**
 * 支付后端 API 示例
 * 
 * 这是一个 Node.js + Express 的示例实现
 * 实际使用时需要根据你的后端框架进行调整
 */

const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const router = express.Router();

// ==================== 配置 ====================
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

// 订单存储（实际应使用数据库）
const orders = new Map();

// ==================== 工具函数 ====================

// 生成随机字符串
function generateNonceStr(length = 32) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

// 生成微信支付签名
function generateWechatSign(params, apiKey) {
  const sortedKeys = Object.keys(params).sort();
  const stringA = sortedKeys
    .filter(key => params[key] && key !== 'sign')
    .map(key => `${key}=${params[key]}`)
    .join('&');
  const stringSignTemp = `${stringA}&key=${apiKey}`;
  return crypto.createHash('md5').update(stringSignTemp).digest('hex').toUpperCase();
}

// XML 转对象
function xmlToObject(xml) {
  const result = {};
  const regex = /<(\w+)>(.*?)<\/\1>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    result[match[1]] = match[2];
  }
  return result;
}

// 对象转 XML
function objectToXml(obj) {
  let xml = '<xml>';
  for (const key in obj) {
    xml += `<${key}>${obj[key]}</${key}>`;
  }
  xml += '</xml>';
  return xml;
}

// ==================== API 路由 ====================

/**
 * 创建支付订单
 * POST /api/payment/create
 */
router.post('/create', async (req, res) => {
  try {
    const { amount, productName, productDesc, paymentMethod, userId } = req.body;

    // 验证参数
    if (!amount || !productName || !paymentMethod) {
      return res.status(400).json({ message: '缺少必要参数' });
    }

    // 生成订单ID
    const orderId = `ORDER_${Date.now()}_${generateNonceStr(8)}`;

    // 保存订单
    const order = {
      orderId,
      amount,
      productName,
      productDesc,
      paymentMethod,
      userId,
      status: 'PENDING',
      createdAt: Date.now(),
    };
    orders.set(orderId, order);

    let paymentParams;

    if (paymentMethod === 'WECHAT') {
      // 创建微信支付订单
      paymentParams = await createWechatOrder(order);
    } else if (paymentMethod === 'ALIPAY') {
      // 创建支付宝支付订单
      paymentParams = await createAlipayOrder(order);
    } else {
      return res.status(400).json({ message: '不支持的支付方式' });
    }

    res.json({
      orderId,
      paymentParams,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message || '创建订单失败' });
  }
});

/**
 * 查询订单状态
 * GET /api/payment/query/:orderId
 */
router.get('/query/:orderId', (req, res) => {
  const { orderId } = req.params;
  const order = orders.get(orderId);

  if (!order) {
    return res.status(404).json({ message: '订单不存在' });
  }

  res.json(order);
});

/**
 * 微信支付回调
 * POST /api/payment/wechat/notify
 */
router.post('/wechat/notify', (req, res) => {
  try {
    // 解析微信回调数据
    const data = xmlToObject(req.body);
    
    // 验证签名
    const sign = data.sign;
    delete data.sign;
    const calculatedSign = generateWechatSign(data, WECHAT_CONFIG.apiKey);
    
    if (sign !== calculatedSign) {
      return res.send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>');
    }

    // 处理支付结果
    if (data.return_code === 'SUCCESS' && data.result_code === 'SUCCESS') {
      const orderId = data.out_trade_no;
      const order = orders.get(orderId);
      
      if (order) {
        order.status = 'SUCCESS';
        order.paidAt = Date.now();
        order.transactionId = data.transaction_id;
        orders.set(orderId, order);
        
        // TODO: 更新用户会员状态
        // updateUserTier(order.userId, 'PREMIUM');
      }
    }

    // 返回成功响应
    res.send('<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>');
  } catch (error) {
    console.error('Wechat notify error:', error);
    res.send('<xml><return_code><![CDATA[FAIL]]></return_code></xml>');
  }
});

/**
 * 支付宝支付回调
 * POST /api/payment/alipay/notify
 */
router.post('/alipay/notify', async (req, res) => {
  try {
    // 解析支付宝回调数据
    const data = req.body;
    
    // 验证签名（需要根据支付宝 SDK 实现）
    // const isValid = verifyAlipaySign(data, ALIPAY_CONFIG.alipayPublicKey);
    // if (!isValid) {
    //   return res.send('fail');
    // }

    // 处理支付结果
    if (data.trade_status === 'TRADE_SUCCESS' || data.trade_status === 'TRADE_FINISHED') {
      const orderId = data.out_trade_no;
      const order = orders.get(orderId);
      
      if (order) {
        order.status = 'SUCCESS';
        order.paidAt = Date.now();
        order.transactionId = data.trade_no;
        orders.set(orderId, order);
        
        // TODO: 更新用户会员状态
        // updateUserTier(order.userId, 'PREMIUM');
      }
    }

    // 返回成功响应
    res.send('success');
  } catch (error) {
    console.error('Alipay notify error:', error);
    res.send('fail');
  }
});

// ==================== 支付订单创建函数 ====================

/**
 * 创建微信支付订单
 */
async function createWechatOrder(order) {
  const params = {
    appid: WECHAT_CONFIG.appId,
    mch_id: WECHAT_CONFIG.mchId,
    nonce_str: generateNonceStr(),
    body: order.productName,
    out_trade_no: order.orderId,
    total_fee: order.amount, // 单位：分
    spbill_create_ip: req.ip || '127.0.0.1',
    notify_url: WECHAT_CONFIG.notifyUrl,
    trade_type: 'JSAPI', // JSAPI: 公众号支付, MWEB: H5支付
    // openid: order.openid, // JSAPI 需要
  };

  // 生成签名
  params.sign = generateWechatSign(params, WECHAT_CONFIG.apiKey);

  // 调用微信统一下单接口
  const response = await axios.post(
    'https://api.mch.weixin.qq.com/pay/unifiedorder',
    objectToXml(params),
    {
      headers: { 'Content-Type': 'application/xml' },
    }
  );

  // 解析返回结果
  const result = xmlToObject(response.data);
  
  if (result.return_code !== 'SUCCESS' || result.result_code !== 'SUCCESS') {
    throw new Error(result.err_code_des || '微信支付下单失败');
  }

  const prepayId = result.prepay_id;

  // 生成前端调起支付所需的参数
  const payParams = {
    appId: params.appid,
    timeStamp: String(Math.floor(Date.now() / 1000)),
    nonceStr: generateNonceStr(),
    package: `prepay_id=${prepayId}`,
    signType: 'MD5',
  };

  // 生成支付签名
  payParams.paySign = generateWechatSign(payParams, WECHAT_CONFIG.apiKey);

  return payParams;
}

/**
 * 创建支付宝支付订单
 */
async function createAlipayOrder(order) {
  // 这里使用简化的方式，实际应使用支付宝 SDK
  // 参考：https://opendocs.alipay.com/open/203/105285
  
  const params = {
    app_id: ALIPAY_CONFIG.appId,
    method: 'alipay.trade.wap.pay',
    charset: 'utf-8',
    sign_type: 'RSA2',
    timestamp: new Date().toISOString().replace(/T/, ' ').substring(0, 19),
    version: '1.0',
    biz_content: JSON.stringify({
      out_trade_no: order.orderId,
      product_code: 'QUICK_WAP_WAY',
      total_amount: (order.amount / 100).toFixed(2), // 转换为元
      subject: order.productName,
      body: order.productDesc || '',
    }),
    return_url: 'https://your-domain.com/payment/return',
    notify_url: ALIPAY_CONFIG.notifyUrl,
  };

  // 生成签名（需要使用 RSA2 签名）
  // params.sign = generateAlipaySign(params, ALIPAY_CONFIG.privateKey);

  // 构建订单字符串
  const orderString = Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  return {
    orderString,
  };
}

module.exports = router;

