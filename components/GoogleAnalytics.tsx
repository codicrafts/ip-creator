"use client";

import { useEffect } from "react";
import ga from "react-ga4";

export default function GoogleAnalytics({
  trackingId,
}: {
  trackingId: string;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      ga.initialize([{ trackingId }]);
      // 可以在这里添加页面浏览事件
    }
  }, [trackingId]);

  return null;
}
