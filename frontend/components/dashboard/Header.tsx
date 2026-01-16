'use client';

import type { User } from '@/types/user';
import LogoutButton from '@/components/nav/logout-button';

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-slate-800/30 backdrop-blur-md border-b border-slate-700/50 flex-shrink-0 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-slate-300 break-words">
                  {user?.email || 'User'}
                </span>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}