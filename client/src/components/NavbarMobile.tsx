import React, { useState, useEffect, useCallback } from 'react';
import MobileMenu from './Menu/MobileMenu';
import PktHubLogo from '../assets/PktHubLogo.svg?react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { cn } from '../lib/utils';

const NavbarMobile: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Define the scroll handler with useCallback to prevent recreating it on every render
  const controlNavbar = useCallback(() => {
    // Only apply hide/show effect on mobile devices
    if (window.innerWidth >= 1024) {
      setVisible(true);
      return;
    }
    
    const currentScrollY = window.scrollY;
    
    // Hide navbar when scrolling down past threshold
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    
    // Update last scroll position
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    // Use throttle instead of debounce for smoother scroll response
    const throttledScrollHandler = _.throttle(() => {
      controlNavbar();
    }, 150);
    
    window.addEventListener('scroll', throttledScrollHandler);
    window.addEventListener('resize', throttledScrollHandler);
    
    // Initial check
    controlNavbar();
    
    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('resize', throttledScrollHandler);
      throttledScrollHandler.cancel();
    };
  }, [controlNavbar]);

  return (
    <div 
      className={cn(
        'fixed top-0 left-0 right-0 flex w-full justify-between items-center px-2 h-16',
        'bg-white/90 backdrop-blur-sm shadow-sm',
        'transition-transform duration-300 ease-in-out z-50',
        'lg:hidden', // Only display on mobile and tablet, hide on desktop
        visible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <PktHubLogo className="h-10 w-auto" />
        </Link>
      </div>
      <div>
        <MobileMenu />
      </div>
    </div>
  );
};

export default React.memo(NavbarMobile);