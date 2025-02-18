import React, { useState, useEffect, useRef } from 'react';
import MobileMenu from './Menu/MobileMenu';
import PktHubLogo from '../assets/PktHubLogo.svg?react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const NavbarMobile: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layoutContainer = containerRef.current?.closest('.relative.z-10');
    
    const controlNavbar = () => {
      if (!layoutContainer) return;
      
      const currentScrollY = layoutContainer.scrollTop;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Debounced version of controlNavbar
    const debouncedControlNavbar = _.debounce(controlNavbar, 150, {
      leading: true,
      trailing: true
    });

    if (layoutContainer) {
      layoutContainer.addEventListener('scroll', debouncedControlNavbar);
    }

    return () => {
      if (layoutContainer) {
        layoutContainer.removeEventListener('scroll', debouncedControlNavbar);
        debouncedControlNavbar.cancel(); // Clean up the debounce
      }
    };
  }, [lastScrollY]);

  return (
    <div 
      ref={containerRef}
      className={`
        lg:hidden flex w-full sticky top-0 z-50 justify-between items-center px-2 h-20
        transition-all duration-500 ease-in-out transform
        ${visible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
        }
      `}
    >
      <div>
        <Link to="/">
          <PktHubLogo />
        </Link>
      </div>
      <div>
        <MobileMenu />
      </div>
    </div>
  );
};

export default NavbarMobile;