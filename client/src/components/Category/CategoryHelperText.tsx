import React from 'react';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface CategoryHelperTextProps {
  title: string;
  isViewOnly?: boolean;
  squareView: boolean;
}

const CategoryHelperText: React.FC<CategoryHelperTextProps> = ({ 
  title, 
  isViewOnly, 
  squareView 
}) => {
  return (
    <div className={cn(
      'flex text-white items-center',
      squareView 
        ? 'h-60 w-32' 
        : 'max-h-[120px] max-w-[224.5px] w-[120px] h-[100px] md:h-[120px]'
    )}>
      {!isViewOnly && (
        <Link 
          to={!squareView ? `/?category=${title.toLowerCase()}` : '/creatorhub'} 
          className='flex gap-1 items-center'
        >
          <p className='font-semibold underline underline-offset-4'>
            See more
          </p>
          <ChevronRight />
        </Link>
      )}
    </div>
  );
};

export default CategoryHelperText;