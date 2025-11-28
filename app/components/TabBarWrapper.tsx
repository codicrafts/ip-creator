'use client';

import { usePathname } from 'next/navigation';
import TabBar from '@/components/TabBar';
import { ReactNode } from 'react';

interface TabBarWrapperProps {
  children?: ReactNode;
}

export default function TabBarWrapper({ children }: TabBarWrapperProps) {
  const pathname = usePathname();
  
  // 不在这些页面显示 TabBar
  const hiddenPaths = ['/result'];
  const showTabBar = !hiddenPaths.includes(pathname);

  return (
    <>
      {children}
      {showTabBar && <TabBar />}
    </>
  );
}
