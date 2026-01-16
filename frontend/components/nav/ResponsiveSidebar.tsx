'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, Calendar, User, Plus, Settings, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/chat', label: 'Chat', icon: MessageCircle },
  { href: '/dashboard/completed', label: 'Completed', icon: CheckSquare },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function ResponsiveSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">

          </div>
          <span className="text-xl font-bold text-slate-50">Todo App</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          // Check if the current pathname matches the item href or starts with it for subroutes
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white hover:shadow-md'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className={`font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button container with proper spacing at bottom */}
      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={handleLogout}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-xl w-full font-bold shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          Logout
        </button>
      </div>
    </div>
  );
}