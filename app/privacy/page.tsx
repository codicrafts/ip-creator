import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
          <p className="text-gray-500 text-sm">最后更新日期：2025年12月01日</p>
        </div>

        <div className="prose prose-violet max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">1. 引言</h2>
            <p>
              欢迎使用 IP
              创想坊（以下简称“我们”或“本服务”）。我们需要收集和处理您的某些信息，以便为您提供优质的
              AI
              创意生成服务。本隐私政策旨在帮助您了解我们如何收集、使用、存储和保护您的个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              2. 我们收集的信息
            </h2>
            <p>在使用我们的服务时，我们可能会收集以下类型的信息：</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>账户信息：</strong>
                当您注册或登录时，我们可能会收集您的手机号码，用于验证身份和管理账户。
              </li>
              <li>
                <strong>用户内容：</strong>
                您上传的图片、输入的提示词（Prompts）以及生成的图片内容。
              </li>
              <li>
                <strong>使用数据：</strong>
                关于您如何访问和使用服务的信息，例如访问时间、使用的功能等。
              </li>
              <li>
                <strong>设备信息：</strong>
                我们可能会收集有关您访问服务的设备信息，如设备型号、操作系统版本等。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              3. 我们如何使用您的信息
            </h2>
            <p>我们将收集的信息用于以下目的：</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>提供、维护和改进我们的服务。</li>
              <li>处理您的生成请求，利用 AI 模型生成图像。</li>
              <li>管理您的账户和会员订阅。</li>
              <li>发送服务通知、更新和安全警报。</li>
              <li>防止欺诈和滥用，确保服务安全。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              4. 信息共享与披露
            </h2>
            <p>我们不会向第三方出售您的个人信息。但在以下情况下，我们可能会共享您的信息：</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>服务提供商：</strong>
                我们可能会与提供基础设施、AI
                模型推理（如 Google Gemini）、云存储、支付处理等服务的第三方合作伙伴共享必要信息。
              </li>
              <li>
                <strong>法律要求：</strong>
                如果法律法规要求，或为了保护我们的权利、财产或安全，我们可能会披露您的信息。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              5. 数据安全
            </h2>
            <p>
              我们采取合理的安全措施来保护您的信息免受未经授权的访问、使用或披露。然而，请注意，互联网传输和电子存储并非 100%
              安全，我们无法保证信息的绝对安全。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              6. 您的权利
            </h2>
            <p>根据适用法律，您可能拥有以下权利：</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>访问、更正或删除您的个人信息。</li>
              <li>撤回您的同意。</li>
              <li>注销您的账户。</li>
            </ul>
            <p className="mt-2">
              如需行使这些权利，请通过“关于我们”中的联系方式与我们联系。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              7. 变更通知
            </h2>
            <p>
              我们可能会不时更新本隐私政策。更新后的政策将发布在此页面上，并注明更新日期。继续使用我们的服务即表示您接受修订后的隐私政策。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              8. 联系我们
            </h2>
            <p>
              如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
              <br />
              电子邮件：support@zhimazhe.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

