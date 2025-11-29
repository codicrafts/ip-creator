import { NextRequest, NextResponse } from "next/server";

// 配置允许访问的固定IP白名单
const IP_WHITELIST = ["192.168.1.17", "127.0.0.1", "::1"];

export function middleware(request: NextRequest) {
  // 从多个可能的请求头中获取客户端IP
  let clientIp =
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("cf-connecting-ip") ||
    "";

  // 去除IP可能带有的端口号（如192.168.1.100:8080）
  // 注意：IPv6 地址（如 ::1）可能包含多个冒号，需要特殊处理
  if (clientIp) {
    // 如果是 IPv4 地址（包含端口号），去除端口号
    // IPv4 格式：xxx.xxx.xxx.xxx:port
    if (clientIp.includes(".") && clientIp.includes(":")) {
      clientIp = clientIp.split(":").at(0) || clientIp;
    }
    // IPv6 地址（如 ::1）保持不变
  }

  // 开发环境调试：输出所有相关信息
  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware] Client IP:", clientIp || "empty");
    console.log("[Middleware] X-Real-IP:", request.headers.get("x-real-ip"));
    console.log(
      "[Middleware] X-Forwarded-For:",
      request.headers.get("x-forwarded-for")
    );
    console.log("[Middleware] URL:", request.url);
    console.log(
      "[Middleware] All headers:",
      Object.fromEntries(request.headers.entries())
    );
  }

  // 本地开发环境：如果无法获取IP，默认允许访问（或者可以根据URL判断）
  const isLocalhost =
    request.url.includes("localhost") || request.url.includes("127.0.0.1");

  // 如果无法获取IP且是本地访问，允许通过
  if (!clientIp && isLocalhost) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Middleware] Localhost access allowed (no IP detected)");
    }
    return NextResponse.next();
  }

  // 如果获取到了IP，进行白名单校验
  if (clientIp && !IP_WHITELIST.includes(clientIp)) {
    // 方式1：返回403禁止访问
    return new NextResponse(
      `Access Denied. Your IP: ${clientIp}. Allowed IPs: ${IP_WHITELIST.join(
        ", "
      )}`,
      { status: 403 }
    );

    // 方式2：跳转到拒绝访问页面，注释上方代码并启用下方
    // return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  return NextResponse.next();
}

// 指定中间件生效的路由（*表示所有路由）
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
