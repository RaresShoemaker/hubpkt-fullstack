import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/environment';
import ApiError from '../utils/ApiError';
import { StatusCodes } from 'http-status-codes';
import sharp from 'sharp';

// Base URL for nginx-served files
const NGINX_BASE_URL = config.NGINX_BASE_URL || 'https://yourdomain.com';

// Base directory for file storage (should match Docker volume mount)
const STORAGE_BASE_PATH = config.STORAGE_BASE_PATH || '/app/uploads';

if (!NGINX_BASE_URL) {
	throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Missing NGINX_BASE_URL environment variable');
}

// File type definitions for different upload types
export enum FileUploadType {
	CATEGORY_ICON = 'category_icon',
	CARD_IMAGE = 'card_image',
	DESIGN_ELEMENT = 'design_element'
}

export interface UploadOptions {
	categoryId: string;
	uploadType: FileUploadType;
	deviceSize?: 'mobile' | 'tablet' | 'desktop'; // For design elements
}

function sanitizeFileName(fileName: string): string {
	return (
		fileName
			// Replace spaces with hyphens
			.replace(/\s+/g, '-')
			// Remove special characters and keep only alphanumeric, hyphens, and dots
			.replace(/[^a-zA-Z0-9-_.]/g, '')
			// Convert to lowercase
			.toLowerCase()
	);
}

function sanitizeFolderName(name: string): string {
	return name
		.replace(/\s+/g, '-')
		.replace(/[^a-zA-Z0-9-_]/g, '')
		.toLowerCase();
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
	try {
		await fs.access(dirPath);
	} catch (error) {
		// Directory doesn't exist, create it recursively
		await fs.mkdir(dirPath, { recursive: true });
	}
}



/**
 * Generate the folder structure based on upload type and category
 */
function generateFolderPath(options: UploadOptions, categoryTitle?: string): string {
	const sanitizedCategoryId = options.categoryId;
	const sanitizedCategoryTitle = categoryTitle ? sanitizeFolderName(categoryTitle) : 'category';
	const categoryFolder = `${sanitizedCategoryId}-${sanitizedCategoryTitle}`;

	switch (options.uploadType) {
		case FileUploadType.CATEGORY_ICON:
			return `categories/${categoryFolder}/icon`;
		
		case FileUploadType.CARD_IMAGE:
			return `categories/${categoryFolder}/cards`;
		
		case FileUploadType.DESIGN_ELEMENT:
			if (!options.deviceSize) {
				throw new ApiError(StatusCodes.BAD_REQUEST, 'Device size required for design elements');
			}
			return `categories/${categoryFolder}/design/${options.deviceSize}`;
		
		default:
			throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid upload type');
	}
}

// Add this helper function to determine file type and processing
function getFileTypeInfo(fileName: string, originalContentType: string): {
  isSvg: boolean;
  finalContentType: string;
  extension: string;
} {
  const extension = path.extname(fileName).toLowerCase();
  const isSvg = extension === '.svg' || originalContentType === 'image/svg+xml';
  
  if (isSvg) {
    return {
      isSvg: true,
      finalContentType: 'image/svg+xml',
      extension: '.svg'
    };
  }
  
  // For non-SVG files, we'll convert to JPEG for consistency
  return {
    isSvg: false,
    finalContentType: 'image/jpeg',
    extension: '.jpg'
  };
}

export async function uploadFile(
	buffer: Buffer,
	fileName: string,
	contentType: string,
	options: UploadOptions,
	categoryTitle?: string
): Promise<{ key: string; url: string; filePath: string; fileSize: number; processedContentType: string }> {
	try {
		const sanitizedFileName = sanitizeFileName(fileName);
		const fileTypeInfo = getFileTypeInfo(fileName, contentType);
		
		let processedBuffer: Buffer;
		let finalFileName: string;
		let imageMetadata: any = {};

		if (fileTypeInfo.isSvg) {
			// For SVG files, don't process with Sharp, keep as-is
			processedBuffer = buffer;
			finalFileName = sanitizedFileName; // Keep original .svg extension
			
			// For SVG, we'll set basic metadata manually
			imageMetadata = {
				width: 0, // SVGs are scalable, so dimensions aren't fixed
				height: 0,
				format: 'svg'
			};
		} else {
			// For other image types, process with Sharp
			processedBuffer = await sharp(buffer)
				.resize(800, 600, { fit: 'inside', withoutEnlargement: true })
				.jpeg({ quality: 85 })
				.toBuffer();
			
			// Change extension to .jpg since we're converting to JPEG
			const nameWithoutExt = path.basename(sanitizedFileName, path.extname(sanitizedFileName));
			finalFileName = `${nameWithoutExt}.jpg`;
			
			// Get processed image metadata
			imageMetadata = await sharp(processedBuffer).metadata();
		}
		
		// Create unique filename with timestamp and UUID
		const nameWithoutExt = path.basename(finalFileName, path.extname(finalFileName));
		const extension = path.extname(finalFileName);
		const uniqueFileName = `${Date.now()}-${uuidv4()}-${nameWithoutExt}${extension}`;
		
		// Generate the folder path based on upload type
		const folderPath = generateFolderPath(options, categoryTitle);
		
		// Create the relative path (key) that matches the nginx serving pattern
		const key = `${folderPath}/${uniqueFileName}`;
		
		// Create the absolute file path for storage
		const absoluteFilePath = path.join(STORAGE_BASE_PATH, key);
		const directoryPath = path.dirname(absoluteFilePath);
		
		// Ensure directory exists
		await ensureDirectoryExists(directoryPath);
		
		// Write file to filesystem
		await fs.writeFile(absoluteFilePath, processedBuffer);
		
		// Verify file was written
		const stats = await fs.stat(absoluteFilePath);
		
		// Return both the key (for database storage) and the public URL
		return {
			key,
			url: `${NGINX_BASE_URL}/${key}`,
			filePath: key, // Relative path for database storage
			fileSize: stats.size,
			processedContentType: fileTypeInfo.finalContentType
		};
	} catch (error) {
		console.error('Error uploading file:', error);
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to upload file');
	}
}

