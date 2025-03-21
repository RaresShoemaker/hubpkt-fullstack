import React from 'react';
import { ChevronRight } from 'lucide-react';
import CategoryCard from './CategoryCard';
import CustomHr from './CustomHr';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import CategoryHelperText from './CategoryHelperText';
import CreatorsCard from '../Creators/CreatorsCard';
import { Card } from '../../store/features/cards/cards.types'

interface CategoryContainerProps {
  title: string;
  cards: Card[];
  isFullPage?: boolean;
  isViewOnly?: boolean;
  squareView: boolean;
}

const CategoryContainer: React.FC<CategoryContainerProps> = React.memo(
  ({ title, cards, isFullPage = false, isViewOnly = false, squareView = false }) => {
    // Handle empty cards array
    if (!cards || cards.length === 0) {
      return null;
    }

    if (isFullPage && !squareView) {
      return (
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full'>
            {cards.map((card) => (
              <div key={card.id} className='w-full'>
                <CategoryCard
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  genre={card.genre}
                  image={card.image}
                  href={card.href}
                  isHot={card.isHot}
                  isDiscover={card.isDiscover}
                  isSquare={card.isSquare}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={cn('flex flex-col gap-4 w-full', isViewOnly ? 'glass pl-5 py-5' : '')}>
        {/* Title section */}
        <div className='flex items-center md:text-2xl text-lg font-semibold gap-1 text-white hover:cursor-pointer'>
          {!isViewOnly && (
            <Link 
              to={!squareView ? `/?category=${title.toLowerCase()}` : '/creatorhub'} 
              className='flex items-center gap-1 text-white hover:cursor-pointer'
            >
              <p className='font-bold'>{title}</p>
            </Link>
          )}
          {isViewOnly && (
            <p 
              className={cn(
                'font-bold text-gradient', 
                title.includes('Discover') ? 'bg-gradient-text-discover' : 'bg-gradient-text-hot'
              )}
            >
              {title}
            </p>
          )}
          <ChevronRight 
            className={cn(
              'w-5 h-5', 
              isViewOnly ? (title.includes('Discover') ? 'text-[#3CADEF]' : 'text-[#F79422]') : ''
            )} 
          />
        </div>

        {/* Scrollable container with width constraints */}
        <div className='w-full'>
          <div className='max-w-full overflow-x-auto no-scrollbar'>
            <div className='inline-flex gap-4'>
              {!squareView && cards.map((card) => (
                <div key={card.id} className='shrink-0 w-[145px] md:w-[224.5px]'>
                  <CategoryCard
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    genre={card.genre}
                    image={card.image}
                    href={card.href}
                    isHot={card.isHot}
                    isDiscover={card.isDiscover}
                    isSquare={card.isSquare}
                  />
                </div>
              ))}
              {squareView && cards.map((card) => (
                <div key={card.id} className=''>
                  <CreatorsCard
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    genre={card.genre}
                    image={card.image}
                    href={card.href}
                    isHot={card.isHot}
                    isDiscover={card.isDiscover}
                    isSquare={card.isSquare}
                  />
                </div>
              ))}
              <CategoryHelperText squareView={squareView} title={title} isViewOnly={isViewOnly} />
            </div>
          </div>
        </div>

        {/* Divider */}
        {(!isViewOnly && !squareView) && (
          <div className='w-full'>
            <CustomHr />
          </div>
        )}
      </div>
    );
  }
);

export default CategoryContainer;