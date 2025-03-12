import React from 'react';

interface MemoizedMenuProps {
	children: React.ReactNode;
}

const MemoizedMenu: React.FC<MemoizedMenuProps> = React.memo(
	({ children }) => children,
	() => true
);

export default MemoizedMenu;