/**
 * Deletes a file from filesystem
 */
export async function deleteFile(key: string): Promise<boolean> {
	try {
		const absoluteFilePath = path.join(STORAGE_BASE_PATH, key);
		
		// Check if file exists before attempting deletion
		try {
			await fs.access(absoluteFilePath);
		} catch (error) {
			// File doesn't exist, return false
			console.warn(`File not found for deletion: ${key}`);
			return false;
		}
		
		// Delete the file
		await fs.unlink(absoluteFilePath);
		
		// Try to remove empty directories (optional cleanup)
		const dirPath = path.dirname(absoluteFilePath);
		try {
			await fs.rmdir(dirPath);
		} catch (error) {
			// Directory not empty or other error, ignore
		}
		
		return true;
	} catch (error) {
		console.error('Error deleting file:', error);
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete file');
	}
}

export function getPublicUrl(key: string): string {
	return `${NGINX_BASE_URL}/${key}`;
}

export async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
	const chunks: Buffer[] = [];

	for await (const chunk of stream) {
		if (Buffer.isBuffer(chunk)) {
			chunks.push(chunk);
		} else {
			chunks.push(Buffer.from(chunk as string));
		}
	}

	return Buffer.concat(chunks);
}

/**
 * Check if a file exists on the filesystem
 */
export async function fileExists(key: string): Promise<boolean> {
	try {
		const absoluteFilePath = path.join(STORAGE_BASE_PATH, key);
		await fs.access(absoluteFilePath);
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Get file metadata from filesystem
 */
export async function getFileMetadata(key: string): Promise<{
	size: number;
	mtime: Date;
	exists: boolean;
}> {
	try {
		const absoluteFilePath = path.join(STORAGE_BASE_PATH, key);
		const stats = await fs.stat(absoluteFilePath);
		
		return {
			size: stats.size,
			mtime: stats.mtime,
			exists: true
		};
	} catch (error) {
		return {
			size: 0,
			mtime: new Date(),
			exists: false
		};
	}
}

/**
 * Clean up category folder when category is deleted
 */
export async function deleteCategoryFolder(categoryId: string, categoryTitle?: string): Promise<boolean> {
	try {
		const sanitizedCategoryTitle = categoryTitle ? sanitizeFolderName(categoryTitle) : 'category';
		const categoryFolder = `${categoryId}-${sanitizedCategoryTitle}`;
		const categoryPath = path.join(STORAGE_BASE_PATH, 'categories', categoryFolder);
		
		// Check if folder exists
		try {
			await fs.access(categoryPath);
		} catch (error) {
			// Folder doesn't exist, return true (already cleaned)
			return true;
		}
		
		// Remove entire category folder recursively
		await fs.rm(categoryPath, { recursive: true, force: true });
		
		return true;
	} catch (error) {
		console.error('Error deleting category folder:', error);
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete category folder');
	}
}

/**
 * Rename category folder when category title changes
 */
export async function renameCategoryFolder(
	categoryId: string, 
	oldTitle: string, 
	newTitle: string
): Promise<boolean> {
	try {
		const oldCategoryFolder = `${categoryId}-${sanitizeFolderName(oldTitle)}`;
		const newCategoryFolder = `${categoryId}-${sanitizeFolderName(newTitle)}`;
		
		const oldPath = path.join(STORAGE_BASE_PATH, 'categories', oldCategoryFolder);
		const newPath = path.join(STORAGE_BASE_PATH, 'categories', newCategoryFolder);
		
		// Check if old folder exists
		try {
			await fs.access(oldPath);
		} catch (error) {
			// Old folder doesn't exist, nothing to rename
			return true;
		}
		
		// Rename the folder
		await fs.rename(oldPath, newPath);
		
		return true;
	} catch (error) {
		console.error('Error renaming category folder:', error);
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to rename category folder');
	}
}