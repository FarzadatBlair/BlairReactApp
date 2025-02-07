'use client';

// import React, { useState } from 'react';
import TopHeader from '@/components/ui/TopHeader';
import NavBar from '@/components/ui/NavBar';

export default function Layout({ children }: { children: React.ReactNode }) {
  // const [activeTab, setActiveTab] = useState<
  //   'Get Care' | 'Learn' | 'Profile' | 'Home'
  // >('Home');
  //TODO: Implement activeTab state without passing prop into layout.tsx

  return (
    <div className="flex flex-col justify-between">
      {/* TopHeader receives the variant */}
      <TopHeader variant={'Home'} />

      {/* Main Content */}
      <main className="flex-grow bg-background">{children}</main>

      <NavBar className="" />
    </div>
  );
}
