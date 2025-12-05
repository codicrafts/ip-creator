import React from "react";
import { 
  MapPin, 
  Target, 
  Lightbulb, 
  Users, 
  HeartHandshake, 
  Mail, 
  Layers
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-white pt-24 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-violet-100/50 rounded-full mix-blend-multiply filter blur-[60px] animate-blob"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-[60px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            关于我们
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            用技术驱动创新，以专业成就价值
          </p>
        </div>
      </section>

      {/* Company Profile */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="bg-linear-to-br from-violet-500 to-indigo-600 p-1 rounded-3xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-[22px] p-8 h-full overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full -mr-16 -mt-16 transition-transform duration-500 hover:scale-150"></div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="text-violet-600" /> 坐标与定位
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      公司坐落于北京中关村科技园区核心区海淀园，这里聚集着中国最具创新活力的科技力量。
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      作为 AI 驱动的数字化转型终身技术合伙人，我们深耕互联网软件技术开发与咨询服务，以技术为引擎，持续为客户构建高效能的数字化解决方案。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">
                织码者（北京）科技有限责任公司
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                我们致力于成为全球领先的知识服务基础设施提供商。立足中国，放眼全球，构建覆盖技术研发、数据智能、业务场景的全栈能力体系。
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-3xl font-bold text-violet-600 mb-1">10+</div>
                  <div className="text-sm text-gray-500">年技术沉淀</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-3xl font-bold text-indigo-600 mb-1">100%</div>
                  <div className="text-sm text-gray-500">大厂核心团队</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600 mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">我们的使命</h3>
              <h4 className="text-lg font-semibold text-violet-600 mb-4">
                用代码编织未来，以智能赋能增长
              </h4>
              <p className="text-gray-600 leading-relaxed">
                我们相信，每一行代码都是连接现实与未来的桥梁。通过前沿技术的深度应用，帮助客户突破效率瓶颈、降低运营成本、优化管理体系，让数字化价值渗透到业务的每一个环节。
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <Lightbulb size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">我们的愿景</h3>
              <h4 className="text-lg font-semibold text-indigo-600 mb-4">
                成为全球领先的知识服务基础设施提供商
              </h4>
              <p className="text-gray-600 leading-relaxed">
                立足中国，放眼全球，我们致力于构建覆盖技术研发、数据智能、业务场景的全栈能力体系，为企业级客户打造可信赖的数字化基础设施，最终成为支撑全球知识经济发展的核心技术力量。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">核心优势</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            深谙行业痛点的资深开发者，持续探索技术前沿的创新者
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="flex gap-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <Users size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">精英团队</h3>
              <p className="text-gray-600 leading-relaxed">
                团队核心成员拥有十年以上互联网软件技术开发经验，具备大厂经验，曾主导或参与多个千万级用户规模的技术项目。从架构设计到落地实施，为客户提供兼具前瞻性与可行性的技术解决方案。
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <HeartHandshake size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">价值主张</h3>
              <p className="text-gray-600 leading-relaxed">
                我们不止是技术服务提供商，更是与客户共同成长的战略伙伴。通过将 AI、大数据、云计算等技术与行业场景深度融合，助力客户实现从效率提升到模式创新的全链路进化。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">联系我们</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Mail className="text-violet-400" />
              </div>
              <span className="text-lg font-medium">support@zhimazhe.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="mb-4 md:mb-0 flex flex-col md:items-start items-center gap-2">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-gray-400" />
              <span>&copy; {new Date().getFullYear()} 织码者（北京）科技有限责任公司</span>
            </div>
            <span className="text-xs text-gray-400">备案号：冀ICP备2025106130号-3</span>
          </div>
          <div className="flex gap-8 font-medium">
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-violet-600 transition-colors">
              服务条款
            </Link>
            <Link href="/about" className="hover:text-violet-600 transition-colors">
              关于我们
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

