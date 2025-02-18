import React, { useRef, useState, useEffect } from 'react';
import { useToast } from '../context/ToasterBannerContext/hooks';
import { TOASTER_TYPES } from '../context/ToasterBannerContext/constants';
import { UploadIcon } from 'lucide-react';

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_FILE_TYPES = '.pdf,.jpg,.jpeg,.png';
const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

type ImgUploaderProps = {
	onFileSelect: (file: File | null) => void;
	name: string;
	resetKey?: number; // Add resetKey prop to trigger reset
};

const ImgUploader: React.FC<ImgUploaderProps> = ({ onFileSelect, resetKey = 0, name }) => {
	const imgInputRef = useRef<HTMLInputElement>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const { showToast } = useToast();

	// Reset the component when resetKey changes
	useEffect(() => {
		if (resetKey > 0) {
			setFile(null);
			if (imgInputRef.current) {
				imgInputRef.current.value = '';
			}
		}
	}, [resetKey]);

	const validateFileType = (file: File): boolean => {
		return ALLOWED_MIME_TYPES.includes(file.type);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setIsLoading(true);
			try {
				const selectedFile = e.target.files[0];

				// Validate file type
				if (!validateFileType(selectedFile)) {
					showToast(
						'Invalid file type. Please upload PDF, JPG, or PNG files only.',
						TOASTER_TYPES.ERROR,
						3000
					);
					if (imgInputRef.current) {
						imgInputRef.current.value = '';
					}
					return;
				}

				// Validate file size (5MB)
				if (selectedFile.size > FILE_SIZE_LIMIT) {
					showToast('File size must be less than 5MB', TOASTER_TYPES.ERROR, 3000);
					if (imgInputRef.current) {
						imgInputRef.current.value = '';
					}
					return;
				}

				setFile(selectedFile);
				onFileSelect(selectedFile);
			} finally {
				setIsLoading(false);
			}
		}
	};

	return (
		<div
			onClick={() => imgInputRef.current?.click()}
			className={`${
				file ? 'h-40' : 'h-12'
			} w-full border-2 border-dashed rounded-3xl flex items-center justify-center hover:cursor-pointer relative`}
		>
			<input
				type='file'
				ref={imgInputRef}
				name={name}
				hidden
				required
				accept={ALLOWED_FILE_TYPES}
				onChange={handleFileChange}
			/>
			<div className='flex w-full flex-col items-center gap-4'>
				{!file && (
					<>
						{!isLoading ? (
							<div className='text-[##CCCCCC] w-full flex items-center justify-between px-4 text-sm'>
								<div className='flex flex-col md:flex-row md:gap-1'>
									<p>Upload Image</p>
									<p>*maximum file 5mb (jpg, png)</p>
								</div>
								<UploadIcon className='text-grey-main text-5xl' />
							</div>
						) : (
							<h3>
								{React.Children.toArray(
									new Array(3)
										.fill('_')
										.map(() => <span className='pulse-dot text-grey-main text-5xl'>.</span>)
								)}
							</h3>
						)}
					</>
				)}
				{file && (
					<div className='flex flex-col items-center'>
						{file.type.startsWith('image/') ? (
							<img
								width={144}
								height={144}
								src={URL.createObjectURL(file)}
								alt='uploaded'
								className='h-32 w-32 object-cover rounded-md'
							/>
						) : (
							<div className='h-32 w-32 flex items-center justify-center bg-gray-100 rounded-md'>
								<p className='text-sm text-gray-600'>{file.name}</p>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ImgUploader;
