'use client';

import { usePathname } from 'next/navigation';
import TabBar from '@/components/TabBar';

export default function TabBarWrapper() {
  const pathname = usePathname();
  
  // 不在这些页面显示 TabBar
  const hiddenPaths = ['/result', '/edit'];
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  return <TabBar />;
}
