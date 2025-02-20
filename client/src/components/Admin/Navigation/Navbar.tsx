import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { ThemeToggle } from '../Theme/ThemeToggle';
import { NAVIGATION_ITEMS } from './constants';
import { NavigationItem } from './navigation.types';
import LogoutButton from '../Buttons/Logout';

const Navigation: React.FC = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentCategory = searchParams.get('category');

  const handleNavigation = (item: NavigationItem) => {
    if (item.type === 'category') {
      navigate(`/dashboard?category=${item.category}`);
    } else {
      navigate(item.path);
    }
  };

  const isActiveItem = (item: NavigationItem): boolean => {
    if (item.type === 'category') {
      return currentCategory === item.category;
    } else {
      return location.pathname === item.path;
    }
  };

  return (
    <div className={`w-72 py-8 px-6 rounded-2xl border transition-colors duration-300 flex flex-col justify-between
      ${isDark 
        ? 'bg-dark-surface border-dark-border/20' 
        : 'bg-light-surface border-light-border/20'}`}>
      
      {/* Header */}
      <div>
      <div className='mb-8'>
        <h2 className={`text-xl font-semibold ${isDark ? 'text-dark-text-accent' : 'text-light-text-accent'}`}>
          Admin Panel
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          Management Console
        </p>
      </div>
      
      {/* Navigation Items */}
      <nav className='space-y-2'>
        {NAVIGATION_ITEMS.map((item) => (
          <div
            key={item.type === 'category' ? item.category : item.path}
            onClick={() => handleNavigation(item)}
            className={`p-3 rounded-xl transition-colors cursor-pointer ${
              isActiveItem(item)
                ? isDark 
                  ? 'bg-dark-accent/10 text-dark-text-accent'
                  : 'bg-light-accent/10 text-light-text-accent'
                : isDark
                  ? 'text-dark-text-secondary hover:bg-dark-border/20'
                  : 'text-light-text-secondary hover:bg-light-border/20'
            }`}
          >
            {item.label}
          </div>
        ))}
      </nav>
      </div>

      {/* Theme Toggle */}
     
      <div className="flex items-center justify-between w-full border-t border-dark-border/20 pt-4">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Navigation;