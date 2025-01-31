'use client';
import React, { act, useState } from 'react';
import TopHeader from '@/components/ui/TopHeader';
import { Home, Heart, BookOpen, User, Book } from 'lucide-react';
import NavBar from '@/components/ui/NavBar';

export default function Layout({
  children,
  pageTitle,
}: {
  children: React.ReactNode;
  pageTitle: string;
}) {
  const [activeTab, setActiveTab] = useState<
    'Get Care' | 'Learn' | 'Profile' | 'Home'
  >('Home');

  return (
    <div className="flex flex-col justify-between bg-secondary-300">
      {/* TopHeader receives the variant */}
      <TopHeader variant={activeTab} />

      {/* Main Content */}
      <main className="flex-grow bg-secondary-100">{children}</main>

      <NavBar className="bg-secondary-100" />
    </div>
  );
}
