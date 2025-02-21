import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/s3Client';
import { UploadMediaTypes } from '../types';
import { config } from '../config/environment';
import ApiError from '../utils/ApiError';
import { StatusCodes } from 'http-status-codes';

// Your R2 public URL from Cloudflare dashboard
const R2_PUBLIC_URL = config.R2_PUBLIC_URL;

if (!R2_PUBLIC_URL) {
	throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Missing R2_PUBLIC_URL environment variable');
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

export async function uploadFile(
	buffer: Buffer,
	fileName: string,
	contentType: string,
	storage: UploadMediaTypes.StorageMedia
): Promise<{ key: string; url: string }> {
	try {
		const sanitizedFileName = sanitizeFileName(fileName);
		// Create a unique key including the bucket path
		const key = `${storage.folder}/${Date.now()}-${sanitizedFileName}`;

		const uploadParams = {
			Bucket: storage.bucketName,
			Key: key,
			Body: buffer,
			ContentType: contentType
		};

		if (contentType.includes('svg')) {
			Object.assign(uploadParams, {
				ContentDisposition: 'inline', // This prevents download prompt
				ContentType: 'image/svg+xml' // Ensure proper content type for SVGs
			});
		}

		const uploadCommand = new PutObjectCommand(uploadParams);
		await s3Client.send(uploadCommand);

		// Return both the key (for database storage) and the public URL
		return {
			key,
			url: `${R2_PUBLIC_URL}/${key}`
		};
	} catch (error) {
		console.error('Error uploading file:', error);
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to upload file');
	}
}

/**
 * Deletes a file from R2 storage
 */
export async function deleteFile(key: string, storage: UploadMediaTypes.StorageMedia): Promise<boolean> {
	try {
		const command = new DeleteObjectCommand({
			Bucket: storage.bucketName,
			Key: key
		});

		await s3Client.send(command);
		return true;
	} catch (error) {
		console.error('Error deleting file:', error);
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to delete file');
	}
}

export function getPublicUrl(key: string): string {
	return `${R2_PUBLIC_URL}/${key}`;
}

export async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
	const chunks: Buffer[] = [];

	for await (const chunk of stream) {
		chunks.push(Buffer.from(chunk));
	}

	return Buffer.concat(chunks);
}
