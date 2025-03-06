import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma-client';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';
import { UploadMediaTypes } from '../types';
import { createImageMetadata, updateImageMetadata } from './imageMetadata.service';
import { CategoryTypes } from '../types';

export async function createCategory(data: CategoryTypes.CreateCategoryInput, imageBuffer: Buffer, fileName: string) {
	try {
		// Create image metadata and upload image
		const { imageMetadata, url } = await createImageMetadata(imageBuffer, fileName, {
			bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
			folder: UploadMediaTypes.UploadMediaFolders.CATEGORIES
		});

		// Create category with image metadata
		const category = await prisma.category.create({
			data: {
				title: data.title,
				hasPreview: data.hasPreview,
				isAvailable: data.isAvailable,
				previewTitle: data.previewTitle,
				hasSquareContent: data.hasSquareContent,
				order: data.order,
				image: url,
				imageMetadata: {
					connect: {
						id: imageMetadata.id
					}
				},
				createdBy: {
					connect: {
						id: data.userId
					}
				}
			},
			include: {
				imageMetadata: true
			}
		});

		return category;
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

			if (category.imageMetadata) {
				// Update existing image metadata
				const { imageMetadata: newMetadata, url } = await updateImageMetadata(
					category.imageMetadata.id,
					imageBuffer,
					fileName,
					{
						bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
						folder: UploadMediaTypes.UploadMediaFolders.CATEGORIES
					}
				);
				imageMetadata = newMetadata;
				imageUrl = url;
			} else {
				// Create new image metadata
				const { imageMetadata: newMetadata, url } = await createImageMetadata(imageBuffer, fileName, {
					bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
					folder: UploadMediaTypes.UploadMediaFolders.CATEGORIES
				});
				imageMetadata = newMetadata;
				imageUrl = url;
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
			imageMetadata: true
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
				imageMetadata: true
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
			}
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
				imageMetadata: true
			}
		});

		if (!category) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
		}

		// First delete the associated cards

		const cards = await prisma.card.findMany({
      where: { categoryId: id },
      include: {
        imageMetadata: true  // Include image metadata if cards have images
      }
    });

    // Delete each card and its associated image metadata
    for (const card of cards) {
      // Delete card's image metadata if it exists
      if (card.imageMetadata) {
        await prisma.imageMetadata.delete({
          where: { id: card.imageMetadata.id }
        });
      }
      
      // Delete the card
      await prisma.card.delete({
        where: { id: card.id }
      });
    }

		// First, delete the associated image metadata if it exists
		if (category.imageMetadata) {
			await prisma.imageMetadata.delete({
				where: { id: category.imageMetadata.id }
			});
		}

		// Then delete the category
		await prisma.category.delete({
			where: { id }
		});

		return true;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to delete category: ${error.message}`);
	}
}
