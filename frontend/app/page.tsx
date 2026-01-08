'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-800">Welcome to Todo App</h1>
          <p className="mt-2 text-secondary-600">
            Manage your tasks efficiently with our secure platform
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Link
            href="/login"
            className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md text-center transition duration-200"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="w-full py-3 px-4 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded-md text-center transition duration-200"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}