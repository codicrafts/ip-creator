"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  RefreshCw,
  Play,
  Search,
} from "lucide-react";

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export default function AlipayTestPage() {
  const [step1Result, setStep1Result] = useState<TestResult | null>(null);
  const [step1Loading, setStep1Loading] = useState(false);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step3Result, setStep3Result] = useState<TestResult | null>(null);
  const [step3Loading, setStep3Loading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  // 步骤1：创建支付链接
  const handleCreatePayment = async () => {
    setStep1Loading(true);
    setStep1Result(null);
    setPaymentUrl(null);
    setCurrentOrderId(null);

    try {
      const response = await fetch("/api/payment/alipay/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          amount: "0.01", // 测试金额
          subject: "测试商品", // 按照支付宝沙箱测试示例
        }),
      });

      const result: TestResult = await response.json();

      if (result.success && result.data) {
        setStep1Result(result);
        setPaymentUrl(result.data.paymentUrl);
        setCurrentOrderId(result.data.orderId);
      } else {
        setStep1Result(result);
      }
    } catch (error: any) {
      setStep1Result({
        success: false,
        message: "创建支付链接失败",
        error: error.message || error.toString(),
      });
    } finally {
      setStep1Loading(false);
    }
  };

  // 步骤2：打开支付页面（用户完成支付）
  const handleOpenPayment = () => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
      setStep2Loading(true);
      // 3秒后自动停止loading（用户可能已经完成支付）
      setTimeout(() => {
        setStep2Loading(false);
      }, 3000);
    }
  };

  // 步骤3：查询订单状态
  const handleQueryOrder = async () => {
    if (!currentOrderId) {
      setStep3Result({
        success: false,
        message: "请先创建支付链接",
      });
      return;
    }

    setStep3Loading(true);
    setStep3Result(null);

    try {
      const response = await fetch("/api/payment/alipay/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "query",
          orderId: currentOrderId,
        }),
      });

      const result: TestResult = await response.json();
      setStep3Result(result);
    } catch (error: any) {
      setStep3Result({
        success: false,
        message: "查询订单失败",
        error: error.message || error.toString(),
      });
    } finally {
      setStep3Loading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            支付宝沙箱链路测试
          </h1>
          <p className="text-gray-600 text-sm">
            按照以下步骤完成支付宝沙箱支付测试流程
          </p>
        </div>

        {/* 步骤1：创建支付链接 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  单步测试-商家创建支付链接
                </h3>
                <p className="text-sm text-gray-500">
                  调用接口：alipay.trade.page.pay | 商家创建电脑网站支付的链接
                </p>
              </div>
            </div>
            <button
              onClick={handleCreatePayment}
              disabled={step1Loading}
              className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:bg-violet-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step1Loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  创建中...
                </>
              ) : (
                <>
                  <Play size={16} />
                  创建支付链接
                </>
              )}
            </button>
          </div>

          {/* 测试信息 */}
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 mb-4">
            <p className="text-sm font-semibold text-blue-800 mb-2">
              测试信息：
            </p>
            <div className="space-y-1 text-xs text-blue-700">
              <p>
                <strong>调用应用：</strong>sandbox 默认应用
              </p>
              <p>
                <strong>调用接口：</strong>alipay.trade.page.pay
              </p>
              <p>
                <strong>入参示例：</strong>
              </p>
              <pre className="bg-white p-2 rounded border border-blue-200 overflow-auto text-xs mt-1">
                {`{
   "biz_content": {
      "out_trade_no": "daniel82AAAA000032333361X09",
      "total_amount": 0.01,
      "subject": "测试商品",
      "product_code": "FAST_INSTANT_TRADE_PAY"
   }
}`}
              </pre>
            </div>
          </div>

          {step1Result && (
            <div
              className={`mt-4 p-4 rounded-xl border ${
                step1Result.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {step1Result.success ? (
                  <CheckCircle
                    size={20}
                    className="text-green-600 shrink-0 mt-0.5"
                  />
                ) : (
                  <XCircle
                    size={20}
                    className="text-red-600 shrink-0 mt-0.5"
                  />
                )}
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      step1Result.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {step1Result.message}
                  </p>
                  {step1Result.data && (
                    <div className="mt-2 space-y-2 text-sm">
                      <div>
                        <span className="text-gray-600">订单号：</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                          {step1Result.data.orderId}
                        </code>
                      </div>
                      <div>
                        <span className="text-gray-600">金额：</span>
                        <span className="font-semibold text-gray-800">
                          ¥{step1Result.data.amount}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">商品：</span>
                        <span className="text-gray-800">
                          {step1Result.data.subject}
                        </span>
                      </div>
                      {step1Result.data.paymentUrl && (
                        <div className="mt-3">
                          <p className="text-gray-600 text-xs mb-1">
                            支付链接：
                          </p>
                          <div className="bg-gray-100 p-2 rounded text-xs break-all">
                            {step1Result.data.paymentUrl.substring(0, 100)}...
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {step1Result.error && (
                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto text-red-800">
                      {step1Result.error}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 步骤2：用户完成支付 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  链路测试-用户完成支付
                </h3>
                <p className="text-sm text-gray-500">
                  在新窗口打开支付页面，使用沙箱账号完成支付
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenPayment}
              disabled={!paymentUrl || step2Loading}
              className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-semibold text-sm hover:bg-amber-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step2Loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  支付中...
                </>
              ) : (
                <>
                  <ExternalLink size={16} />
                  打开支付页面
                </>
              )}
            </button>
          </div>

          {!paymentUrl && (
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">
                请先完成步骤1，创建支付链接
              </p>
            </div>
          )}

          {paymentUrl && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                <strong>提示：</strong>
              </p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>点击"打开支付页面"按钮将在新窗口打开支付宝支付页面</li>
                <li>使用支付宝沙箱账号登录并完成支付（测试金额：¥0.01）</li>
                <li>支付完成后，可以继续步骤3查询订单状态</li>
              </ul>
            </div>
          )}
        </div>

        {/* 步骤3：查询订单状态 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  链路测试-商家查询收单交易结果
                </h3>
                <p className="text-sm text-gray-500">
                  调用 alipay.trade.query 接口查询订单支付状态
                </p>
              </div>
            </div>
            <button
              onClick={handleQueryOrder}
              disabled={!currentOrderId || step3Loading}
              className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step3Loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  查询中...
                </>
              ) : (
                <>
                  <Search size={16} />
                  查询订单
                </>
              )}
            </button>
          </div>

          {!currentOrderId && (
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <p className="text-sm text-gray-600">
                请先完成步骤1，创建支付链接
              </p>
            </div>
          )}

          {currentOrderId && (
            <div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-200 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">当前订单号：</span>
                <code className="bg-white px-2 py-1 rounded text-gray-800 ml-2">
                  {currentOrderId}
                </code>
              </p>
            </div>
          )}

          {step3Result && (
            <div
              className={`mt-4 p-4 rounded-xl border ${
                step3Result.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {step3Result.success ? (
                  <CheckCircle
                    size={20}
                    className="text-green-600 shrink-0 mt-0.5"
                  />
                ) : (
                  <XCircle
                    size={20}
                    className="text-red-600 shrink-0 mt-0.5"
                  />
                )}
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      step3Result.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {step3Result.message}
                  </p>
                  {step3Result.data && step3Result.data.queryResult && (
                    <div className="mt-2">
                      <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-auto max-h-96 text-gray-800">
                        {JSON.stringify(step3Result.data.queryResult, null, 2)}
                      </pre>
                    </div>
                  )}
                  {step3Result.error && (
                    <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto text-red-800">
                      {step3Result.error}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 说明信息 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-800 mb-3">测试说明</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>1. 环境配置：</strong>
              确保已配置支付宝沙箱环境的 APPID、私钥等参数
            </p>
            <p>
              <strong>2. 沙箱账号：</strong>
              需要在支付宝开放平台获取沙箱账号进行测试支付
            </p>
            <p>
              <strong>3. 测试流程：</strong>
              按照步骤1→步骤2→步骤3的顺序完成测试
            </p>
            <p>
              <strong>4. 订单查询：</strong>
              支付完成后，可以多次点击"查询订单"按钮查看订单状态变化
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
