'use client';

import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { PaymentMethod, CreateOrderRequest } from '@/types';
import { createPaymentOrder, launchWechatPay, launchAlipay, pollOrderStatus } from '@/services/paymentService';
import { getUserId } from '@/lib/cookies';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number; // 金额（元）
  productName: string;
  productDesc?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  amount,
  productName,
  productDesc,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('请选择支付方式');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setPaymentStatus('processing');

    try {
      // 1. 创建订单
      const request: CreateOrderRequest = {
        amount: Math.round(amount * 100), // 转换为分
        productName,
        productDesc,
        paymentMethod: selectedMethod,
        userId: getUserId() || undefined, // 如果有用户ID
      };

      const orderResponse = await createPaymentOrder(request);
      const { orderId, paymentParams } = orderResponse;

      // 2. 调起支付
      if (selectedMethod === PaymentMethod.WECHAT) {
        await launchWechatPay(paymentParams as any);
      } else if (selectedMethod === PaymentMethod.ALIPAY) {
        await launchAlipay((paymentParams as any).orderString);
      }

      // 3. 轮询订单状态
      const order = await pollOrderStatus(orderId);

      if (order.status === 'SUCCESS') {
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      } else {
        setPaymentStatus('failed');
        setError('支付失败，请重试');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentStatus('failed');
      setError(err.message || '支付失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSelectedMethod(null);
      setError(null);
      setPaymentStatus('idle');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md md:max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-violet-600 to-violet-700 p-6 text-white">
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
          <h2 className="text-2xl font-bold">升级会员</h2>
          <p className="text-violet-100 text-sm mt-1">{productDesc || '解锁更多功能'}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Amount Display */}
          <div className="text-center py-4 bg-gray-50 rounded-2xl">
            <div className="text-sm text-gray-500 mb-1">支付金额</div>
            <div className="text-4xl font-bold text-gray-900">
              ¥<span>{amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          {paymentStatus === 'idle' && (
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-700 mb-2">选择支付方式</div>
              
              <button
                onClick={() => setSelectedMethod(PaymentMethod.WECHAT)}
                disabled={isProcessing}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  selectedMethod === PaymentMethod.WECHAT
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-200'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedMethod === PaymentMethod.WECHAT ? 'bg-violet-100' : 'bg-gray-100'
                }`}>
                  <Smartphone size={24} className={selectedMethod === PaymentMethod.WECHAT ? 'text-violet-600' : 'text-gray-600'} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">微信支付</div>
                  <div className="text-xs text-gray-500">推荐使用</div>
                </div>
                {selectedMethod === PaymentMethod.WECHAT && (
                  <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </button>

              <button
                onClick={() => setSelectedMethod(PaymentMethod.ALIPAY)}
                disabled={isProcessing}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  selectedMethod === PaymentMethod.ALIPAY
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-violet-200'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedMethod === PaymentMethod.ALIPAY ? 'bg-violet-100' : 'bg-gray-100'
                }`}>
                  <CreditCard size={24} className={selectedMethod === PaymentMethod.ALIPAY ? 'text-violet-600' : 'text-gray-600'} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-900">支付宝</div>
                  <div className="text-xs text-gray-500">安全便捷</div>
                </div>
                {selectedMethod === PaymentMethod.ALIPAY && (
                  <div className="w-5 h-5 rounded-full bg-violet-600 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </button>
            </div>
          )}

          {/* Processing Status */}
          {paymentStatus === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 text-violet-600 animate-spin" />
              <div className="text-center">
                <div className="font-semibold text-gray-900">正在处理支付...</div>
                <div className="text-sm text-gray-500 mt-1">请完成支付操作</div>
              </div>
            </div>
          )}

          {/* Success Status */}
          {paymentStatus === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-lg">支付成功！</div>
                <div className="text-sm text-gray-500 mt-1">正在为您升级会员...</div>
              </div>
            </div>
          )}

          {/* Failed Status */}
          {paymentStatus === 'failed' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <XCircle className="w-16 h-16 text-red-500" />
              <div className="text-center">
                <div className="font-semibold text-gray-900 text-lg">支付失败</div>
                <div className="text-sm text-gray-500 mt-1">{error || '请重试'}</div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && paymentStatus === 'idle' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          {paymentStatus === 'idle' && (
            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                !selectedMethod || isProcessing
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-700 active:scale-95'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  处理中...
                </>
              ) : (
                <>
                  <CreditCard size={18} />
                  确认支付 ¥{amount.toFixed(2)}
                </>
              )}
            </button>
          )}

          {paymentStatus === 'failed' && (
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setPaymentStatus('idle');
                  setError(null);
                }}
                className="flex-1 py-3 rounded-xl font-semibold bg-violet-600 text-white hover:bg-violet-700"
              >
                重试
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

