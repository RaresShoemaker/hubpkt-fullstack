import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryDesigns } from '../store/features/categoryDesigns/useCategoryDesigns';
import { ButtonStyle } from '../components/Hero/HeroButton';
import { HtmlElement } from '../store/features/categoryDesigns/categoryDesigns.types';
import GridEditor from '../components/Admin/Category/CategoryDesign/GridEditor';
import {
	convertHtmlElementsToButtonElements,
	convertButtonElementsToHtmlElements,
	generateButtonId
} from '../utils/designElementUtils';
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
	htmlElements?: HtmlElement[];
	designId: string;
}

const CategoryDesignLayout: React.FC<CategoryDesignLayoutProps> = ({
	heroImage,
	backgroundGradient,
	transitionGradient,
	htmlElements = [],
	designId
}) => {
	const navigate = useNavigate();
	const { editDesignElement } = useCategoryDesigns();

	const [buttonElements, setButtonElements] = useState<ButtonElementData[]>([]);
	const [selectedButton, setSelectedButton] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Convert HTML elements to button elements on initial load
	useEffect(() => {
		if (htmlElements && htmlElements.length > 0) {
			const initialButtons = convertHtmlElementsToButtonElements(htmlElements);
			setButtonElements(initialButtons);
			setHasUnsavedChanges(false);
		}
	}, [htmlElements]);

	// Handle creating a new button
	const handleCreateButton = (buttonData: { text: string; style: ButtonStyle; link: string }) => {
		const newButton: ButtonElementData = {
			id: generateButtonId(),
			text: buttonData.text,
			style: buttonData.style,
			link: buttonData.link,
			position: {
				colStart: 4, // Default position in the middle
				rowStart: 3,
				colSpan: buttonData.style === 'primary' ? 4 : 3, // Adjust span based on style
				rowSpan: 1
			}
		};

		setButtonElements([...buttonElements, newButton]);
		setSelectedButton(newButton.id);
		setHasUnsavedChanges(true);
	};

	// Handle updating a button
	const handleUpdateButton = (id: string, updates: { text?: string; style?: ButtonStyle }) => {
		setButtonElements((buttons) =>
			buttons.map((button) => (button.id === id ? { ...button, ...updates } : button))
		);
		setHasUnsavedChanges(true);
	};

	// Handle deleting a button
	const handleDeleteButton = (id: string) => {
		setButtonElements((buttons) => buttons.filter((button) => button.id !== id));
		setSelectedButton(null);
		setHasUnsavedChanges(true);
	};

	// Handle grid changes
	const handleElementsChange = (elements: ButtonElementData[]) => {
		setButtonElements(elements);
		setHasUnsavedChanges(true);
	};

	// Handle selecting a button
	const handleSelectButton = (id: string | null) => {
		setSelectedButton(id);
	};

	// Handle save
	const handleSave = async () => {
		if (!designId) {
			console.error('No design ID provided');
			return;
		}

		setIsSaving(true);

		try {
			const htmlElementsData = convertButtonElementsToHtmlElements(buttonElements);

			await editDesignElement({
				id: designId,
				htmlElements: htmlElementsData
			});

			setHasUnsavedChanges(false);
		} catch (error) {
			console.error('Error saving design:', error);
		} finally {
			setIsSaving(false);
		}
	};

	// Handle back navigation
	const handleBack = () => {
		if (hasUnsavedChanges) {
			const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
			if (!confirmed) return;
		}
		navigate(-1);
	};

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
						<div className='w-full z-[5] h-[70vh] md:h-[52vh] pt-16 lg:pt-0'>
							<GridEditor
								elements={buttonElements}
								onElementsChange={handleElementsChange}
								backgroundImage={heroImage}
							/>
						</div>
					)}

					{transitionGradient && (
						<div className='w-full z-[5] h-[200px] isolate relative justify-center '>
							<BlurTransition color={transitionGradient} blur={40} className='bottom-0 h-[230px]' />
						</div>
					)}

					{/* Main Content */}
					<div className={cn('flex-grow z-[5] ml-[300px]')}>
						<div className='flex gap-10 -mt-36 mb-20'>
							<div className='items-start justify-center w-fit'>
								<ButtonFactory onCreateButton={handleCreateButton} />
							</div>
							<div className='bg-gray-600 rounded-lg w-[200px] p-4'>
								<h3 className='text-white font-medium mb-4'>Buttons ({buttonElements.length})</h3>

								{buttonElements.length === 0 ? (
									<p className='text-gray-400 text-sm'>
										No buttons added yet. Use the Button Factory to create one.
									</p>
								) : (
									<div className='space-y-2'>
										{buttonElements.map((button) => (
											<div
												key={button.id}
												className={cn(
													'px-4 py-2 rounded-lg cursor-pointer',
													selectedButton === button.id
														? 'bg-blue-900/50 border border-blue-500'
														: 'bg-gray-700 hover:bg-gray-600'
												)}
												onClick={() => setSelectedButton(selectedButton === button.id ? null : button.id)}
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

              {selectedButton && (() => {
              const button = buttonElements.find(b => b.id === selectedButton);
              if (!button) return null;
              
              return (
                <ButtonEditor
                  id={button.id}
                  text={button.text}
                  style={button.style}
                  onUpdate={handleUpdateButton}
                  onDelete={handleDeleteButton}
                />
              );
            })()}
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
