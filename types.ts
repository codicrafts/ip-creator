export enum AppView {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  EDIT = 'EDIT',
  RESULT = 'RESULT',
  PROFILE = 'PROFILE',
  MEME_EDITOR = 'MEME_EDITOR'
}

export interface GeneratedImage {
  id: string; // Added unique ID
  url: string;
  timestamp: number;
  prompt: string;
  style?: string; // Optional style info
}

export enum LoadingState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export enum UserTier {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface DailyUsage {
  date: string; // YYYY-MM-DD
  count: number;
}

export enum AnimationType {
  NONE = 'none',
  SHAKE = 'shake',
  PULSE = 'pulse',
  ZOOM = 'zoom',
  SPIN = 'spin'
}

export interface MemeDraft {
  id: string;
  sourceUrl: string;
  generatedUrl: string | null;
  text: string; // The text overlay
  moodPrompt: string; // e.g., "laughing out loud"
  status: 'pending' | 'generating' | 'done' | 'error';
  animation: AnimationType;
}

// Payment Types
export enum PaymentMethod {
  WECHAT = 'WECHAT',
  ALIPAY = 'ALIPAY'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
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
}

export interface CreateOrderResponse {
  orderId: string;
  paymentParams: WechatPaymentParams | AlipayPaymentParams;
}

// 微信支付参数
export interface WechatPaymentParams {
  appId: string;
  timeStamp: string;
  nonceStr: string;
  package: string; // prepay_id=xxx
  signType: string;
  paySign: string;
}

// 支付宝支付参数
export interface AlipayPaymentParams {
  orderString: string; // 支付宝订单字符串
}