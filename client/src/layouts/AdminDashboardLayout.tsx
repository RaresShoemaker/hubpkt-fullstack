import React from 'react';
import { useTheme } from '../store/features/ui/useUITheme';
import Navigation from '../components/Admin/Navigation/Navbar';
import MainContent from '../components/Admin/DashboardContent';

const AdminDashboardLayout: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`h-full min-h-screen flex gap-6 p-8 transition-colors duration-300
      ${isDark ? 'bg-dark-background text-dark-text-primary' : 'bg-light-background text-light-text-primary'}`}>
      
      <Navigation />

      <MainContent title='Dashboard'>
           {/* Content grid */}
           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Widget cards */}
          {['Total Users', 'Revenue', 'Active Projects'].map((title, index) => (
            <div key={title} className={`p-6 rounded-xl border transition-colors duration-300
              ${isDark 
                ? 'bg-dark-background border-dark-border/20' 
                : 'bg-light-background border-light-border/20'}`}>
              <h3 className={`text-lg font-medium ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
                {title}
              </h3>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-dark-text-accent' : 'text-light-text-accent'}`}>
                {index === 0 ? '1,234' : index === 1 ? '$45,678' : '27'}
              </p>
              <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
                {index === 0 ? '+12% from last month' : index === 1 ? '+8% from last month' : '3 pending approval'}
              </p>
            </div>
          ))}
        </div>
      </MainContent>
    </div>
  );
}

export default AdminDashboardLayout;