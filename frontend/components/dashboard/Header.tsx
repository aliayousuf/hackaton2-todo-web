'use client';

import type { User } from '@/types/user';
import LogoutButton from '@/components/nav/logout-button';

interface HeaderProps {
  user: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white bg-opacity-80 backdrop-blur-sm border-b border-gray-200 flex-shrink-0 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700 break-words">
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