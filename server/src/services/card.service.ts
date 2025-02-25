import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma-client';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';
import { CardTypes, UploadMediaTypes } from '../types';
import { ImageMetadataServices } from './index';

export const getNextCardOrder = async (categoryId: string): Promise<number> => {
	const lastCard = await prisma.card.findFirst({
		where: { categoryId },
		orderBy: { order: 'desc' }
	});

	return (lastCard?.order ?? 0) + 1;
};

export const createCard = async (data: CardTypes.CreateCardInput, imageBuffer: Buffer, filename: string) => {
	try {
		const { imageMetadata, url } = await ImageMetadataServices.createImageMetadata(imageBuffer, filename, {
			bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
			folder: UploadMediaTypes.UploadMediaFolders.CARDS
		});

		if (!data.order) {
			data.order = await getNextCardOrder(data.categoryId);
		}

		const card = await prisma.card.create({
			data: {
				title: data.title,
				description: data.description,
				genre: data.genre,
				order: data.order,
				expiration: data.expiration,
				isAvailable: data.isAvailable,
				isHot: data.isHot,
				isDiscover: data.isDiscover,
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
};

export const updateCard = async (
	id: string,
	data: CardTypes.UpdateCardInput,
	imageBuffer?: Buffer,
	filename?: string
) => {
	try {
		let imageMetadata;
		let imageUrl;

		if (imageBuffer && filename) {
			const card = await prisma.card.findUnique({
				where: { id },
				include: { imageMetadata: true }
			});

			if (!card) {
				throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found');
			}

			if (card.imageMetadata) {
				const { imageMetadata: newMetadata, url } = await ImageMetadataServices.updateImageMetadata(
					card.imageMetadata.id,
					imageBuffer,
					filename,
					{
						bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
						folder: UploadMediaTypes.UploadMediaFolders.CARDS
					}
				);
				imageMetadata = newMetadata;
				imageUrl = url;
			} else {
				const { imageMetadata: newMetadata, url } = await ImageMetadataServices.createImageMetadata(
					imageBuffer,
					filename,
					{
						bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
						folder: UploadMediaTypes.UploadMediaFolders.CARDS
					}
				);
				imageMetadata = newMetadata;
				imageUrl = url;
			}
		}

		const newCardData: Prisma.CardUpdateInput = { ...data };

		if (imageUrl) {
			newCardData.image = imageUrl;
		}

		if (imageMetadata) {
			newCardData.imageMetadata = {
				connect: { id: imageMetadata.id }
			};
		}

		const card = await prisma.card.update({
			where: { id },
			data: newCardData,
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
};

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

		await prisma.card.delete({
			where: { id }
		});

		return true;
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to delete card: ${error.message}`);
	}
}

export const getCardById = async (id: string) => {
	try {
		const card = prisma.card.findUnique({
			where: {
				id: id
			}
		});

		if (!card) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found');
		}

		return {
			message: 'success',
			data: card
		};
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to get card: ${error.message}`);
	}
};

export const updateCardOrder = async (cardId: string, newOrder: number, categoryId: string) => {
	try {
		const card = await prisma.card.findUnique({
			where: { id: cardId }
		});

		if (!card) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Card not found');
		}

		let affectedCards: { id: string; previousOrder: number; newOrder: number; }[] = [];


		if (newOrder > card.order) {

			const cardsToShift = await prisma.card.findMany({
				where: {
					categoryId,
					order: {
						gt: card.order,
						lte: newOrder
					}
				},
				select: {
					id: true,
					order: true
				}
			});

			affectedCards = cardsToShift.map(c => {
				return {
					id: c.id,
					previousOrder: c.order,
					newOrder: c.order - 1
				}
			});

			await prisma.$transaction([
				prisma.card.updateMany({
					where: {
						categoryId,
						order: {
							gt: card.order,
							lte: newOrder
						}
					},
					data: {
						order: {
							increment: 1
						}
					}
				}),
				prisma.card.update({
					where: {
						id: cardId
					},
					data: {
						order: newOrder
					}
				})
			]);
		}

		if (newOrder < card.order) {

			const cardsToShift = await prisma.card.findMany({
				where: {
					categoryId,
					order: {
						gte: newOrder,
						lt: card.order
					}
				},
				select: { id: true, order: true }
			});

			affectedCards = cardsToShift.map(c => ({ 
				id: c.id, 
				previousOrder: c.order, 
				newOrder: c.order + 1 
			}));

			await prisma.$transaction([
				prisma.card.updateMany({
					where: {
						categoryId,
						order: {
							gte: newOrder,
							lt: card.order
						}
					},
					data: {
						order: {
							increment: 1
						}
					}
				}),
				prisma.card.update({
					where: {
						id: cardId
					},
					data: {
						order: newOrder
					}
				})
			]);
		}

		const updatedCard = await prisma.card.findUnique({
			where: { id: cardId }
		});

		if (!updatedCard) {
			throw new ApiError(StatusCodes.NOT_FOUND, 'Newly updated card not found');
		}

		return {
			success: true,
			data: updatedCard,
			previousPosition: card.order,
			newPosition: updatedCard.order,
			affectedCards: affectedCards,
			categoryId: categoryId,
			orderChanges: {
				type: newOrder > card.order ? 'moveDown' : 'moveUp',
				range: {
					start: Math.min(card.order, newOrder),
					end: Math.max(card.order, newOrder)
				}
			}
		};
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to update card order: ${error.message}`);
	}
};

export const reorderCards = async (categoryId: string, newCardsOrder: string[]) => {
	try {
		const cards = await prisma.card.findMany({
			where: {
				categoryId,
				id: { in: newCardsOrder }
			}
		});

		if (cards.length !== newCardsOrder.length) {
			throw new ApiError(
				StatusCodes.BAD_REQUEST,
				'Some card IDs are invalid or do not belong to the specified category'
			);
		}

		await prisma.$transaction(
			newCardsOrder.map((cardId, index) => {
				return prisma.card.update({
					where: {
						id: cardId
					},
					data: {
						order: index + 1
					}
				});
			})
		);
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to reorder cards: ${error.message}`);
	}
};

import { randomInt } from 'crypto';

//This function is handling the reorder of the first 20 cards.
export const reorderFirstCards = async (categoryId: string, newCardsOrder: string[]) => {
    try {
        const allCards = await prisma.card.findMany({
            where: { categoryId },
            orderBy: { order: 'asc' }
        });

        const first20Cards = allCards.slice(0, 20);
        const remainingCards = allCards.slice(20);

        if (first20Cards.length !== newCardsOrder.length) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                'Some card IDs are invalid or do not belong to the specified category'
            );
        }

        await prisma.$transaction([
            ...newCardsOrder.map((cardId, index) => {
                return prisma.card.update({
                    where: { id: cardId },
                    data: { order: index + 1 }
                });
            }),
            ...remainingCards.map(card => {
                return prisma.card.update({
                    where: { id: card.id },
                    data: { order: randomInt(21, allCards.length + 1) }
                });
            })
        ]);

        // Ensure no conflicts by reordering any cards that might have been assigned an order within the first 20
        const updatedRemainingCards = await prisma.card.findMany({
            where: {
                categoryId,
                order: { gte: 21 }
            },
            orderBy: { order: 'asc' }
        });

        await prisma.$transaction(
            updatedRemainingCards.map((card, index) => {
                return prisma.card.update({
                    where: { id: card.id },
                    data: { order: 21 + index }
                });
            })
        );
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to reorder cards: ${error.message}`);
    }
};
