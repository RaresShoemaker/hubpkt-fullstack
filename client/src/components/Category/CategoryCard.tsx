import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

export interface CategoryCardProps {
  alt: string;
  href?: string;
  logo: React.ReactNode | string;
  logoWhite?: React.ReactNode | string;
}

const LazyImage = lazy(() => import('../LazyImage'));

const CategoryCard: React.FC<CategoryCardProps> = ({ alt, logo, logoWhite, href }) => {
  const renderLogo = (logoContent: React.ReactNode | string) => {
    if (typeof logoContent === 'string') {
      return (
        <Suspense fallback={<div className="h-full w-full bg-gray-100 animate-pulse" />}>
          <LazyImage src={logoContent} alt={alt} className="h-full w-auto object-contain" />
        </Suspense>
      );
    }
    return logoContent;
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
            {renderLogo(logo)}
          </div>

          {/* Hover state */}
          <div
            className="absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-200"
            style={{
              background: 'var(--hover-gradient)',
              boxShadow: '0px 0px 40px rgba(26, 41, 179, 0.48)'
            }}
          >
            {renderLogo(logoWhite || logo)}
          </div>
        </div>
      </Link>
      <div className="text-white font-semibold">
        <p>{alt}</p>
      </div>
    </div>
  );
};

export default CategoryCard;