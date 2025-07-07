import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma-client';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';
import { CategoryTypes } from '../types';
import { uploadFile, deleteFile, deleteCategoryFolder, renameCategoryFolder, FileUploadType } from './uploadMedia.service';
import sharp from 'sharp';
import path from 'path';

export async function createCategory(data: CategoryTypes.CreateCategoryInput, imageBuffer: Buffer, fileName: string) {
	try {
		// Create category first to get the ID for folder structure
		const category = await prisma.category.create({
			data: {
				title: data.title,
				hasPreview: data.hasPreview,
				isAvailable: data.isAvailable,
				previewTitle: data.previewTitle,
				hasSquareContent: data.hasSquareContent,
				order: data.order,
				image: '', // Will update after image upload
				createdBy: {
					connect: {
						id: data.userId
					}
				}
			}
		});

		try {
			// Determine file type and processing method
			const fileExtension = path.extname(fileName).toLowerCase();
			const isSvg = fileExtension === '.svg';
			
			let processedBuffer: Buffer;
			let finalContentType: string;
			let imageMetadata: any = {};

			if (isSvg) {
				// For SVG files, don't process with Sharp
				processedBuffer = imageBuffer;
				finalContentType = 'image/svg+xml';
				
				// SVG files don't have fixed dimensions
				imageMetadata = {
					width: 0,
					height: 0
				};
			} else {
				// For other image types, process with Sharp
				processedBuffer = await sharp(imageBuffer)
					.resize(300, 300, { fit: 'cover', withoutEnlargement: true })
					.jpeg({ quality: 85 })
					.toBuffer();
				
				finalContentType = 'image/jpeg';
				
				// Get processed image metadata
				imageMetadata = await sharp(processedBuffer).metadata();
			}

			// Upload to filesystem with category-specific folder structure
			const uploadResult = await uploadFile(
				processedBuffer,
				fileName,
				finalContentType,
				{
					categoryId: category.id,
					uploadType: FileUploadType.CATEGORY_ICON
				},
				category.title
			);

			// Create image metadata record with correct MIME type
			const imageMetadataRecord = await prisma.imageMetadata.create({
				data: {
					width: imageMetadata.width || 0,
					height: imageMetadata.height || 0,
					size: uploadResult.fileSize,
					mimeType: finalContentType,
					url: uploadResult.url,
					filePath: uploadResult.filePath,
					fileName: fileName
				}
			});

			// Update category with image URL and metadata
			const updatedCategory = await prisma.category.update({
				where: { id: category.id },
				data: {
					image: uploadResult.url,
					imageMetadata: {
						connect: {
							id: imageMetadataRecord.id
						}
					}
				},
				include: {
					imageMetadata: true
				}
			});

			return updatedCategory;
		} catch (error) {
			// If image upload fails, delete the created category
			await prisma.category.delete({ where: { id: category.id } });
			console.error('Error processing category icon:', error);
			throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to process category icon');
		}
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to create category: ${error.message}`);
	}
}

export async function updateCategory(
	id: string,
	data: CategoryTypes.UpdateCategoryInput,
	imageBuffer?: Buffer,
	fileName?: string
) {
	try {
		let imageMetadata;
		let imageUrl;

		// Update image if new one is provided
		if (imageBuffer && fileName) {
			const category = await prisma.category.findUnique({
				where: { id },
				include: { imageMetadata: true }
			});

			if (!category) {
				throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
			}

			// Delete old image if exists
			if (category.imageMetadata) {
				await deleteFile(category.imageMetadata.filePath);
				await prisma.imageMetadata.delete({
					where: { id: category.imageMetadata.id }
				});
			}

			// Determine file type and processing method
			const fileExtension = path.extname(fileName).toLowerCase();
			const isSvg = fileExtension === '.svg';
			
			let processedBuffer: Buffer;
			let finalContentType: string;
			let imageMetadataInfo: any = {};

			if (isSvg) {
				// For SVG files, don't process with Sharp
				processedBuffer = imageBuffer;
				finalContentType = 'image/svg+xml';
				
				// SVG files don't have fixed dimensions
				imageMetadataInfo = {
					width: 0,
					height: 0
				};
			} else {
				// For other image types, process with Sharp
				processedBuffer = await sharp(imageBuffer)
					.resize(300, 300, { fit: 'cover', withoutEnlargement: true })
					.jpeg({ quality: 85 })
					.toBuffer();
				
				finalContentType = 'image/jpeg';
				
				// Get processed image metadata
				imageMetadataInfo = await sharp(processedBuffer).metadata();
			}

			// Extract the new title as a string for folder operations
			const newTitle = typeof data.title === 'string' ? data.title : category.title;

			// Upload new image with updated category structure
			const uploadResult = await uploadFile(
				processedBuffer,
				fileName,
				finalContentType,
				{
					categoryId: id,
					uploadType: FileUploadType.CATEGORY_ICON
				},
				newTitle
			);

			// Create new image metadata with correct MIME type
			imageMetadata = await prisma.imageMetadata.create({
				data: {
					width: imageMetadataInfo.width || 0,
					height: imageMetadataInfo.height || 0,
					size: uploadResult.fileSize,
					mimeType: finalContentType,
					url: uploadResult.url,
					filePath: uploadResult.filePath,
					fileName: fileName
				}
			});

			imageUrl = uploadResult.url;

			// Rename category folder if title changed
			if (data.title && typeof data.title === 'string' && data.title !== category.title) {
				try {
					await renameCategoryFolder(id, category.title, data.title);
				} catch (error) {
					console.warn('Failed to rename category folder:', error);
					// Continue with update even if folder rename fails
				}
			}
		}

		// Update category
		const updateData: Prisma.CategoryUpdateInput = { ...data };
		if (imageUrl) {
			updateData.image = imageUrl;
		}
		if (imageMetadata) {
			updateData.imageMetadata = {
				connect: { id: imageMetadata.id }
			};
		}

		const category = await prisma.category.update({
			where: { id },
			data: updateData,
			include: {
				imageMetadata: true
			}
		});

		return category;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to update category: ${error.message}`);
	}
}

