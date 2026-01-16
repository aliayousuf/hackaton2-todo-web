'use client';

import React from 'react';
import Link from 'next/link';

interface SplitScreenAuthProps {
  children: React.ReactNode;
  mode: 'login' | 'register';
  rightPanelConfig?: {
    title: string;
    buttonText: string;
    footerText: string;
    footerLink: string;
    footerLinkText: string;
  };
}

const SplitScreenAuth: React.FC<SplitScreenAuthProps> = ({
  children,
  mode,
  rightPanelConfig
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Left Side (Navy) - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 to-slate-900 relative flex-col items-center justify-center p-12">
        {/* Graphic: Add decorative circle */}
        <div className="absolute top-0 right-0 w-80 h-80 border-[40px] border-white/5 rounded-full -mr-40 -mt-40 z-0"></div>

        {/* Text */}
        <div className="text-center z-10">
          <h1 className="text-white text-5xl font-bold leading-tight mb-4">
            Welcome to
          </h1>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Todo App
          </h2>
          <p className="text-slate-300 mt-6 max-w-md">
            Streamline your productivity and manage your tasks efficiently with our intuitive dashboard.
          </p>
        </div>
      </div>

      {/* Right Side (Dark) - Visible on all screens */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-slate-900/50">
        <div className="w-full max-w-md flex flex-col">
          {/* Title based on mode or config */}
          {(rightPanelConfig?.title !== undefined) ? (
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-8 text-center">{rightPanelConfig.title}</h2>
          ) : (
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-8 text-center">{mode === 'login' ? 'Login' : 'Sign up'}</h2>
          )}

          <div className="glass-card p-6 sm:p-8 rounded-2xl backdrop-blur-sm border border-slate-700/50 shadow-2xl">
            {children}
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-400 text-center">
              {rightPanelConfig?.footerText || (mode === 'login' ? "Don't have an account?" : "Already have an account?")}{' '}
              <Link
                href={rightPanelConfig?.footerLink || (mode === 'login' ? '/register' : '/login')}
                className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold transition-colors"
              >
                {rightPanelConfig?.footerLinkText || (mode === 'login' ? 'Sign up' : 'Login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitScreenAuth;