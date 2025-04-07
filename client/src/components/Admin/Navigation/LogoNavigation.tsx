import React from 'react';
import CreatorHubLogo from '../../../assets/CreatorHubMenuLogo.svg?react';
import PacketHubLogo from '../../../assets/PacketHubMenuLogo.svg?react';
import NewsHubLogo from '../../../assets/NewsHubLogo.svg?react';

import { useLocation } from 'react-router-dom';

const LogoNavigation:React.FC = () => {

  const location = useLocation();
  const path = location.pathname;
  const category = path === '/' || path.split('/')[1].includes('category');
  const isCreatorHub = path.includes('creatorshub');
  const isNewsHub = path.includes('newshub');

  return (
    <>
    {(
      <div className='-mb-4'>
        {isCreatorHub && <CreatorHubLogo className='w-full' />}
        {isNewsHub && <NewsHubLogo className='w-full' />}
        {category && <PacketHubLogo className='w-full' />}
      </div>
    )}
    </>
  );
}

export default LogoNavigation;