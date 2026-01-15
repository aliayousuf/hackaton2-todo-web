'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleLogout}
      className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md text-center transition duration-200"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;