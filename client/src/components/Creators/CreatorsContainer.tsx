import React from 'react';
import CreatorsCard from './CreatorsCard';
import { CreatorsCardDataType } from '../../store/features/cards/cards.types';

const CreatorsCategoryContainer: React.FC<CreatorsCardDataType> = React.memo(({data, title}) => {
  return (
    <div className='flex flex-col gap-4 w-full md:pr-0'>
      {/* Title section */}
      <div className='flex items-center gap-1'>
        <p className='font-semibold text-2xl text-white'>{title}</p>
      </div>

      {/* Scrollable container */}
      <div className='w-full'>
        <div className='max-w-full overflow-x-auto no-scrollbar'>
          <div className='inline-flex gap-4'>
            {data && data.map((card, index) => (
              <div key={card.id || index} className='shrink-0'>
                <CreatorsCard {...card} />
              </div>
            ))}
            <div className='h-60 w-4'></div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default CreatorsCategoryContainer;