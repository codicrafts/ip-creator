/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack 配置（Next.js 16 默认使用 Turbopack）
  turbopack: {
    // Turbopack 配置项
  },
  // 如果需要使用 webpack，可以通过 --webpack 标志显式启用
  // 但建议使用 Turbopack
  // 配置静态文件服务，允许访问 node_modules 中的文件
  async rewrites() {
    return [
      {
        source: "/node_modules/:path*",
        destination: "/node_modules/:path*",
      },
    ];
  },
};

export default nextConfig;
