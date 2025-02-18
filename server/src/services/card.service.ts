import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma-client';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';
import { UploadMediaTypes } from '../types';
import { createImageMetadata, updateImageMetadata } from './imageMetadata.service';

// Types derived from Prisma schema
interface CreateCardInput {
    title: string;
    description: string;
    genre: string;
    order?: number;
    expiration?: Date;
    isAvailable?: boolean;
    isHot?: boolean;
    isPreview?: boolean;
    userId: string;
    categoryId: string;
}

type UpdateCardInput = Partial<
    Omit<
        Prisma.CardUpdateInput,
        'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'image' | 'imageMetadata' | 'category' | 'createdBy'
    >
>;

export async function createCard(data: CreateCardInput, imageBuffer: Buffer, fileName: string) {
    try {
        // Create image metadata and upload image
        const { imageMetadata, url } = await createImageMetadata(imageBuffer, fileName, {
            bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
            folder: UploadMediaTypes.UploadMediaFolders.CARDS
        });

        // If order is not provided, get the next available order
        if (!data.order) {
            data.order = await getNextCardOrder(data.categoryId);
        }

        // Create card with image metadata
        const card = await prisma.card.create({
            data: {
                title: data.title,
                description: data.description,
                genre: data.genre,
                order: data.order,
                expiration: data.expiration,
                isAvailable: data.isAvailable,
                isHot: data.isHot,
                isPreview: data.isPreview,
                image: url,
                imageMetadata: {
                    connect: {
                        id: imageMetadata.id
                    }
                },
                category: {
                    connect: {
                        id: data.categoryId
                    }
                },
                createdBy: {
                    connect: {
                        id: data.userId
                    }
                }
            },
            include: {
                imageMetadata: true,
                category: true
            }
        });

        return card;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to create card: ${error.message}`);
    }
}

export async function updateCard(
    id: string,
    data: UpdateCardInput,
    imageBuffer?: Buffer,
    fileName?: string
) {
    try {
        let imageMetadata;
        let imageUrl;

        // Update image if new one is provided
        if (imageBuffer && fileName) {
            const card = await prisma.card.findUnique({
                where: { id },
                include: { imageMetadata: true }
            });

            if (!card) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found');
            }

            if (card.imageMetadata) {
                // Update existing image metadata
                const { imageMetadata: newMetadata, url } = await updateImageMetadata(
                    card.imageMetadata.id,
                    imageBuffer,
                    fileName,
                    {
                        bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
                        folder: UploadMediaTypes.UploadMediaFolders.CARDS
                    }
                );
                imageMetadata = newMetadata;
                imageUrl = url;
            } else {
                // Create new image metadata
                const { imageMetadata: newMetadata, url } = await createImageMetadata(imageBuffer, fileName, {
                    bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
                    folder: UploadMediaTypes.UploadMediaFolders.CARDS
                });
                imageMetadata = newMetadata;
                imageUrl = url;
            }
        }

        // Update card
        const updateData: Prisma.CardUpdateInput = { ...data };
        if (imageUrl) {
            updateData.image = imageUrl;
        }
        if (imageMetadata) {
            updateData.imageMetadata = {
                connect: { id: imageMetadata.id }
            };
        }

        const card = await prisma.card.update({
            where: { id },
            data: updateData,
            include: {
                imageMetadata: true,
                category: true
            }
        });

        return card;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to update card: ${error.message}`);
    }
}

export async function getCard(id: string) {
    const card = await prisma.card.findUnique({
        where: { id },
        include: {
            imageMetadata: true,
            category: true
        }
    });

    if (!card) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found');
    }

    return card;
}

export async function listCards(params: {
    skip?: number;
    take?: number;
    orderBy?: Prisma.CardOrderByWithRelationInput;
    where?: Prisma.CardWhereInput;
}) {
    const { skip, take, orderBy, where } = params;

    const [total, cards] = await prisma.$transaction([
        prisma.card.count({ where }),
        prisma.card.findMany({
            skip,
            take,
            where,
            orderBy,
            include: {
                imageMetadata: true,
                category: true
            }
        })
    ]);

    return {
        total,
        cards
    };
}

export async function updateCardOrder(cardId: string, newOrder: number, categoryId: string) {
    try {
        // Get the card to be reordered
        const card = await prisma.card.findUnique({
            where: { id: cardId }
        });

        if (!card) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found');
        }

        // If moving to a higher order number (moving down the list)
        if (newOrder > card.order) {
            await prisma.$transaction([
                // Decrease order of cards between old and new position
                prisma.card.updateMany({
                    where: {
                        categoryId,
                        order: {
                            gt: card.order,
                            lte: newOrder
                        }
                    },
                    data: {
                        order: { decrement: 1 }
                    }
                }),
                // Update the moved card's order
                prisma.card.update({
                    where: { id: cardId },
                    data: { order: newOrder }
                })
            ]);
        }
        // If moving to a lower order number (moving up the list)
        else if (newOrder < card.order) {
            await prisma.$transaction([
                // Increase order of cards between new and old position
                prisma.card.updateMany({
                    where: {
                        categoryId,
                        order: {
                            gte: newOrder,
                            lt: card.order
                        }
                    },
                    data: {
                        order: { increment: 1 }
                    }
                }),
                // Update the moved card's order
                prisma.card.update({
                    where: { id: cardId },
                    data: { order: newOrder }
                })
            ]);
        }

        return true;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Failed to update card order: ${error.message}`
        );
    }
}

export async function reorderCards(orderedCardIds: string[], categoryId: string) {
    try {
        // Verify all cards exist and belong to the specified category
        const cards = await prisma.card.findMany({
            where: {
                id: { in: orderedCardIds },
                categoryId
            }
        });

        if (cards.length !== orderedCardIds.length) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Some card IDs are invalid or do not belong to the specified category');
        }

        // Update all cards in a transaction
        await prisma.$transaction(
            orderedCardIds.map((id, index) =>
                prisma.card.update({
                    where: { id },
                    data: { order: index + 1 }
                })
            )
        );

        return true;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to reorder cards: ${error.message}`);
    }
}

export async function getNextCardOrder(categoryId: string): Promise<number> {
    const lastCard = await prisma.card.findFirst({
        where: { categoryId },
        orderBy: { order: 'desc' }
    });

    return (lastCard?.order ?? 0) + 1;
}

export async function deleteCard(id: string) {
    try {
        const card = await prisma.card.findUnique({
            where: { id },
            include: {
                imageMetadata: true
            }
        });

        if (!card) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found');
        }

        // First, delete the associated image metadata if it exists
        if (card.imageMetadata) {
            await prisma.imageMetadata.delete({
                where: { id: card.imageMetadata.id }
            });
        }

        // Then delete the card
        await prisma.card.delete({
            where: { id }
        });

        return true;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to delete card: ${error.message}`);
    }
}