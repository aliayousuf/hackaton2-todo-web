'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { registerUser } from '@/lib/api';

// Define the validation schema using Zod
const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegisterSuccess: () => void;
  onError: (error: string) => void;
  onRegister?: (email: string, password: string) => Promise<void>;
}

export function RegisterForm({ onRegisterSuccess, onError, onRegister }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod schema
    try {
      registerSchema.parse({ email, password });

      // Validate additional custom rules
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Clear any field errors before submitting
      setFormErrors(prev => ({ general: prev.general }));
      setIsLoading(true);
      try {
        if (onRegister) {
          // Use the provided onRegister function (which uses auth context)
          await onRegister(email, password);
        } else {
          // Use the original API call directly
          const result = await registerUser(email, password);
          if (result.success) {
            onRegisterSuccess();
          } else {
            onError(result.error || 'Registration failed');
          }
        }
      } catch (error: any) {
        // Handle different error scenarios
        if (error.response?.status === 409) {
          setFormErrors({ general: 'An account with this email already exists' });
          onError('An account with this email already exists');
        } else if (error.response?.status === 400) {
          setFormErrors({ general: error.response.data.detail || 'Invalid input provided' });
          onError(error.response.data.detail || 'Invalid input provided');
        } else {
          setFormErrors({ general: 'An unexpected error occurred. Please try again.' });
          onError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            const field = err.path[0] as string;
            newErrors[field] = err.message;
          }
        });
        setFormErrors(newErrors);
      } else {
        // Handle custom validation errors
        if (typeof error === 'object' && error !== null && 'message' in error) {
          setFormErrors({ confirmPassword: (error as { message: string }).message });
        } else {
          setFormErrors({ confirmPassword: String(error) });
        }
      }
    }
  };

  return (
    <div className="w-full max-w-[420px] flex flex-col">
      {/* Header - already handled in SplitScreenAuth */}
      <form className="flex flex-col space-y-6 w-full" onSubmit={handleSubmit}>
        {formErrors.general && (
          <div
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm text-center"
            role="alert"
            aria-live="polite"
          >
            {formErrors.general}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-500 mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-5 py-4 mb-6 text-lg focus:ring-2 focus:ring-[#0a0a3c] outline-none text-slate-900 !bg-white"
            disabled={isLoading}
            placeholder="Email"
            aria-invalid={!!formErrors.email}
            aria-describedby={formErrors.email ? "email-error" : undefined}
          />
          {formErrors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-500">
              {formErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-slate-500 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-5 py-4 mb-6 text-lg focus:ring-2 focus:ring-[#0a0a3c] outline-none text-slate-900 !bg-white"
              disabled={isLoading}
              placeholder="Create password"
              aria-invalid={!!formErrors.password}
              aria-describedby={formErrors.password ? "password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p id="password-error" className="mt-1 text-sm text-red-500">
              {formErrors.password}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-500 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-5 py-4 mb-6 text-lg focus:ring-2 focus:ring-[#0a0a3c] outline-none text-slate-900 !bg-white"
              disabled={isLoading}
              placeholder="Confirm password"
              aria-invalid={!!formErrors.confirmPassword}
              aria-describedby={formErrors.confirmPassword ? "confirm-password-error" : undefined}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          {formErrors.confirmPassword && (
            <p id="confirm-password-error" className="mt-1 text-sm text-red-500">
              {formErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#0a0a3c] text-white !text-white py-5 rounded-xl text-xl font-bold mt-4 shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center border-none"
          disabled={isLoading}
        >
          {isLoading ? 'Creating account...' : 'SIGNUP'}
        </button>
      </form>
    </div>
  );
}