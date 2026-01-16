'use client';

import { useState, useEffect } from 'react';
import ResponsiveSidebar from '@/components/nav/ResponsiveSidebar';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function ResponsiveLayout({ children, title }: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar - Fixed width on desktop, overlay on mobile */}
      <aside className={`${isMobile ? (sidebarOpen ? 'absolute inset-0 z-50' : 'hidden') : 'w-72 flex-shrink-0 h-screen'} ${isMobile ? 'bg-slate-900' : ''}`}>
        <div className="h-full bg-slate-900">
          <ResponsiveSidebar />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content - Use flexbox to properly position content and prevent overlap */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header */}
        {!isMobile && title && (
          <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-6 flex-shrink-0">
            <h1 className="text-2xl font-semibold text-slate-50">{title}</h1>
          </header>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <button
                onClick={toggleSidebar}
                className="text-slate-100 p-2 rounded-lg hover:bg-slate-800/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              {title && (
                <h1 className="text-xl font-semibold text-slate-50">{title}</h1>
              )}
            </div>
          </header>
        )}

        {/* Main content area - Scrollable to prevent overlap */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}