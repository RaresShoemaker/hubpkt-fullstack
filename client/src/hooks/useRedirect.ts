import { useNavigate, useLocation } from 'react-router-dom';

export const useRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterAuth = () => {
    const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return { redirectAfterAuth };
};