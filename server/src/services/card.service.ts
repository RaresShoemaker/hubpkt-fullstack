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
    isDiscover?: boolean;
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

interface CardFilterOptions {
    isAvailable?: boolean;
    isHot?: boolean;
    isDiscover?: boolean;
    isPreview?: boolean;
    categoryId?: string | string[];
    genre?: string | string[];
    expirationBefore?: Date;
    expirationAfter?: Date;
    searchTerm?: string;
    skip?: number;
    take?: number;
    orderBy?: 'title' | 'createdAt' | 'order' | 'expiration';
    sortDirection?: 'asc' | 'desc';
  }

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

/**
 * Fetch cards based on various filter criteria
 * @param options Filter options to apply
 * @returns Object containing total count and filtered cards
 */
export async function fetchFilteredCards(options: CardFilterOptions = {}) {
    try {
      const {
        isAvailable,
        isHot,
        isDiscover,
        isPreview,
        categoryId,
        genre,
        expirationBefore,
        expirationAfter,
        searchTerm,
        skip = 0,
        take = 20,
        orderBy = 'order',
        sortDirection = 'asc'
      } = options;
  
      // Build the where clause based on filters
      const where: Prisma.CardWhereInput = {
        deletedAt: null, // Exclude soft-deleted cards
      };
  
      // Apply boolean filters
      if (isAvailable !== undefined) {
        where.isAvailable = isAvailable;
      }
  
      if (isHot !== undefined) {
        where.isHot = isHot;
      }
  
      if (isDiscover !== undefined) {
        where.isDiscover = isDiscover;
      }
  
      if (isPreview !== undefined) {
        where.isPreview = isPreview;
      }
  
      // Apply category filter
      if (categoryId) {
        where.categoryId = Array.isArray(categoryId)
          ? { in: categoryId }
          : categoryId;
      }
  
      // Apply genre filter
      if (genre) {
        where.genre = Array.isArray(genre)
          ? { in: genre }
          : genre;
      }
  
      // Apply expiration date filters
      if (expirationBefore || expirationAfter) {
        where.expiration = {};
        
        if (expirationBefore) {
          where.expiration.lte = expirationBefore;
        }
        
        if (expirationAfter) {
          where.expiration.gte = expirationAfter;
        }
      }
  
      // Apply search term (across title, description, and alt text)
      if (searchTerm) {
        where.OR = [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        ];
      }
  
      // Build the order by clause
      const orderByClause: Prisma.CardOrderByWithRelationInput = {};
      
      switch (orderBy) {
        case 'title':
          orderByClause.title = sortDirection;
          break;
        case 'createdAt':
          orderByClause.createdAt = sortDirection;
          break;
        case 'expiration':
          orderByClause.expiration = sortDirection;
          break;
        case 'order':
        default:
          orderByClause.order = sortDirection;
          break;
      }
  
      // Execute query with count in a transaction
      const [total, cards] = await prisma.$transaction([
        prisma.card.count({ where }),
        prisma.card.findMany({
          where,
          orderBy: orderByClause,
          skip,
          take,
          include: {
            imageMetadata: true,
            category: true,
          },
        }),
      ]);
  
      return {
        total,
        cards,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to fetch filtered cards: ${error.message}`
      );
    }
  }
  
  /**
   * Fetch hot cards
   * @param options Additional filter options
   * @returns Object containing total count and hot cards
   */
  export async function fetchHotCards(options: Omit<CardFilterOptions, 'isHot'> = {}) {
    return fetchFilteredCards({
      ...options,
      isHot: true,
    });
  }
  
  /**
   * Fetch discover cards
   * @param options Additional filter options
   * @returns Object containing total count and discover cards
   */
  export async function fetchDiscoverCards(options: Omit<CardFilterOptions, 'isDiscover'> = {}) {
    return fetchFilteredCards({
      ...options,
      isDiscover: true,
    });
  }
  
  /**
   * Fetch available cards
   * @param options Additional filter options
   * @returns Object containing total count and available cards
   */
  export async function fetchAvailableCards(options: Omit<CardFilterOptions, 'isAvailable'> = {}) {
    return fetchFilteredCards({
      ...options,
      isAvailable: true,
    });
  }
  
  /**
   * Fetch cards by category
   * @param categoryId Category ID to filter by
   * @param options Additional filter options
   * @returns Object containing total count and category cards
   */
  export async function fetchCardsByCategory(
    categoryId: string,
    options: Omit<CardFilterOptions, 'categoryId'> = {}
  ) {
    return fetchFilteredCards({
      ...options,
      categoryId,
    });
  }
  
  /**
   * Fetch active cards (not expired and available)
   * @param options Additional filter options
   * @returns Object containing total count and active cards
   */
  export async function fetchActiveCards(options: Omit<CardFilterOptions, 'isAvailable' | 'expirationAfter'> = {}) {
    const now = new Date();
    
    return fetchFilteredCards({
      ...options,
      isAvailable: true,
      expirationAfter: now, // Only cards that haven't expired yet
    });
  }
  
  /**
   * Fetch cards with randomized results after first 20 items
   * @param options Filter options
   * @returns Object containing total count and filtered cards with randomized order after first 20
   */
  export async function fetchCardsWithRandomizedOrder(options: CardFilterOptions = {}) {
    try {
      // First fetch all matching cards (without pagination)
      const { where, orderByClause } = buildQueryParams(options);
      
      const [total, allCards] = await prisma.$transaction([
        prisma.card.count({ where }),
        prisma.card.findMany({
          where,
          orderBy: orderByClause,
          include: {
            imageMetadata: true,
            category: true,
          },
        }),
      ]);
  
      // If we have more than 20 items, keep first 20 in order and randomize the rest
      if (allCards.length > 20) {
        const firstTwenty = allCards.slice(0, 20);
        const remaining = allCards.slice(20);
        
        // Randomize the remaining items using Fisher-Yates shuffle
        for (let i = remaining.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }
  
        // Combine ordered and randomized portions and apply pagination
        const combinedResults = [...firstTwenty, ...remaining];
        const paginatedResults = combinedResults.slice(
          options.skip || 0, 
          (options.skip || 0) + (options.take || 20)
        );
  
        return {
          total,
          cards: paginatedResults,
        };
      }
      
      // Otherwise, apply pagination to the results
      const paginatedCards = allCards.slice(
        options.skip || 0,
        (options.skip || 0) + (options.take || 20)
      );
  
      return {
        total,
        cards: paginatedCards,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to fetch cards with randomized order: ${error.message}`
      );
    }
  }
  
  // Helper function to build query parameters
  function buildQueryParams(options: CardFilterOptions) {
    const {
      isAvailable,
      isHot,
      isDiscover,
      isPreview,
      categoryId,
      genre,
      expirationBefore,
      expirationAfter,
      searchTerm,
      orderBy = 'order',
      sortDirection = 'asc'
    } = options;
  
    // Build the where clause
    const where: Prisma.CardWhereInput = {
      deletedAt: null,
    };
  
    // Apply boolean filters
    if (isAvailable !== undefined) where.isAvailable = isAvailable;
    if (isHot !== undefined) where.isHot = isHot;
    if (isDiscover !== undefined) where.isDiscover = isDiscover;
    if (isPreview !== undefined) where.isPreview = isPreview;
  
    // Apply category filter
    if (categoryId) {
      where.categoryId = Array.isArray(categoryId) ? { in: categoryId } : categoryId;
    }
  
    // Apply genre filter
    if (genre) {
      where.genre = Array.isArray(genre) ? { in: genre } : genre;
    }
  
    // Apply expiration date filters
    if (expirationBefore || expirationAfter) {
      where.expiration = {};
      if (expirationBefore) where.expiration.lte = expirationBefore;
      if (expirationAfter) where.expiration.gte = expirationAfter;
    }
  
    // Apply search term
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
  
    // Build the order by clause
    const orderByClause: Prisma.CardOrderByWithRelationInput = {};
    
    switch (orderBy) {
      case 'title': orderByClause.title = sortDirection; break;
      case 'createdAt': orderByClause.createdAt = sortDirection; break;
      case 'expiration': orderByClause.expiration = sortDirection; break;
      case 'order': 
      default: orderByClause.order = sortDirection; break;
    }
  
    return { where, orderByClause };
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