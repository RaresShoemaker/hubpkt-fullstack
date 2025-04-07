import React, {useEffect} from 'react';
import { useTheme } from '../../../store/features/ui/useUITheme';
import { ThemeToggle } from '../Theme/ThemeToggle';
import LogoutButton from '../Buttons/Logout';
import { useCategories } from '../../../store/features/categories/useCategories';
import { Category } from '../../../store/features/categories/categories.types';
import NavigationButton from './NavigationButton';
import ButtonBase from '../Buttons/ButtonBase';

const Navigation: React.FC = () => {
  const { isDark } = useTheme();
  const { items = [], isLoading, errors, currentCategory, fetchCategoriesList, changeCurrentCategory } = useCategories();

  useEffect(() => {
    fetchCategoriesList();
  }, [fetchCategoriesList]);

  const handleCategoryChange = (category: Category | null) => {
    changeCurrentCategory(category);
  }


  return (
    <div className={`w-72 max-h-[810px] py-8 px-6 rounded-2xl border transition-colors duration-300 flex flex-col justify-between
      ${isDark 
        ? 'bg-dark-surface border-dark-border/20' 
        : 'bg-light-surface border-light-border/20'}`}>
      
      <div>
        <div className='mb-8'>
          <h2 className={`text-xl font-semibold ${isDark ? 'text-dark-text-accent' : 'text-light-text-accent'}`}>
            Admin Panel
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
            Management Console
          </p>
        </div>
      
        <nav className='space-y-2'>
          <ButtonBase
            onClick={() => handleCategoryChange(null)}
            variant='ghost'
            isSelected={!currentCategory}
          >
            Dashboard Overview
          </ButtonBase>

          {isLoading?.list ? (
            <p className={isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}>
              Loading categories...
            </p>
          ) : errors?.list ? (
            <p className="text-red-500">
              Error loading categories: {errors.list}
            </p>
          ) : (
           items && items.map((category: Category) => (
              <NavigationButton
                key={category.id}
                title={category.title}
                image={category.image}
                isSelected={currentCategory?.id === category.id}
                handleCategoryClick={() => handleCategoryChange(category)}
              />  
            )
           ))}
        </nav>
      </div>

      <div className="flex items-center justify-between w-full border-t border-dark-border/20 pt-4">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </div>
  );
};

export default Navigation;