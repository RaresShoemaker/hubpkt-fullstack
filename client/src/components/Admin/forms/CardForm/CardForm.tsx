/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../../../../store/features/ui/useUITheme';
import ButtonBase from '../../Buttons/ButtonBase';
import { useForm } from '../useForm';

import { useCards } from '../../../../store/features/cards/useCards';
import { useCategories } from '../../../../store/features/categories/useCategories';

import { createCardSchema, updateCardSchema, validateExpiration } from '../validations/card.validation';

import { Input } from '../CustomInput';
import { TextArea } from '../CustomTextArea';
import { Checkbox } from '../CustomCheckbox';
import { DateTimePicker } from '../DatePicker';
import { FileUpload } from '../FileUpload';

interface CardFormProps {
	onClose: () => void;
}

const CardForm: React.FC<CardFormProps> = ({ onClose }) => {
	const { isDark } = useTheme();
	const { currentCategory } = useCategories();
	const {
		currentCard,
		handleCreateCard,
		handleUpdateCard,
		handleDeleteCard,
		handleClearErrors,
		loading,
		error
	} = useCards();

	// Determine initial form data based on currentCard or currentCategory
	const initialFormData = useMemo(() => {
		if (currentCard) {
			// If we have an expiration date, split it into date and time components
			let expirationDate = '';
			let expirationTime = '';

			if (currentCard.expiration) {
				const date = new Date(currentCard.expiration);
				expirationDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
				expirationTime = date.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
			}

			return {
				title: currentCard.title,
				description: currentCard.description,
				genre: currentCard.genre,
				categoryId: currentCard.categoryId,
				href: currentCard.href,
				isAvailable: Boolean(currentCard.isAvailable),
				isDiscover: Boolean(currentCard.isDiscover),
				isHot: Boolean(currentCard.isHot),
				isPreview: Boolean(currentCard.isPreview),
				isSquare: Boolean(currentCategory?.hasSquareContent),
				expirationDate,
				expirationTime,
				image: null as File | null,
				imageUrl: currentCard.image
			};
		} else {
			return {
				title: '',
				description: '',
				genre: '',
				href: '',
				categoryId: currentCategory?.id || '',
				isAvailable: true,
				isDiscover: false,
				isHot: false,
				isPreview: false,
				isSquare: currentCategory?.hasSquareContent || false,
				expirationDate: '',
				expirationTime: '',
				image: null as File | null,
				imageUrl: ''
			};
		}
	}, [currentCard, currentCategory]);

	// Determine which schema to use based on create or update mode
	const schema = useMemo(() => {
		return currentCard ? updateCardSchema : createCardSchema;
	}, [currentCard]);

	// Custom validation for expiration date and additional constraints
	const customValidation = useCallback(
		(formData: any) => {
			const errors: Record<string, string> = {};

			// Validate expiration date
			if (formData.expirationDate) {
				const expirationError = validateExpiration(formData.expirationDate, formData.expirationTime);

				if (expirationError) {
					errors.expiration = expirationError;
				}
			}

			// Validate image for new cards
			if (!currentCard && !formData.image) {
				errors.image = 'Image is required';
			}

			return Object.keys(errors).length > 0 ? errors : null;
		},
		[currentCard]
	);

	// Form submission handler
	const handleFormSubmit = useCallback(
		async (formData: any) => {
			// Combine date and time to get full expiration datetime
			const expiration = formData.expirationDate
				? new Date(`${formData.expirationDate}T${formData.expirationTime || '00:00'}`)
				: undefined;

			if (currentCard) {
				// Update existing card

				const updateData = {
					id: currentCard.id,
					title: formData.title,
					href: formData.href,
					description: formData.description,
					genre: formData.genre,
					categoryId: formData.categoryId,
					isAvailable: formData.isAvailable,
					isDiscover: formData.isDiscover,
					isHot: formData.isHot,
					isPreview: formData.isPreview,
					isSquare: formData.isSquare,
					expiration
				};

				if (formData.image instanceof File) {
					Object.assign(updateData, { image: formData.image });
				}

				await handleUpdateCard(updateData);

				if (!error.updateCard) {
					onClose();
				}
			} else {
				const createData = {
					title: formData.title,
					description: formData.description,
					genre: formData.genre,
					categoryId: formData.categoryId,
					href: formData.href,
					isAvailable: formData.isAvailable,
					isDiscover: formData.isDiscover,
					isHot: formData.isHot,
					isPreview: formData.isPreview,
					isSquare: formData.isSquare,
					expiration,
					image: formData.image as File
				};

				await handleCreateCard(createData);

				if (!error.createCard) {
					onClose();
				}
			}
		},
		[currentCard, handleCreateCard, handleUpdateCard, error, onClose]
	);

	// Use our generic form hook
	const { formData, errors, handleChange, setField, handleSubmit } = useForm({
		initialData: initialFormData,
		schema: schema as any, // Type assertion to bypass the type mismatch
		onSubmit: handleFormSubmit,
		clearErrors: handleClearErrors,
		customValidation
	});

	// Enhanced file change handler
	const handleFileChange = useCallback(
		(file: File | null) => {
			if (file) {
				// Validate file type
				const validTypes = [
					'image/jpeg',
					'image/png',
					'image/gif',
					'image/webp',
					'image/svg+xml',
					'image/svg'
				];
				if (!validTypes.includes(file.type)) {
					return;
				}

				// Validate file size (5MB max)
				if (file.size > 5 * 1024 * 1024) {
					return;
				}

				setField('image', file);
				setField('imageUrl', URL.createObjectURL(file));
			} else {
				setField('image', null);
				setField('imageUrl', '');
			}
		},
		[setField]
	);

	// Delete card handler
	const handleDeleteClick = useCallback(() => {
		if (currentCard) {
			handleDeleteCard(currentCard.id);
			onClose();
		}
	}, [currentCard, handleDeleteCard, onClose]);

	// Determine if we're in create or update mode
	const isUpdateMode = Boolean(currentCard);
	const isLoading = isUpdateMode ? loading.updateCard : loading.createCard;
	const apiError = isUpdateMode ? error.updateCard : error.createCard;

	return (
		<form onSubmit={handleSubmit} className='space-y-4'>
			{/* Title input */}
			<Input
				label='Card Title'
				name='title'
				type='text'
				value={formData.title}
				onChange={handleChange}
				placeholder='Enter card title'
				required
				error={errors.title}
			/>

			{/* Description textarea */}
			<TextArea
				label='Description'
				name='description'
				value={formData.description}
				onChange={handleChange}
				rows={3}
				placeholder='Enter card description'
				required
				error={errors.description}
			/>

			{/* Href input */}
			<Input
				label='Link'
				name='href'
				type='text'
				value={formData.href}
				onChange={handleChange}
				placeholder='Enter the website link'
				required
				error={errors.href}
			/>

			{/* Genre input */}
			<Input
				label='Genre'
				name='genre'
				type='text'
				value={formData.genre}
				onChange={handleChange}
				placeholder='Enter genre (e.g., Adventure, Mystery, Sci-Fi)'
				error={errors.genre}
			/>

			{/* Category ID - hidden field */}
			<input type='hidden' name='categoryId' value={formData.categoryId} />

			{/* Expiration date and time picker */}
			<DateTimePicker
				label='Expiration Date'
				dateId='expirationDate'
				timeId='expirationTime'
				dateValue={formData.expirationDate}
				timeValue={formData.expirationTime}
				onDateChange={handleChange}
				onTimeChange={handleChange}
				error={errors.expiration}
				helperText='If set, card will not be available after this date and time'
			/>

			{/* Image upload */}
			<FileUpload
				label='Card Image'
				name='image'
				onChange={handleFileChange}
				preview={formData.imageUrl}
				required={!isUpdateMode}
				error={errors.image}
				helperText='Accepted formats: JPEG, PNG, GIF, WebP. Max size: 5MB'
				accept='image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/svg'
			/>

			{/* Checkboxes section */}
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
				<Checkbox
					label='Available to users'
					name='isAvailable'
					checked={formData.isAvailable}
					onChange={handleChange}
				/>

				<Checkbox
					label='Add to Discover section'
					name='isDiscover'
					checked={formData.isDiscover}
					onChange={handleChange}
				/>

				<Checkbox label='Mark as Hot' name='isHot' checked={formData.isHot} onChange={handleChange} />

				<Checkbox
					label='Show in preview'
					name='isPreview'
					checked={formData.isPreview}
					onChange={handleChange}
				/>
			</div>

			{/* API Error message */}
			{apiError && (
				<div className='p-3 bg-red-100 border border-red-400 text-red-700 rounded'>{apiError}</div>
			)}

			{/* Form buttons */}
			<div className='flex justify-center mt-6 gap-3'>
				<ButtonBase
					type='button'
					variant='secondary'
					onClick={onClose}
					className='font-semibold'
					disabled={isLoading}
				>
					Cancel
				</ButtonBase>
				<ButtonBase
					type='submit'
					className={
						isDark
							? 'bg-dark-text-accent text-white font-semibold'
							: 'bg-light-text-accent text-white font-semibold'
					}
					disabled={isLoading}
				>
					{isLoading ? 'Saving...' : isUpdateMode ? 'Update Card' : 'Create Card'}
				</ButtonBase>
				{isUpdateMode && (
					<ButtonBase onClick={handleDeleteClick} className='font-semibold' variant='ghost'>
						Delete Card
					</ButtonBase>
				)}
			</div>
		</form>
	);
};

export default CardForm;
