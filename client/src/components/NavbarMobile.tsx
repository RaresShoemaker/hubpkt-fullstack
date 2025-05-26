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
    } 
    // Show navbar when scrolling up OR when near the top
    else if (currentScrollY < lastScrollY || currentScrollY <= 50) {
      setVisible(true);
    }
    
    // Update last scroll position
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    // Use debounce with leading/trailing for better responsiveness
    const debouncedScrollHandler = _.debounce(controlNavbar, 100, {
      leading: true,
      trailing: true
    });
    
    window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
    window.addEventListener('resize', debouncedScrollHandler);
    
    // Initial check
    controlNavbar();
    
    return () => {
      window.removeEventListener('scroll', debouncedScrollHandler);
      window.removeEventListener('resize', debouncedScrollHandler);
      debouncedScrollHandler.cancel();
    };
  }, [controlNavbar]);

  return (
    <div 
      className={cn(
        'fixed top-0 left-0 right-0 flex w-full justify-between items-center px-2 h-16',
        // 'bg-white/90 backdrop-blur-sm shadow-sm', // Added background and shadow
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