import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import ReduxProvider from "./providers/ReduxProvider";
import TabBarWrapper from "./components/TabBarWrapper";
import { getServerUserInfo, getServerHistory } from "@/lib/server-auth";
import { UserStatus } from "@/store/slices/userSlice";
import { GeneratedImage, UserTier } from "@/types";
import { UserInfo } from "@/services/userService";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { getTodayDateString } from "@/lib/date-utils";
import { ZCOOL_QingKe_HuangYou } from "next/font/google";

const TRACKING_ID = "G-RKP0BDSH43";

const zcool = ZCOOL_QingKe_HuangYou({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zcool",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IP 创想坊",
  description: "一键生成场景与表情包，打造属于你的 IP 生态",
  icons: {
    icon: "/logo.svg",
  },
};

// 标记为动态渲染，因为使用了 cookies
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 在 SSR 侧获取用户信息和历史记录
  let userInfo: UserInfo;
  let history: GeneratedImage[];

  try {
    userInfo = await getServerUserInfo();
  } catch (error) {
    console.error("Get server user info error:", error);
    const today = getTodayDateString();
    userInfo = {
      userId: "",
      phone: "",
      userTier: UserTier.FREE,
      sceneUsage: { date: today, count: 0 },
      memeUsage: { date: today, count: 0 },
    };
  }

  try {
    history = await getServerHistory();
  } catch (error) {
    console.error("Get server history error:", error);
    history = [];
  }

  // 准备初始状态
  const initialUserState = {
    status: userInfo.userId ? UserStatus.LOGGED_IN : UserStatus.GUEST,
    userId: userInfo.userId || null,
    phone: userInfo.phone || null,
    userTier: userInfo.userTier,
    sceneUsage: userInfo.sceneUsage,
    memeUsage: userInfo.memeUsage,
    membershipExpiresAt: (userInfo as any).membershipExpiresAt || null,
  };

  return (
    <html lang="zh-CN">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body
        className={`bg-gray-50 text-gray-900 antialiased selection:bg-violet-200 selection:text-violet-900 ${zcool.variable}`}
        style={{ backgroundColor: "#f9fafb" }}
      >
        <ReduxProvider
          initialUserState={initialUserState}
          initialHistory={history}
        >
          {children}
          <TabBarWrapper />
          <GoogleAnalytics trackingId={TRACKING_ID} />
        </ReduxProvider>
      </body>
    </html>
  );
}
