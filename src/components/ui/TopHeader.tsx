'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { fetchUserData } from '@/utils/fetchUserData';
import { User } from '@/types/user';

type TopHeaderProps = {
  variant: 'Get Care' | 'Learn' | 'Profile' | 'Home'; // Add more variants as needed
};

const TopHeader: React.FC<TopHeaderProps> = ({ variant }) => {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : JSON.stringify(err));
      }
    };

    getUser();
  }, []);

  if (error) {
    console.log(error);
  }

  const renderContent = () => {
    switch (variant) {
      case 'Get Care':
        return (
          <>
            <h1 className="text-2xl font-bold">Get care</h1>
            <p className="text-sm text-gray-600">
              Book a video call or message one of our top-rated providers.{' '}
              <span className="font-semibold">We&apos;re here for you.</span>
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search treatments and providers"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </>
        );

      case 'Learn':
        return (
          <>
            <h1 className="text-2xl font-bold">Learn</h1>
            <p className="text-sm text-gray-600">
              Essential resources to help you understand, manage, and navigate
              menopausal changes with confidence.
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search articles, podcasts, and interviews"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </>
        );

      case 'Profile':
        return (
          <>
            <h1 className="text-2xl font-bold">Learn</h1>
            <p className="text-sm text-gray-600">
              Essential resources to help you understand, manage, and navigate
              menopausal changes with confidence.
            </p>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search articles, podcasts, and interviews"
                className="w-full rounded-md border border-gray-300 p-2"
              />
            </div>
          </>
        );

      case 'Home':
        return (
          <>
            <h1>Welcome, {user?.first_name}</h1>
          </>
        );

      default:
        return null; // Fallback for unsupported variants
    }
  };

  return (
    <header className="rounded-md bg-secondary-100 px-6 pb-6 pt-14">
      {renderContent()}
    </header>
  );
};

export default TopHeader;
