
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
    { name: 'Completed', href: '/dashboard/completed' },
    { name: 'Profile', href: '/dashboard/profile' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="flex flex-col h-full bg-[#FDF2F8]">
      <div className="p-5 border-b border-pink-200 flex-shrink-0">
        <h1 className="text-xl font-bold tracking-tight text-pink-900">Todo App</h1>
      </div>
      <nav className="px-2 py-5 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`${
              pathname === item.href
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white'
                : 'text-pink-800 hover:bg-pink-200'
            } block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors mb-1`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-pink-200 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}