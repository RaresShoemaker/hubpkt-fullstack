import React from 'react';
import ButtonBase from '../Buttons/ButtonBase';
import { ArrowLeftRight,SaveIcon } from 'lucide-react';

interface ToolBarProps {
  isEditOrder: boolean;
  handleEditOrder: () => void;
  showSaveOrder: boolean;
  handleSaveOrder: () => void;
}

const ToolBar: React.FC<ToolBarProps> = ({isEditOrder, handleEditOrder, showSaveOrder, handleSaveOrder}) => {
  return (
    <div className='flex gap-4'>
        {isEditOrder && <><ButtonBase
          leftIcon={<ArrowLeftRight size={20} />}
          onClick={handleEditOrder}
          variant='primary'
          className='flex items-center h-10 w-10'
        />
        {showSaveOrder &&<ButtonBase
          leftIcon={<SaveIcon size={20} />}
          onClick={handleSaveOrder}
          variant='primary'
          className='flex items-center h-10 w-10'
          />}
        </>}
    </div>
  );
};

export default ToolBar;