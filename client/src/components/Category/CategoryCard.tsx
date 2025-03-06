import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

export interface CategoryCardProps {
  id: string;
  title: string;
  description: string;
  genre: string;
  image: string;
  href: string;
  isHot?: boolean;
  isDiscover?: boolean;
  isSquare?: boolean;
  // Other fields from your Card type can be added as needed
}

const LazyImage = lazy(() => import('../LazyImage'));

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  title, 
  image, 
  href,
  isHot,
  isDiscover 
}) => {
  const renderLogo = (logoUrl: string) => {
    return (
      <Suspense fallback={<div className="h-full w-full bg-gray-100 animate-pulse" />}>
        <LazyImage src={logoUrl} alt={title} className="h-full w-36 object-contain" />
      </Suspense>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Link to={href || '/'} target="_blank" className="w-full transition-all duration-200 hover:cursor-pointer">
        <div
          className="w-full h-[100px] md:h-[120px] bg-white rounded-2xl transition-all duration-200 group relative overflow-hidden"
          style={
            {
              '--hover-gradient': 'linear-gradient(180deg, #3569ED 0%, #282FE9 100%)'
            } as React.CSSProperties
          }
        >
          {/* Normal state */}
          <div className="absolute inset-0 flex items-center justify-center p-4 transition-opacity duration-200 group-hover:opacity-0">
            {renderLogo(image)}
          </div>

          {/* Hover state */}
          <div
            className="absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{
              background: 'var(--hover-gradient)',
              boxShadow: isHot 
                ? '0px 0px 40px rgba(247, 148, 34, 0.48)'
                : isDiscover
                  ? '0px 0px 40px rgba(60, 173, 239, 0.48)'
                  : '0px 0px 40px rgba(26, 41, 179, 0.48)'
            }}
          >
            {renderLogo(image)}
          </div>
        </div>
      </Link>
      <div className="text-white font-semibold">
        <p>{title}</p>
      </div>
    </div>
  );
};

export default CategoryCard;