export async function getCategory(id: string) {
	const category = await prisma.category.findUnique({
		where: { id },
		include: {
			imageMetadata: true,
		}
	});

	if (!category) {
		throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
	}

	return category;
}

export async function listCategories(params: {
	skip?: number;
	take?: number;
	orderBy?: Prisma.CategoryOrderByWithRelationInput;
	where?: Prisma.CategoryWhereInput;
}) {
	const { skip, take, orderBy, where } = params;

	const [total, categories] = await prisma.$transaction([
		prisma.category.count({ where }),
		prisma.category.findMany({
			skip,
			take,
			where,
			orderBy,
			include: {
				imageMetadata: true,
			}
		})
	]);

	return {
		total,
		categories
	};
}

export const fetchClientCategories = async () => {
	try {
		const categories = await prisma.category.findMany({
			where: {
				isAvailable: true
			},
			orderBy: {
				order: 'asc'
			},
			omit: {
				createdAt: true,
				userId: true,
				updatedAt: true,
				imageMetadataId: true
			},
		});
		return categories;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to fetch categories: ${error.message}`);
	}
}

export async function reorderCategories(orderedCategoryIds: string[]) {
	try {
		// Verify all categories exist
		const categories = await prisma.category.findMany({
			where: {
				id: { in: orderedCategoryIds }
			}
		});

		if (categories.length !== orderedCategoryIds.length) {
			throw new ApiError(StatusCodes.BAD_REQUEST, 'Some category IDs are invalid');
		}

		// Update all categories in a transaction
		await prisma.$transaction(
			orderedCategoryIds.map((id, index) =>
				prisma.category.update({
					where: { id },
					data: { order: index + 1 }
				})
			)
		);

		const updatedCategories = (await prisma.category.findMany({
			where: {
				id: { in: orderedCategoryIds }
			},
			orderBy: { order: 'asc' }
		}))

		return updatedCategories;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to reorder categories: ${error.message}`);
	}
}

export async function getNextCategoryOrder(): Promise<number> {
	const lastCategory = await prisma.category.findFirst({
		orderBy: { order: 'desc' }
	});

	return (lastCategory?.order ?? 0) + 1;
}

export async function deleteCategory(id: string) {
	try {
		const category = await prisma.category.findUnique({
			where: { id },
			include: {
				imageMetadata: true,
				cards: {
					include: { imageMetadata: true }
				},
				designElements: {
					include: { imageMetadata: true }
				}
			}
		});

		if (!category) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
		}

		// Start a transaction to ensure all related deletions are atomic
		await prisma.$transaction(async (prismaClient) => {
			// Delete all associated cards and their image metadata
			for (const card of category.cards) {
				if (card.imageMetadata) {
					await deleteFile(card.imageMetadata.filePath);
					await prismaClient.imageMetadata.delete({
						where: { id: card.imageMetadata.id }
					});
				}
				await prismaClient.card.delete({
					where: { id: card.id }
				});
			}

			// Delete all design elements and their image metadata
			for (const designElement of category.designElements) {
				if (designElement.imageMetadata) {
					await deleteFile(designElement.imageMetadata.filePath);
					await prismaClient.imageMetadata.delete({
						where: { id: designElement.imageMetadata.id }
					});
				}
				// Delete associated HTML elements
				await prismaClient.htmlElement.deleteMany({
					where: { designElementId: designElement.id }
				});
				await prismaClient.designElement.delete({
					where: { id: designElement.id }
				});
			}
			
			// Delete the category's image metadata if it exists
			if (category.imageMetadata) {
				await deleteFile(category.imageMetadata.filePath);
				await prismaClient.imageMetadata.delete({
					where: { id: category.imageMetadata.id }
				});
			}
			
			// Finally delete the category
			await prismaClient.category.delete({
				where: { id }
			});
		});

		// Delete entire category folder from filesystem
		try {
			await deleteCategoryFolder(id, category.title);
		} catch (error) {
			console.warn('Failed to delete category folder:', error);
			// Continue even if folder deletion fails
		}

		return true;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to delete category: ${error.message}`);
	}
}