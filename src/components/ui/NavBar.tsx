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
        'fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 bg-white px-6 py-4 text-primary-900 shadow-lg',
        className,
      )}
    >
      <div className="flex w-full flex-row justify-between">
        {navButtonIcons.map(({ icon, dest_link }) => (
          <NavButton
            key={icon}
            icon={icon}
            dest_link={dest_link}
            selected={pathname === dest_link}
          />
        ))}
      </div>
    </div>
  );
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
