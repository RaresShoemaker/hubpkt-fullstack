import React from 'react';
import { useCategories } from '../../../../store/features/categories/useCategories';
import ToolBar from '../ToolBar';
import { useTheme } from '../../../../store/features/ui/useUITheme';

type CategoryContentProps = {
  id: string;
}

const CategoryContent: React.FC<CategoryContentProps> = ({
  id
}) => {
  const { isDark } = useTheme();
  const { currentCategory } = useCategories();

  return (
    <div
    className={`flex-1 p-8 rounded-2xl border transition-colors duration-300
    ${isDark ? 'bg-dark-surface border-dark-border/20' : 'bg-light-surface border-light-border/20'}`}
  >
    {/* Page header */}
    <div className='mb-8 flex gap-20 items-center'>
      <div className='flex flex-col'>
      <h1 className={`text-2xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
        {currentCategory?.title} - Category Overview {id}
      </h1>
      </div>
      <div className=''>
      <ToolBar isEditOrder/>
      </div>
    </div>

    {/* Content area */}

    </div>
  );

};

export default CategoryContent;