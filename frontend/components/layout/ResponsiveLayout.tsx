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
    <div className="flex min-h-screen bg-slate-900">
      {/* Fixed Sidebar with hard-coded w-72 and z-index: 50 */}
      <aside className={`${isMobile ? (sidebarOpen ? 'w-full' : 'w-0') : 'w-72'} fixed left-0 top-0 h-screen z-50 bg-slate-900 overflow-hidden transition-all duration-300`}>
        <ResponsiveSidebar />
      </aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content with mandatory ml-72 - creates physical wall */}
      <main
        className={`${isMobile ? 'ml-0' : 'ml-72'} flex-1 transition-all duration-300`}
        style={isMobile ? {} : { width: 'calc(100% - 18rem)' }}
      >
        {/* Desktop Header with padding to prevent navbar overlap */}
        {!isMobile && title && (
          <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-10">
            <h1 className="text-2xl font-semibold text-slate-50">{title}</h1>
          </header>
        )}

        {/* Mobile Header */}
        {isMobile && (
          <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-4">
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

        {/* Main content with top padding to push titles below edge */}
        <div className="p-4 pt-20">
          {children}
        </div>
      </main>
    </div>
  );
}