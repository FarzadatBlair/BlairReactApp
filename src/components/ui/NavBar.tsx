import React from 'react';
import clsx from 'clsx';
import { Home, CirclePlus, BookOpen, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavButtonProps {
  icon: 'home' | 'get-care' | 'learn' | 'profile';
  dest_link: string; // The route this button navigates to
  selected?: boolean;
}

const iconSize = 28;

const iconComponents: Record<NavButtonProps['icon'], React.ReactNode> = {
  home: <Home size={iconSize} />,
  'get-care': <CirclePlus size={iconSize} />,
  learn: <BookOpen size={iconSize} />,
  profile: <User size={iconSize} />,
};

interface NavbarProps {
  className?: string;
}

function NavBar({ className }: NavbarProps) {
  const pathname = usePathname();

  const navButtonIcons: NavButtonProps[] = [
    { icon: 'home', dest_link: '/' },
    { icon: 'get-care', dest_link: '/get-care' },
    { icon: 'learn', dest_link: '/learn' },
    { icon: 'profile', dest_link: '/profile' },
  ];

  return (
    <div
      className={clsx(
        'flex flex-row justify-between rounded-3xl bg-white px-10 py-2 text-primary-900',
        className,
      )}
    >
      {navButtonIcons.map(({ icon, dest_link }) => (
        <NavButton
          key={icon}
          icon={icon}
          dest_link={dest_link}
          selected={pathname === dest_link}
        />
      ))}
    </div>
  );

  // return (
  //   <div className="flex justify-around p-4 bg-white shadow-md">
  //       <button
  //         onClick={() => setActiveTab("Home")}
  //         className={`text-sm ${
  //           activeTab === "Home" ? "font-bold text-black" : "text-gray-500"
  //         }`}
  //       >
  //         <Home className="w-6 h-6 mb-1" />
  //         Home
  //       </button>
  //       <button
  //         onClick={() => setActiveTab("Get Care")}
  //         className={`text-sm ${
  //           activeTab === "Get Care" ? "font-bold text-black" : "text-gray-500"
  //         }`}
  //       >
  //         <Heart className="w-6 h-6 mb-1" />
  //         Get Care
  //       </button>
  //       <button
  //         onClick={() => setActiveTab("Learn")}
  //         className={`text-sm ${
  //           activeTab === "Learn" ? "font-bold text-black" : "text-gray-500"
  //         }`}
  //       >
  //         <BookOpen className="w-6 h-6 mb-1" />
  //         Learn
  //       </button>
  //       <button
  //         onClick={() => setActiveTab("Profile")}
  //         className={`text-sm ${
  //           activeTab === "Profile" ? "font-bold text-black" : "text-gray-500"
  //         }`}
  //       >
  //         <User className="w-6 h-6 mb-1" />
  //         Profile
  //       </button>
  //     </div>
  // )
}

function NavButton({ icon, dest_link, selected = false }: NavButtonProps) {
  return (
    <Link href={dest_link}>
      <div
        className={clsx(
          'm-1 flex items-center rounded-lg p-1 transition',
          selected ? 'bg-primary text-white' : 'hover:primary/30',
        )}
      >
        {iconComponents[icon]}
      </div>
    </Link>
  );
}

export default NavBar;
