import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

enum NewsCategory {
  TOP_STORIES = 'top-stories',
  BUSINESS = 'business',
  LIFESTYLE = 'lifestyle',
  TECH = 'tech',
  CELEBRITY = 'celebrity',
  CRYPTO = 'crypto'
}

const NewsContainer: React.FC = () => {
  const [newsCategory, setNewsCategory] = useState<NewsCategory>(NewsCategory.TOP_STORIES);

  useEffect(() => {
    // Load RSS widget script when component mounts
    const script = document.createElement('script');
    script.src = 'https://widget.rss.app/v1/wall.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className='min-h-screen w-full md:mt-10 flex flex-col'>
     <div className='flex flex-grow gap-5 pr-4 md:pr-0 text-lg md:text-xl text-white w-full justify-start md:justify-center overflow-x-auto pb-4 whitespace-nowrap scrollbar-hide'>
        <button
          className={cn(
            'w-32 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
            newsCategory === NewsCategory.TOP_STORIES && 'text-white font-semibold'
          )}
          onClick={() => setNewsCategory(NewsCategory.TOP_STORIES)}
        >
          Top Stories
        </button>
        <button
          className={cn(
            'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
            newsCategory === NewsCategory.BUSINESS && 'text-white font-semibold'
          )}
          onClick={() => setNewsCategory(NewsCategory.BUSINESS)}
        >
          Business
        </button>
        <button
          className={cn(
            'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
            newsCategory === NewsCategory.LIFESTYLE && 'text-white font-semibold'
          )}
          onClick={() => setNewsCategory(NewsCategory.LIFESTYLE)}
        >
          Lifestyle
        </button>
        <button
          className={cn(
            'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
            newsCategory === NewsCategory.TECH && 'text-white font-semibold'
          )}
          onClick={() => setNewsCategory(NewsCategory.TECH)}
        >
          Tech
        </button>
        <button
          className={cn(
            'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
            newsCategory === NewsCategory.CELEBRITY && 'text-white font-semibold'
          )}
          onClick={() => setNewsCategory(NewsCategory.CELEBRITY)}
        >
          Celebrity
        </button>
        <button
          className={cn(
            'w-24 text-center text-white/40 hover:text-white hover:font-semibold transition-all duration-100',
            newsCategory === NewsCategory.CRYPTO && 'text-white font-semibold'
          )}
          onClick={() => setNewsCategory(NewsCategory.CRYPTO)}
        >
          Crypto
        </button>
      </div>
      <div className="mt-8 px-10">
        {newsCategory === NewsCategory.LIFESTYLE && (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: '<rssapp-wall id="tIw28PeZ67ytt9t1"></rssapp-wall>' 
            }} 
          />
        )}
        {newsCategory === NewsCategory.BUSINESS && (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: '<rssapp-wall id="t63bdOxjmePNDsMe"></rssapp-wall>' 
            }} 
          />
        )}
        {newsCategory === NewsCategory.TECH && (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: '<rssapp-wall id="tV3VFGsnqQkq2lBz"></rssapp-wall>' 
            }} 
          />
        )}
        {newsCategory === NewsCategory.CELEBRITY && (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: '<rssapp-wall id="tiMZFBEWoB2lAIKp"></rssapp-wall>' 
            }} 
          />
        )}
        {newsCategory === NewsCategory.CRYPTO && (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: '<rssapp-wall id="62qn2hrRHQlA8BnW"></rssapp-wall>' 
            }} 
          />
        )}
         {newsCategory === NewsCategory.TOP_STORIES && (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: '<rssapp-wall id="arnV5TgNGBkCNn2x"></rssapp-wall>' 
            }} 
          />
        )}
      </div>
    </div>
  );
};

export default NewsContainer;