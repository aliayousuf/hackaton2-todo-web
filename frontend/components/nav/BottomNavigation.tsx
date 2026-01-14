'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, User, PlusCircle, MessageCircle } from 'lucide-react';

const bottomNavItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-white/10 p-2 md:hidden">
      <div className="flex items-center justify-around">
        {bottomNavItems.map((item) => {
          // Check if the current pathname matches the item href or starts with it for subroutes
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg ${
                isActive ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}

        <Link
          href="/dashboard/tasks/new"
          className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-indigo-400"
        >
          <PlusCircle className="h-6 w-6" />
          <span className="text-xs font-medium">New</span>
        </Link>
      </div>
    </nav>
  );
}