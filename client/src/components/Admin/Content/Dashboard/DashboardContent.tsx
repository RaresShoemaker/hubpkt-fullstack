import React, { useState } from 'react';
import CategoryCard from '../../Category/CategoryCard';
import ModalPortal from '../../Modal';
import CategoryForm from '../../forms/CategoryForm/CategoryForm';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import { useCategories } from '../../../../store/features/categories/useCategories';
import { useAuth } from '../../../../store/features/auth/useAuth';
import ToolBar from '../ToolBar';
import GenericDragDrop from '../DnD/GenericDnD';
import DraggableItemCard from '../DnD/CardDnD';

const DashboardContent: React.FC = () => {
	const { isDark } = useTheme();
	const { items, reorderCategoriesList } = useCategories();
	const { user } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editCategoryId, setEditCategoryId] = useState<string | undefined>(undefined);
	const [isEditOrder, setIsEditOrder] = useState(false);
	const [newOrder, setNewOrder] = useState<string[]>([]);

	const handleCreateCategory = () => {
		setEditCategoryId(undefined);
		setIsModalOpen(true);
	};

	const handleEditCategory = (categoryId: string) => {
		setEditCategoryId(categoryId);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setTimeout(() => {
			setEditCategoryId(undefined);
		}, 300);
	};

	const handleEditOrder = () => {
		setIsEditOrder(!isEditOrder);
		setNewOrder([]);
	}

	const handleSaveOrder = () => {
		reorderCategoriesList(newOrder);
		setIsEditOrder(false);
		setNewOrder([]);
	}

	return (
		<div
			className={`flex-1 p-8 rounded-2xl border transition-colors duration-300
      ${isDark ? 'bg-dark-surface border-dark-border/20' : 'bg-light-surface border-light-border/20'}`}
		>
			{/* Page header */}
			<div className='mb-8 flex gap-20 items-center'>
				<div className='flex flex-col'>
				<h1 className={`text-2xl font-bold ${isDark ? 'text-dark-text-primary' : 'text-light-text-primary'}`}>
					Dashboard Overview
				</h1>
				<p className={`mt-2 ${isDark ? 'text-dark-text-secondary' : 'text-light-text-secondary'}`}>
					Welcome back,{' '}
					<span className={isDark ? 'text-dark-text-accent' : 'text-light-text-accent'}>{user?.name}</span>
				</p>
				</div>
				<div className=''>
				<ToolBar isEditOrder handleEditOrder={handleEditOrder} showSaveOrder={isEditOrder} handleSaveOrder={handleSaveOrder}/>
				</div>
			</div>

			{/* Content area */}
			{!isEditOrder && ( <div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{/* Category cards with built-in edit functionality */}
					{items.map((category) => (
						<CategoryCard key={category.id} {...category} onEdit={handleEditCategory} />
					))}

					{/* Create new category card */}
					<CategoryCard isForCreate onClick={handleCreateCategory} />
				</div>
			</div> )}

			{/* Drag and drop reordering */}
			{isEditOrder && (
				<GenericDragDrop
				items={items}
				onReorder={(updatedItems) => setNewOrder(updatedItems.map((item) => item.id))}
				renderItem={(item, _isDragging, isDragOver) => (
					<DraggableItemCard
						key={item.id}
						item={item}
						itemType='category'
						position={item.order}
						isDraggedOver={isDragOver}
						isDragging={false}
					/>
				)}
			/>
			)}

			{/* Modal Portal with dynamic title based on mode */}
			<ModalPortal
				isOpen={isModalOpen}
				onClose={closeModal}
				title={editCategoryId ? 'Edit Category' : 'Create New Category'}
				maxWidth='lg'
			>
				<CategoryForm categoryId={editCategoryId} onClose={closeModal} />
			</ModalPortal>
		</div> 
	);
};

export default DashboardContent;
