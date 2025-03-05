import { Prisma } from '@prisma/client';
import { prisma } from '../db/prisma-client';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';
import { CardTypes } from '@/types';

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
export async function fetchFilteredCards(options: CardTypes.CardFilterOptions = {}) {
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
			deletedAt: null // Exclude soft-deleted cards
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
			where.categoryId = Array.isArray(categoryId) ? { in: categoryId } : categoryId;
		}

		// Apply genre filter
		if (genre) {
			where.genre = Array.isArray(genre) ? { in: genre } : genre;
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
						mode: 'insensitive'
					}
				},
				{
					description: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
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
					category: true
				}
			})
		]);

		return {
			total,
			cards
		};
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to fetch filtered cards: ${error.message}`);
	}
}

/**
 * Fetch hot cards
 * @param options Additional filter options
 * @returns Object containing total count and hot cards
 */
export async function fetchHotCards(options: Omit<CardTypes.CardFilterOptions, 'isHot'> = {}) {
	return fetchFilteredCards({
		...options,
		isHot: true
	});
}

/**
 * Fetch discover cards
 * @param options Additional filter options
 * @returns Object containing total count and discover cards
 */
export async function fetchDiscoverCards(options: Omit<CardTypes.CardFilterOptions, 'isDiscover'> = {}) {
	return fetchFilteredCards({
		...options,
		isDiscover: true
	});
}

/**
 * Fetch available cards
 * @param options Additional filter options
 * @returns Object containing total count and available cards
 */
export async function fetchAvailableCards(options: Omit<CardTypes.CardFilterOptions, 'isAvailable'> = {}) {
	return fetchFilteredCards({
		...options,
		isAvailable: true
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
	options: Omit<CardTypes.CardFilterOptions, 'categoryId'> = {}
) {
	return fetchFilteredCards({
		...options,
		categoryId
	});
}

/**
 * Fetch active cards (not expired and available)
 * @param options Additional filter options
 * @returns Object containing total count and active cards
 */
export async function fetchActiveCards(
	options: Omit<CardTypes.CardFilterOptions, 'isAvailable' | 'expirationAfter'> = {}
) {
	const now = new Date();

	return fetchFilteredCards({
		...options,
		isAvailable: true,
		expirationAfter: now // Only cards that haven't expired yet
	});
}

/**
 * Fetch cards with randomized results after first 20 items
 * @param options Filter options
 * @returns Object containing total count and filtered cards with randomized order after first 20
 */
export async function fetchCardsWithRandomizedOrder(options: CardTypes.CardFilterOptions = {}) {
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
					category: true
				}
			})
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
				cards: paginatedResults
			};
		}

		// Otherwise, apply pagination to the results
		const paginatedCards = allCards.slice(options.skip || 0, (options.skip || 0) + (options.take || 20));

		return {
			total,
			cards: paginatedCards
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
function buildQueryParams(options: CardTypes.CardFilterOptions) {
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
		deletedAt: null
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
			{ description: { contains: searchTerm, mode: 'insensitive' } }
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

	return { where, orderByClause };
}


export const getCardsPreviewHomepage = async () => {
  try {    
    const categories = await prisma.category.findMany({
      where: {
        isAvailable: true,
        hasPreview: true,
      },
      orderBy: {
        order: 'asc'
      }
    });

    const cards = await Promise.all(categories.map(async ({id, title, previewTitle, hasSquareContent}) => {
      const currentTime = new Date();

      const cards = await prisma.card.findMany({
        where: {
          categoryId: id,
          isPreview: true,
          isAvailable: true,
          deletedAt: null,
					OR: [
            { expiration: { gt: currentTime } },
            { expiration: null }
          ]
        },
        orderBy: {
          order: 'asc'
        },
      });

      return {
        categoryTitle: title,
        previewTitle: previewTitle,
        categoryId: id,
        hasSquareContent, // Consistent naming
        cards
      };
    }));

    const cardsByCategory = cards.reduce((acc: Record<string, any>, item) => {
      acc[item.categoryTitle.toLowerCase()] = {
        categoryId: item.categoryId,
        previewTitle: item.previewTitle === '' ? item.categoryTitle : item.previewTitle,
        hasSquareContent: item.hasSquareContent, // Now properly referenced
        data: item.cards,
      };
      return acc;
    }, {} as Record<string, any>);

    const [hotCards, discoverCards] = await Promise.all([
      prisma.card.findMany({
        where: {
          isHot: true,
          isAvailable: true,
          deletedAt: null,
          OR: [
            { expiration: { gt: new Date() } },
            { expiration: null }
          ]
        },
				orderBy:{ 
					id: Math.random() > 0.5 ? 'asc' : 'desc'
				},
				omit: {
					order: true
				}
        // Removed the invalid "omit" option
      }),
      prisma.card.findMany({
        where: {
          isDiscover: true,
          isAvailable: true,
          deletedAt: null,
          OR: [
            { expiration: { gt: new Date() } },
            { expiration: null }
          ],
        },
				orderBy:{ 
					id: Math.random() > 0.5 ? 'asc' : 'desc'
				},
				omit: {
					order: true
				}
        // Removed the invalid "omit" option
      })
    ]);

    return {
			hot: {
        categoryId: '',
        previewTitle: "What's Hot",
        data: hotCards
      }, 
      discover: {
        categoryId: '',
        previewTitle: "Discover",
        data: discoverCards
      },
      ...cardsByCategory, 
    };
      
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to fetch cards preview homepage: ${error.message}`);
  }
};
