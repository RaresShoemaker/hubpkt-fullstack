import React from 'react';
import MemoizedMenu from '../components/Menu/MemoizedMenu';
import NavbarMobile from '../components/NavbarMobile';
import { cn } from '../lib/utils';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  menu: React.ReactNode;
  heroContainer?: React.ReactNode;
  background?: React.ReactNode;
  backgroundTransition?: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  menu, 
  heroContainer, 
  background,
  backgroundTransition, 
  className 
}) => {
  // Menu width in pixels - used for content margin
  const menuWidth = 300;

  return (
    <div className="relative">
      {/* Mobile navbar - will handle its own visibility */}
      <NavbarMobile />

      <div className={cn('w-full min-h-screen flex flex-col', className)}>
        {/* Background (covers entire layout) */}
        <div className='fixed inset-0 z-0'>
          {background || <div className='w-full h-full bg-gray-100' />}
        </div>

        {/* Main content wrapper */}
        <div className='flex flex-col flex-grow z-10 overflow-x-hidden'>
          {/* Hero Container (fixed height) */}
          {heroContainer && (
            <div className='w-full z-[5] h-[70vh] md:h-[52vh] md:pt-16 lg:pt-0'>
              {heroContainer}
            </div>
          )}

          {backgroundTransition && (
            <div className='w-full z-[5] h-[200px] isolate relative justify-center '>
              {backgroundTransition}
            </div>
          )}

          {/* Main Content */}
          <div
            className={cn(
              'flex-grow z-[5]',
              !heroContainer && 'pt-16 lg:pt-0',
              menuWidth > 0 && 'lg:ml-[300px]'
            )}
          >
            {children}
          </div>

          {/* Footer */}
          <div className={cn('z-[5]')}>
            <Footer />
          </div>
        </div>

        {/* Desktop Menu (fixed position on the left) */}
        <div
          className='fixed top-0 left-0 bottom-0  z-[10] py-4 px-3 hidden lg:block'
          style={{ width: `${menuWidth}px` }}
        >
          <div className='h-screen overflow-y-auto pb-48'>
            <MemoizedMenu>{menu}</MemoizedMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;