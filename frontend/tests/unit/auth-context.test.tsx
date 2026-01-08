import { renderHook, waitFor } from '@testing-library/react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import type { User } from '@/types/user';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock the API functions
jest.mock('@/lib/api', () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

import { loginUser, registerUser } from '@/lib/api';

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should provide auth context', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('token');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('register');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('isAuthenticated');
  });

  it('should handle login successfully', async () => {
    const mockUser: User = {
      id: 'user-uuid',
      email: 'test@example.com',
      created_at: '2026-01-06T00:00:00Z',
      updated_at: '2026-01-06T00:00:00Z',
    };

    (loginUser as jest.MockedFunction<typeof loginUser>).mockResolvedValue({
      success: true,
      access_token: 'mock-token',
      user: mockUser,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.login('test@example.com', 'password123');

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('mock-token');
      expect(result.current.isAuthenticated()).toBe(true);
    });
  });

  it('should handle registration', async () => {
    (registerUser as jest.MockedFunction<typeof registerUser>).mockResolvedValue({
      success: true,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await result.current.register('test@example.com', 'password123');

    // Registration doesn't set user in this implementation, just returns success
    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should handle logout', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially, localStorage should be checked
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('access_token');

    act(() => {
      result.current.logout();
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });
});

// Import act for state updates
import { act } from 'react';