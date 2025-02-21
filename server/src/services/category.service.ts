import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma-client';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';
import { UploadMediaTypes } from '../types';
import { createImageMetadata, updateImageMetadata } from './imageMetadata.service';

// Types derived from Prisma schema
interface CreateCategoryInput {
	title: string;
	hasPreview?: boolean;
	isAvailable?: boolean;
	order: number;
	userId: string;
}

type UpdateCategoryInput = Partial<
	Omit<
		Prisma.CategoryUpdateInput,
		'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'image' | 'imageMetadata' | 'cards'
	>
>;

export async function createCategory(data: CreateCategoryInput, imageBuffer: Buffer, fileName: string) {
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
	data: UpdateCategoryInput,
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

export async function updateCategoryOrder(categoryId: string, newOrder: number) {
	try {
		// Get the category to be reordered
		const category = await prisma.category.findUnique({
			where: { id: categoryId }
		});

		if (!category) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
		}

		// Get all categories sorted by order
		// const categories = await prisma.category.findMany({
		//   orderBy: { order: 'asc' }
		// });

		// If moving to a higher order number (moving down the list)
		if (newOrder > category.order) {
			await prisma.$transaction([
				// Decrease order of categories between old and new position
				prisma.category.updateMany({
					where: {
						order: {
							gt: category.order,
							lte: newOrder
						}
					},
					data: {
						order: { decrement: 1 }
					}
				}),
				// Update the moved category's order
				prisma.category.update({
					where: { id: categoryId },
					data: { order: newOrder }
				})
			]);
		}
		// If moving to a lower order number (moving up the list)
		else if (newOrder < category.order) {
			await prisma.$transaction([
				// Increase order of categories between new and old position
				prisma.category.updateMany({
					where: {
						order: {
							gte: newOrder,
							lt: category.order
						}
					},
					data: {
						order: { increment: 1 }
					}
				}),
				// Update the moved category's order
				prisma.category.update({
					where: { id: categoryId },
					data: { order: newOrder }
				})
			]);
		}

		return true;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(
			StatusCodes.INTERNAL_SERVER_ERROR,
			`Failed to update category order: ${error.message}`
		);
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

		const updatedCategories = (await prisma.category.findMany())

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

		// First, delete the associated image metadata if it exists
		if (category.imageMetadata) {
			console.log(category.imageMetadata)
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
