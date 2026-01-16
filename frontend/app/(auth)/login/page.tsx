'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SplitScreenAuth from '@/components/auth/SplitScreenAuth';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login
    router.push('/dashboard');
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(email, password);
      if (result.success) {
        handleLoginSuccess();
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SplitScreenAuth
      mode="login"
      rightPanelConfig={{
        title: "Login",
        buttonText: "Login",
        footerText: "Don't have an account?",
        footerLink: "/register",
        footerLinkText: "Sign up"
      }}
    >
      <LoginForm
        onLogin={handleLogin}
        onLoginSuccess={handleLoginSuccess}
        onError={(errorMessage) => setError(errorMessage)}
      />
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-400 text-sm text-center mt-4">
          {error}
        </div>
      )}
    </SplitScreenAuth>
  );
}