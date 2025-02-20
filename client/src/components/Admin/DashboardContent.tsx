import React from 'react';
// import { useAuth } from '../../store/features/auth/hooks';
import { useTheme } from '../../store/features/ui/useUITheme';

interface MainContentProps {
  children: React.ReactNode;
  title?: string;
}

const MainContent: React.FC<MainContentProps> = ({ children, title = 'Dashboard' }) => {
  // const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className={`flex-1 p-8 rounded-2xl border transition-colors duration-300
      ${isDark 
        ? 'bg-dark-surface border-dark-border/20' 
        : 'bg-light-surface border-light-border/20'}`}>
      
      {/* Page header */}
      <div className='mb-8'>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
          {title}
        </h1>
        <p className={`mt-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          Welcome back, {' '}
          <span className={isDark ? 'text-dark-text-accent' : 'text-light-text-accent'}>
            {/* {user?.name} */}
          </span>
        </p>
      </div>

      {/* Content area */}
      {children}
    </div>
  );
};

export default MainContent;