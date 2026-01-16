
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
    <aside className="flex flex-col h-full bg-slate-800/30 backdrop-blur-sm border-r border-slate-700/50 p-4">
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              pathname === item.href
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                : 'text-slate-300 hover:bg-slate-700/60 hover:text-white hover:shadow-md'
            } block px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 mb-2 flex items-center gap-3`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}