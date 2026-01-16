'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { loginUser } from '@/lib/api';

// Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLoginSuccess: () => void;
  onError: (error: string) => void;
  onLogin?: (email: string, password: string) => Promise<void>;
}

export function LoginForm({ onLoginSuccess, onError, onLogin }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod schema
    try {
      loginSchema.parse({ email, password });

      // Clear any field errors before submitting
      setFormErrors(prev => ({ general: prev.general }));
      setIsLoading(true);
      try {
        if (onLogin) {
          // Use the provided onLogin function (which uses auth context)
          await onLogin(email, password);
        } else {
          // Use the original API call directly
          const result = await loginUser(email, password);
          if (result.success) {
            onLoginSuccess();
          } else {
            onError(result.error || 'Login failed');
          }
        }
      } catch (error: any) {
        // Handle different error scenarios
        if (error.response?.status === 401) {
          setFormErrors({ general: 'Invalid email or password' });
          onError('Invalid email or password');
        } else {
          setFormErrors({ general: 'An unexpected error occurred. Please try again.' });
          onError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            const field = err.path[0] as string;
            newErrors[field] = err.message;
          }
        });
        setFormErrors(newErrors);
      }
    }
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header - already handled in SplitScreenAuth */}
      <form className="flex flex-col space-y-6 w-full" onSubmit={handleSubmit}>
        {formErrors.general && (
          <div
            className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-red-400 text-sm text-center mb-4"
            role="alert"
            aria-live="polite"
          >
            {formErrors.general}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-slate-600 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white bg-slate-800/50 transition-colors"
            disabled={isLoading}
            placeholder="Enter your email"
            aria-invalid={!!formErrors.email}
            aria-describedby={formErrors.email ? "email-error" : undefined}
          />
          {formErrors.email && (
            <p id="email-error" className="mt-2 text-sm text-red-400">
              {formErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-600 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-white bg-slate-800/50 transition-colors pr-10"
              disabled={isLoading}
              placeholder="Enter your password"
              aria-invalid={!!formErrors.password}
              aria-describedby={formErrors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-slate-400 hover:text-slate-200" />
              ) : (
                <EyeIcon className="h-5 w-5 text-slate-400 hover:text-slate-200" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p id="password-error" className="mt-2 text-sm text-red-400">
              {formErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3.5 rounded-xl text-base font-semibold shadow-lg hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center justify-center border-none mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </span>
          ) : (
            'LOGIN'
          )}
        </button>
      </form>
    </div>
  );
}