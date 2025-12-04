export enum AppView {
  HOME = "HOME",
  UPLOAD = "UPLOAD",
  EDIT = "EDIT",
  RESULT = "RESULT",
  PROFILE = "PROFILE",
  MEME_EDITOR = "MEME_EDITOR",
}

export interface GeneratedImage {
  id: string; // Added unique ID
  url: string;
  timestamp: number;
  prompt: string;
  style?: string; // Optional style info
}

export enum LoadingState {
  IDLE = "IDLE",
  UPLOADING = "UPLOADING",
  GENERATING = "GENERATING",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

export enum UserTier {
  FREE = "FREE",
  BASIC = "BASIC", // 基础会员
  STANDARD = "STANDARD", // 标准会员
  PREMIUM = "PREMIUM", // 高级会员
}

export interface DailyUsage {
  date: string; // YYYY-MM-DD
  count: number;
}

export enum AnimationType {
  NONE = "none",
  SHAKE = "shake",
  PULSE = "pulse",
  ZOOM = "zoom",
  SPIN = "spin",
  BOUNCE = "bounce",
  WIGGLE = "wiggle",
  FADE = "fade",
  FLIP = "flip",
  SWING = "swing",
  ROTATE = "rotate",
}

export interface MemeDraft {
  id: string;
  sourceUrl: string;
  generatedUrl: string | null;
  text: string; // The text overlay
  moodPrompt: string; // e.g., "laughing out loud"
  status: "pending" | "generating" | "done" | "error";
  animation: AnimationType;
  textPosition?: "top" | "bottom"; // 表情文案位置：上方或下方
  backgroundType?: "transparent" | "white" | "color"; // 背景类型
  backgroundColor?: string; // 背景颜色（当 backgroundType 为 'color' 时使用）
  removeBackground?: boolean; // 擦除背景开关
  refineForeground?: boolean; // 精炼边缘开关（更高质量，但更慢）
  // 多分组结果（类似多场景页面的 sceneDrafts）
  groupResults?: Array<{
    generatedUrl: string | null;
    status: "pending" | "generating" | "done" | "error";
  }>;
  // 多分组文本信息（持久化存储，避免依赖 useRef）
  prompts?: Array<{
    text: string;
    moodPrompt: string;
    textPosition?: "top" | "bottom";
  }>;
}

// 场景扩展草稿
export interface SceneDraft {
  id: string;
  sourceUrl: string;
  sourceMimeType: string;
  generatedUrl: string | null;
  prompt: string;
  style?: string;
  status: "pending" | "generating" | "done" | "error";
}

// 资源库类型
export interface LibraryResource {
  id: string;
  userId?: string; // 用户ID（如果已登录）
  name: string; // 资源名称
  url: string; // 图片 URL（云存储链接）
  fileId: string; // 云存储文件ID
  mimeType: string; // 图片 MIME 类型
  timestamp: number; // 上传时间
  fileSize?: number; // 文件大小（字节）
}

// Payment Types
export enum PaymentMethod {
  WECHAT = "WECHAT",
  ALIPAY = "ALIPAY",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  NOTPAY = "NOTPAY", // 未支付（微信支付状态）
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  CLOSED = "CLOSED", // 已关闭（微信支付状态）
  REFUND = "REFUND", // 转入退款（微信支付状态）
}

export interface PaymentOrder {
  orderId: string;
  amount: number; // 金额（分）
  productName: string;
  productDesc?: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  createdAt: number;
  paidAt?: number;
}

export interface CreateOrderRequest {
  amount: number; // 金额（分）
  productName: string;
  productDesc?: string;
  paymentMethod: PaymentMethod;
  userId?: string;
  planId?: string; // 会员计划ID（BASIC, STANDARD, PREMIUM）
  isFirstMonth?: boolean; // 是否首月（享受6折优惠）
  tradeType?: "JSAPI" | "NATIVE" | "MWEB" | "APP"; // 微信支付类型：JSAPI=小程序/公众号支付，NATIVE=扫码支付，MWEB=H5支付
  openid?: string; // 小程序/公众号支付必填
}

export interface CreateOrderResponse {
  orderId: string;
  paymentParams: WechatPaymentParams | AlipayPaymentParams;
}

// 微信支付参数
export interface WechatPaymentParams {
  appId?: string; // 微信内 JSAPI 支付需要
  timeStamp?: string; // 微信内 JSAPI 支付需要
  nonceStr?: string; // 微信内 JSAPI 支付需要
  package?: string; // prepay_id=xxx（微信内 JSAPI 支付需要）
  signType?: string; // 微信内 JSAPI 支付需要
  paySign?: string; // 微信内 JSAPI 支付需要
  mwebUrl?: string; // H5 支付地址（移动端非微信环境，跳转到微信收银台）
  codeUrl?: string; // Native 支付二维码地址（PC 端，用于生成二维码）
}

// 支付宝支付参数
export interface AlipayPaymentParams {
  orderString?: string; // 支付宝订单字符串（旧版，已废弃）
  paymentUrl?: string; // 支付宝支付页面链接（PC端使用）
}
