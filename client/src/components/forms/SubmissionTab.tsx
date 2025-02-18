import React from 'react';
import PacketHubLogoMobile from '../../assets/PacketHubMobile.svg?react';
import CreatorHub from '../../assets/CreatorHubLogoMobile.svg?react';
import { cn } from '../../lib/utils';

interface SubmissionTabProps {
  handleTabChange: (tab: "channel" | "creator") => void;
  selectedValue: "channel" | "creator";
}

const SubmissionTab:React.FC<SubmissionTabProps> = ({
  selectedValue,
  handleTabChange,
}) => {
  return (
    <div className='flex gap-4'>
      <div onClick={() => handleTabChange('channel')} className={cn('flex h-24 px-2 w-32 md:h-24 md:w-44 bg-blue-700 hover:glass-white rounded-3xl justify-center items-center', selectedValue === 'channel' ? 'glass-black' : 'opacity-40')}>
        <PacketHubLogoMobile className='w-[174px] h-[28px]'/>
      </div>
      <div onClick={() => handleTabChange('creator')} className={cn('flex h-24 px-2 w-32 md:h-24 md:w-44 bg-blue-700 hover:glass-white rounded-3xl justify-center items-center', selectedValue === 'creator' ? 'glass-black' : 'opacity-40')}>
        <CreatorHub className='w-[174px] h-[28px]' />
      </div>
    </div>
  );
};

export default SubmissionTab;