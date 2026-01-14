
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const navItems = [
    { name: 'Tasks', href: '/dashboard' },
    { name: 'Chat', href: '/chat' },
    { name: 'Completed', href: '/dashboard/completed' },
    { name: 'Profile', href: '/dashboard/profile' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              pathname === item.href
                ? 'bg-indigo-500 text-slate-50'
                : 'text-slate-400 hover:bg-slate-700 hover:bg-opacity-50'
            } block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors mb-1`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}