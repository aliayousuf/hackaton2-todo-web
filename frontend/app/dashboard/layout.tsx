'use client';

import type { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import LogoutButton from '@/components/nav/logout-button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-2xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Redirect happens in useEffect
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Sidebar: Direct flex child with fixed width */}
      <div className="w-64 flex-shrink-0 h-full bg-[#FDF2F8]">
        <Sidebar />
      </div>

      {/* Content Area: Second flex child that takes remaining space */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Header nested inside content area, physically occupies space */}
        <header className="h-16 w-full bg-white/90 backdrop-blur-md border-b border-pink-100 flex-shrink-0">
          <div className="w-full px-6">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
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

        {/* Main content with independent scrolling */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-white">
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}