import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">服务条款</h1>
          <p className="text-gray-500 text-sm">最后更新日期：2025年12月01日</p>
        </div>

        <div className="prose prose-violet max-w-none text-gray-600 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              1. 条款接受
            </h2>
            <p>
              欢迎使用 IP
              创想坊（以下简称“本服务”）。通过访问或使用本服务，即表示您同意受本服务条款（以下简称“本条款”）的约束。如果您不同意本条款的任何部分，请勿使用本服务。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              2. 账户注册与安全
            </h2>
            <p>
              使用本服务的某些功能可能需要您注册账户。您同意提供准确、完整和最新的注册信息。您有责任维护账户凭证的保密性，并对您账户下的所有活动负责。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              3. 服务使用规范
            </h2>
            <p>您同意在使用本服务时遵守所有适用法律法规，且不得进行以下行为：</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>上传或生成任何非法、色情、暴力、仇恨言论或侵犯他人权益的内容。</li>
              <li>利用本服务进行任何欺诈、恶意攻击或破坏服务稳定性的行为。</li>
              <li>反向工程、反编译或试图提取本服务的源代码。</li>
              <li>未经授权自动访问本服务（如使用爬虫脚本）。</li>
            </ul>
            <p className="mt-2">
              如果你违反上述规定，我们有权随时暂停或终止您的账户，并保留追究法律责任的权利。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              4. 知识产权与用户内容
            </h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>您的内容：</strong>
                您保留您上传到本服务的原始图片的所有权。对于通过本服务生成的图片，在适用法律允许的范围内，您拥有生成的图片的所有权和使用权。
              </li>
              <li>
                <strong>许可：</strong>
                为了提供服务，您授予我们非独家、全球性、免版税的许可，以使用、存储、复制和处理您上传的内容及生成的图片，仅用于服务运营、改进 AI 模型和展示（如果您选择公开）。
              </li>
              <li>
                <strong>本服务权利：</strong>
                本服务及其所有软件、设计、技术和相关知识产权归我们所有。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              5. 付费与订阅
            </h2>
            <p>
              本服务提供部分免费功能和付费会员服务。
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>付费服务的价格和权益将在购买页面明确列出。</li>
              <li>除法律规定或我们另有说明外，已支付的费用不予退还。</li>
              <li>我们保留随时调整服务价格的权利，调整后的价格将在下一次订阅周期生效。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              6. 免责声明
            </h2>
            <p>
              本服务按“现状”和“现有”基础提供。我们不保证服务不会中断、没有错误或绝对安全。
              AI 生成的内容具有随机性和不确定性，我们不对生成内容的准确性、完整性或适用性做任何保证。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              7. 责任限制
            </h2>
            <p>
              在法律允许的最大范围内，我们不对因使用或无法使用本服务而导致的任何间接、附带、特殊或后果性损害承担责任，包括但不限于利润损失、数据丢失或业务中断。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              8. 条款修改
            </h2>
            <p>
              我们保留随时修改本条款的权利。修改后的条款一旦发布即生效。您继续使用本服务将被视为接受修改后的条款。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              9. 联系我们
            </h2>
            <p>
              如有任何问题，请联系：support@zhimazhe.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

