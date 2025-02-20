import React from 'react';
import { LogOut } from 'lucide-react';
import Button from './ButtonBase';
import { useAuth } from '../../../store/features/auth/useAuth';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const { logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        navigate('/authentication');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      isLoading={isLoading.logout}
      leftIcon={<LogOut className="w-4 h-4" />}
      className=""
    >
      Logout
    </Button>
  );
};

export default LogoutButton;