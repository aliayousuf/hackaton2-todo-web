'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import SplitScreenAuth from '@/components/auth/SplitScreenAuth';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterSuccess = () => {
    // Redirect to login after successful registration
    router.push('/login');
  };

  const handleRegister = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await register(email, password);
      if (result.success) {
        handleRegisterSuccess();
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SplitScreenAuth
      mode="register"
      rightPanelConfig={{
        title: "Sign up",
        buttonText: "Sign up",
        footerText: "Already have an account?",
        footerLink: "/login",
        footerLinkText: "Login"
      }}
    >
      <RegisterForm
        onRegister={handleRegister}
        onRegisterSuccess={handleRegisterSuccess}
        onError={(errorMessage) => setError(errorMessage)}
      />
      {error && <div className="text-red-500 text-sm text-center mt-4">{error}</div>}
    </SplitScreenAuth>
  );
}