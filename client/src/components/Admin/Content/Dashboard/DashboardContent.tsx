import React, { useState } from 'react';
import CategoryCard from '../../Category/CategoryCard';
import ModalPortal from '../../Modal';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import { useCategories } from '../../../../store/features/categories/useCategories';
import { useAuth } from '../../../../store/features/auth/useAuth';

const DashboardContent: React.FC = () => {
  const { isDark } = useTheme();
  const { items } = useCategories();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCategory = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`flex-1 p-8 rounded-2xl border transition-colors duration-300
      ${isDark 
        ? 'bg-dark-surface border-dark-border/20' 
        : 'bg-light-surface border-light-border/20'}`}>
      
      {/* Page header */}
      <div className='mb-8'>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
          Dashboard Overview
        </h1>
        <p className={`mt-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
          Welcome back, {' '}
          <span className={isDark ? 'text-dark-text-accent' : 'text-light-text-accent'}>
            {user?.name}
          </span>
        </p>
      </div>

      {/* Content area */}
      <div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {/* Widget cards */}
          {items.map((category) => (
            <CategoryCard key={category.id} {...category} />
          ))}
          <CategoryCard isForCreate onClick={handleCreateCategory} />
        </div>
      </div>
      
      {/* Modal Portal */}
      <ModalPortal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Create New Category"
        maxWidth="md"
      >
        <p>asd</p>
      </ModalPortal>
    </div>
  );
};

export default DashboardContent;