/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from 'react';
import { useCategoryDesigns } from '../store/features/categoryDesigns/useCategoryDesigns';
import { ButtonStyle } from '../components/Hero/HeroButton';
import GridEditor from '../components/Admin/Category/CategoryDesign/GridEditor';
import { convertHtmlElementsToButtonElements, createPositionClasses } from '../utils/designElementUtils';
import BackgroundTransition from '../components/BackgroundTransition';
import BlurTransition from '../components/BlurTransition';
import { cn } from '../lib/utils';
import ButtonFactory from '../components/Admin/Category/CategoryDesign/ButtonFactory';
import ButtonEditor from '../components/Admin/Category/CategoryDesign/ButtonEditor';

interface ButtonElementData {
	id: string;
	text: string;
	link: string;
	style: ButtonStyle;
	position: {
		colStart: number;
		rowStart: number;
		colSpan: number;
		rowSpan: number;
	};
}

interface CategoryDesignLayoutProps {
	heroImage?: string;
	backgroundGradient?: string;
	transitionGradient?: string;
	designId: string;
}

const CategoryDesignLayout: React.FC<CategoryDesignLayoutProps> = ({
	heroImage,
	backgroundGradient,
	transitionGradient,
	designId
}) => {
	const { addHtmlElement, currentDesign, removeHtmlElement } = useCategoryDesigns();

	const [buttonElements, setButtonElements] = useState<ButtonElementData[]>([]);
	const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null);

	// Compute the selected button from the buttonElements array
	// This ensures we always have the most up-to-date button data
	const selectedButton = selectedButtonId
		? buttonElements.find((button) => button.id === selectedButtonId) || null
		: null;

	// Convert HTML elements to button elements on initial load
	useEffect(() => {
		if (currentDesign && currentDesign.htmlElements) {
			const htmlElements = currentDesign.htmlElements.filter((html) => html.htmlTag.type === 'button');
			const initialButtons = convertHtmlElementsToButtonElements(htmlElements);
			setButtonElements(initialButtons);
		}
	}, [currentDesign]);

	// Handle creating a new button
	const handleCreateButton = useCallback(async (buttonData: { text: string; style: ButtonStyle; link: string }) => {
		const newButton = {
			text: buttonData.text,
			style: buttonData.style,
			link: buttonData.link,
			type: 'button',
			position: {
				colStart: (currentDesign?.device === 'mobile' || currentDesign?.device === 'tablet') ? 2 : 7,
				rowStart: (currentDesign?.device === 'mobile' || currentDesign?.device === 'tablet') ? 4 : 2,
				colSpan: (currentDesign?.device === 'mobile' || currentDesign?.device === 'tablet') ? 3 : 2,
				rowSpan: 1
			}
		};

		try {
			const newAddedElement = await addHtmlElement({
				designElementId: designId,
				htmlTag: {
					...newButton,
					position: createPositionClasses(newButton.position)
				}
			});
			
			// Only add the element if we have a valid payload
			if (newAddedElement.payload && typeof newAddedElement.payload === 'object') {
				// The effect that watches currentDesign.htmlElements will also add this button,
				// so we don't need to manually add it here
				// Don't call setButtonElements - rely on the useEffect to update the state
			}
		} catch (error) {
			console.error('Error creating button:', error);
		}
	}, [addHtmlElement, currentDesign?.device, designId]);

	// Handle updating a button
	const handleUpdateButton = useCallback((id: string, updates: Partial<ButtonElementData>) => {
		setButtonElements((prevButtons) =>
			prevButtons.map((button) => (button.id === id ? { ...button, ...updates } : button))
		);
	}, []);

	// Handle deleting a button
	const handleDeleteButton = useCallback(
		async (id: string) => {
			await removeHtmlElement(id);
			setButtonElements((buttons) => buttons.filter((button) => button.id !== id));
			setSelectedButtonId(null);
		},
		[removeHtmlElement]
	);

	// Handle grid changes - this is called when buttons are dragged
	const handleElementsChange = useCallback((elements: ButtonElementData[]) => {
		// Update all button elements
		setButtonElements(elements);

		// Don't need to explicitly update selectedButton
		// because it's derived from buttonElements and selectedButtonId
	}, []);

	// Handle selecting a button
	const handleSelectButton = useCallback((buttonElement: ButtonElementData) => {
		setSelectedButtonId(buttonElement.id);
	}, []);

	return (
		<div className='relative'>
			<div className='w-full min-h-screen flex flex-col'>
				{/* Background (covers entire layout) */}
				<div className='fixed inset-0 z-0'>
					{backgroundGradient && <BackgroundTransition backgroundGradient={backgroundGradient} />}
				</div>

				{/* Main content wrapper */}
				<div className='flex flex-col flex-grow z-10 overflow-x-hidden'>
					{/* Hero Container (fixed height) */}
					{heroImage && (
						<div className='w-full z-[5] h-[70vh] md:h-[52vh] pt-0 lg:pt-0'>
							<GridEditor
								elements={buttonElements}
								onElementsChange={handleElementsChange}
								backgroundImage={heroImage}
								onSelectElement={(id) => id && setSelectedButtonId(id)}
								minCellHeight={80}
								minCellWidth={80}
							/>
						</div>
					)}

					{transitionGradient && (
						<div className='w-full z-[5] h-[200px] isolate relative justify-center '>
							<BlurTransition color={transitionGradient} blur={40} className='bottom-0 h-[230px]' />
						</div>
					)}

					{/* Main Content */}
					<div className={cn('flex-grow z-[5] lg:ml-[300px] px-4 md:px-0')}>
						<div className='flex flex-col md:flex-row gap-5 md:gap-10 -mt-20 md:mt-0 mb-10'>
							<div className='items-start justify-center w-full md:w-fit'>
								<ButtonFactory onCreateButton={handleCreateButton} />
							</div>
							<div className='bg-gray-600 rounded-lg w-full md:w-[200px] p-4'>
								<h3 className='text-white font-medium mb-4'>Buttons ({buttonElements.length})</h3>

								{buttonElements.length === 0 ? (
									<p className='text-gray-400 text-sm'>
										No buttons added yet. Use the Button Factory to create one.
									</p>
								) : (
									<div className='space-y-2 max-h-[40vh] md:max-h-none overflow-y-auto'>
										{buttonElements.map((button) => (
											<div
												key={button.id}
												className={cn(
													'px-4 py-2 rounded-lg cursor-pointer',
													selectedButtonId === button.id
														? 'bg-blue-900/50 border border-blue-500'
														: 'bg-gray-700 hover:bg-gray-600'
												)}
												onClick={() => handleSelectButton(button)}
											>
												<div className='flex justify-between items-center'>
													<span className='text-white'>{button.text}</span>
													<span className='text-gray-400 text-xs'>
														{button.position.colStart},{button.position.rowStart}
													</span>
												</div>
											</div>
										))}
									</div>
								)}
							</div>

							{selectedButton && (
								<div className='w-full md:w-auto'>
									<ButtonEditor
										key={`editor-${selectedButton.id}-${JSON.stringify(selectedButton.position)}`}
										initialValue={selectedButton}
										onUpdate={handleUpdateButton}
										onDelete={handleDeleteButton}
									/>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className='fixed top-0 left-0 bottom-0 z-[10] py-4 px-3 hidden lg:block w-[300px]'>
					<div className='h-screen max-h-[700px] overflow-y-auto'>
						<div className='h-full md:hidden lg:w-full rounded-2xl bg-[#1B1B1B] px-4 py-6 lg:flex flex-col justify-between hidden shadow-[0_0_40px_0_rgba(62,74,192,0.24)]'></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CategoryDesignLayout;
