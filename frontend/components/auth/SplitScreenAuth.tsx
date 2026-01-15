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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-900 overflow-hidden">
      {/* Left Side (Navy) - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a3c] relative flex-col items-center justify-center p-12">
        {/* Graphic: Add decorative circle */}
        <div className="absolute top-0 right-0 w-80 h-80 border-[40px] border-white/5 rounded-full -mr-40 -mt-40 z-0"></div>

        {/* Text */}
        <h1 className="text-white text-7xl font-bold leading-tight z-10 text-center">
          Hello! <br /> Have a <br /> GOOD DAY
        </h1>
      </div>

      {/* Right Side (Dark) - Visible on all screens */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-slate-800">
        <div className="w-full max-w-[420px] flex flex-col">
          {/* Title based on mode or config */}
          {(rightPanelConfig?.title !== undefined) ? (
            <h2 className="text-4xl font-bold text-white mb-10">{rightPanelConfig.title}</h2>
          ) : (
            <h2 className="text-4xl font-bold text-white mb-10">{mode === 'login' ? 'Login' : 'Sign up'}</h2>
          )}

          {children}

          <div className="mt-6">
            <p className="text-sm text-slate-400 text-center">
              {rightPanelConfig?.footerText || (mode === 'login' ? "Don't have an account?" : "Already have an account?")}{' '}
              <Link
                href={rightPanelConfig?.footerLink || (mode === 'login' ? '/register' : '/login')}
                className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium"
              >
                {rightPanelConfig?.footerLinkText || (mode === 'login' ? 'Create an account' : 'Login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitScreenAuth;