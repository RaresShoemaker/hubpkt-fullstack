import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CardService, CardServiceFetch } from '../services/index';
import { CardTypes } from '@/types';
import catchAsync from '../utils/catchAsync';

// Helper function to convert string boolean values to actual booleans
const convertBooleanFields = (data: any) => {
    // List of fields that should be boolean type
    const booleanFields = ['isAvailable', 'isHot', 'isDiscover', 'isPreview', 'isSquare'];
    
    // Create a new object with converted boolean values
    const result = { ...data };
    
    // Convert each boolean field if it exists
    booleanFields.forEach(field => {
        if (field in result) {
            // Convert 'true'/'false' strings to actual boolean values
            if (result[field] === 'true') {
                result[field] = true;
            } else if (result[field] === 'false') {
                result[field] = false;
            }
            // If it's already a boolean, no need to convert
        }
    });
    
    return result;
};

// Helper function to validate orderBy parameter
const validateOrderBy = (orderBy?: string): 'title' | 'createdAt' | 'order' | 'expiration' | undefined => {
    if (!orderBy) return undefined;
    
    const validValues: Array<'title' | 'createdAt' | 'order' | 'expiration'> = ['title', 'createdAt', 'order', 'expiration'];
    return validValues.includes(orderBy as any) 
        ? (orderBy as 'title' | 'createdAt' | 'order' | 'expiration') 
        : 'order'; // Default to 'order' if invalid value provided
};

export const createCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const imageFile = req.file;

        if (!imageFile) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Image file is required'
            });
            return;
        }

        // Convert string boolean values to actual booleans
        const convertedData = convertBooleanFields(req.body);

        const card = await CardService.createCard(
            {
                ...convertedData,
                userId: req.user?.userId
            },
            imageFile.buffer,
            imageFile.originalname
        );

        res.status(StatusCodes.CREATED).json(card);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to create card'
            });
        }
    }
};

export const updateCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const imageFile = req.file;

        // Convert string boolean values to actual booleans
        const convertedData = convertBooleanFields(req.body);

        const card = await CardService.updateCard(
            id,
            convertedData,
            imageFile?.buffer,
            imageFile?.originalname
        );

        res.status(StatusCodes.OK).json(card);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to update card'
            });
        }
    }
};

// The rest of the controller functions remain unchanged
export const getCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const card = await CardService.getCardById(id);
        res.status(StatusCodes.OK).json(card);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to get card'
            });
        }
    }
};


export const listCards = async (req: Request, res: Response): Promise<void> => {
    try {
        const { skip, take, orderBy, ...filters } = req.query;

        const result = await CardServiceFetch.listCards({
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            orderBy: orderBy ? JSON.parse(orderBy as string) : undefined,
            where: filters
        });

        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to list cards'
            });
        }
    }
};

export const updateCardOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { order, categoryId } = req.body;

        if (typeof order !== 'number' || !categoryId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Order must be a number and categoryId is required'
            });
            return;
        }

        const result = await CardService.updateCardOrder(id, order, categoryId);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to update card order'
            });
        }
    }
};

export const reorderCards = async (req: Request, res: Response): Promise<void> => {
    try {
        const { orderedCardIds, categoryId } = req.body;

        if (!Array.isArray(orderedCardIds) || !categoryId) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Ordered card IDs must be an array and categoryId is required'
            });
            return;
        }

        await CardService.reorderCards(categoryId, orderedCardIds);
        res.status(StatusCodes.OK).json({ success: true });
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to reorder cards'
            });
        }
    }
};

export const deleteCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await CardService.deleteCard(id);
        res.status(StatusCodes.OK).json({ success: true });
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to delete card'
            });
        }
    }
};

export const getCardsHomepage = catchAsync(async (_req: Request, res: Response) => {
    const cards = await CardServiceFetch.getCardsPreviewHomepage();
    res.json({
        status: StatusCodes.OK,
        message: 'Cards retrieved successfully',
        data: cards
    })
});

// New controller methods for filtered card fetching

/**
 * Get filtered cards based on various criteria
 */
export const getFilteredCards = async (req: Request, res: Response): Promise<void> => {
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
            skip,
            take,
            orderBy,
            sortDirection
        } = req.query;

        const options: CardTypes.CardFilterOptions = {
            isAvailable: isAvailable === 'true' ? true : isAvailable === 'false' ? false : undefined,
            isHot: isHot === 'true' ? true : isHot === 'false' ? false : undefined,
            isDiscover: isDiscover === 'true' ? true : isDiscover === 'false' ? false : undefined,
            isPreview: isPreview === 'true' ? true : isPreview === 'false' ? false : undefined,
            categoryId: categoryId ? (
                Array.isArray(categoryId) 
                    ? (categoryId as string[])
                    : [categoryId as string]
            ) : undefined,
            genre: genre ? (
                Array.isArray(genre)
                    ? (genre as string[])
                    : [genre as string]
            ) : undefined,
            expirationBefore: expirationBefore ? new Date(expirationBefore as string) : undefined,
            expirationAfter: expirationAfter ? new Date(expirationAfter as string) : undefined,
            searchTerm: searchTerm as string,
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            orderBy: orderBy as 'title' | 'createdAt' | 'order' | 'expiration',
            sortDirection: (sortDirection as 'asc' | 'desc') || 'asc'
        };

        const result = await CardServiceFetch.fetchFilteredCards(options);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to get filtered cards'
            });
        }
    }
};

/**
 * Get hot cards with optional additional filters
 */
export const getHotCards = async (req: Request, res: Response): Promise<void> => {
    try {
        // Extract all query parameters except isHot since we're setting it manually
        const {
            categoryId,
            genre,
            expirationBefore,
            expirationAfter,
            searchTerm,
            skip,
            take,
            orderBy,
            sortDirection
        } = req.query;

        const options: Omit<CardTypes.CardFilterOptions, 'isHot'> = {
            categoryId: categoryId ? (
                Array.isArray(categoryId) 
                    ? (categoryId as string[])
                    : [categoryId as string]
            ) : undefined,
            genre: genre ? (
                Array.isArray(genre)
                    ? (genre as string[])
                    : [genre as string]
            ) : undefined,
            expirationBefore: expirationBefore ? new Date(expirationBefore as string) : undefined,
            expirationAfter: expirationAfter ? new Date(expirationAfter as string) : undefined,
            searchTerm: searchTerm as string,
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            orderBy: validateOrderBy(orderBy as string),
            sortDirection: (sortDirection as 'asc' | 'desc') || 'asc'
        };

        const result = await CardServiceFetch.fetchHotCards(options);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to get hot cards'
            });
        }
    }
};

/**
 * Get discover cards with optional additional filters
 */
export const getDiscoverCards = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            categoryId,
            genre,
            expirationBefore,
            expirationAfter,
            searchTerm,
            skip,
            take,
            orderBy,
            sortDirection
        } = req.query;

        const options: Omit<CardTypes.CardFilterOptions, 'isDiscover'> = {
            categoryId: categoryId ? (
                Array.isArray(categoryId) 
                    ? (categoryId as string[])
                    : [categoryId as string]
            ) : undefined,
            genre: genre ? (
                Array.isArray(genre)
                    ? (genre as string[])
                    : [genre as string]
            ) : undefined,
            expirationBefore: expirationBefore ? new Date(expirationBefore as string) : undefined,
            expirationAfter: expirationAfter ? new Date(expirationAfter as string) : undefined,
            searchTerm: searchTerm as string,
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            orderBy: validateOrderBy(orderBy as string),
            sortDirection: (sortDirection as 'asc' | 'desc') || 'asc'
        };

        const result = await CardServiceFetch.fetchDiscoverCards(options);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to get discover cards'
            });
        }
    }
};

/**
 * Get available cards with optional additional filters
 */
export const getAvailableCards = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            categoryId,
            genre,
            expirationBefore,
            expirationAfter,
            searchTerm,
            skip,
            take,
            orderBy,
            sortDirection
        } = req.query;

        const options: Omit<CardTypes.CardFilterOptions, 'isAvailable'> = {
            categoryId: categoryId ? (
                Array.isArray(categoryId) 
                    ? (categoryId as string[])
                    : [categoryId as string]
            ) : undefined,
            genre: genre ? (
                Array.isArray(genre)
                    ? (genre as string[])
                    : [genre as string]
            ) : undefined,
            expirationBefore: expirationBefore ? new Date(expirationBefore as string) : undefined,
            expirationAfter: expirationAfter ? new Date(expirationAfter as string) : undefined,
            searchTerm: searchTerm as string,
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            orderBy: validateOrderBy(orderBy as string),
            sortDirection: (sortDirection as 'asc' | 'desc') || 'asc'
        };

        const result = await CardServiceFetch.fetchAvailableCards(options);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to get available cards'
            });
        }
    }
};

/**
 * Get cards by category with optional additional filters
 */
export const getCardsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { categoryId } = req.params;
        const {
            genre,
            expirationBefore,
            expirationAfter,
            searchTerm,
            skip,
            take,
            orderBy,
            sortDirection
        } = req.query;

        const options: Omit<CardTypes.CardFilterOptions, 'categoryId'> = {
            genre: genre ? (
                Array.isArray(genre)
                    ? (genre as string[])
                    : [genre as string]
            ) : undefined,
            expirationBefore: expirationBefore ? new Date(expirationBefore as string) : undefined,
            expirationAfter: expirationAfter ? new Date(expirationAfter as string) : undefined,
            searchTerm: searchTerm as string,
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            orderBy: validateOrderBy(orderBy as string),
            sortDirection: (sortDirection as 'asc' | 'desc') || 'asc'
        };

        const result = await CardServiceFetch.fetchCardsByCategory(categoryId, options);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to get cards by category'
            });
        }
    }
};

/**
 * Get active cards (available and not expired)
 */
export const getActiveCards = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            categoryId,
            genre,
            searchTerm,
            skip,
            take,
            orderBy,
            sortDirection
        } = req.query;

        const options: Omit<CardTypes.CardFilterOptions, 'isAvailable' | 'expirationAfter'> = {
            categoryId: categoryId ? (
                Array.isArray(categoryId) 
                    ? (categoryId as string[])
                    : [categoryId as string]
            ) : undefined,
            genre: genre ? (
                Array.isArray(genre)
                    ? (genre as string[])
                    : [genre as string]
            ) : undefined,
            searchTerm: searchTerm as string,
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            orderBy: validateOrderBy(orderBy as string),
            sortDirection: (sortDirection as 'asc' | 'desc') || 'asc'
        };

        const result = await CardServiceFetch.fetchActiveCards(options);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to get active cards'
            });
        }
    }
};

/**
 * Get cards with randomized order after the first 20 items
 */
export const getCardsWithRandomizedOrder = async (req: Request, res: Response): Promise<void> => {
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
            skip,
            take,
            orderBy,
            sortDirection
        } = req.query;

        const options: CardTypes.CardFilterOptions = {
            isAvailable: isAvailable === 'true' ? true : isAvailable === 'false' ? false : undefined,
            isHot: isHot === 'true' ? true : isHot === 'false' ? false : undefined,
            isDiscover: isDiscover === 'true' ? true : isDiscover === 'false' ? false : undefined,
            isPreview: isPreview === 'true' ? true : isPreview === 'false' ? false : undefined,
            categoryId: categoryId ? (
                Array.isArray(categoryId) 
                    ? (categoryId as string[])
                    : [categoryId as string]
            ) : undefined,
            genre: genre ? (
                Array.isArray(genre)
                    ? (genre as string[])
                    : [genre as string]
            ) : undefined,
            expirationBefore: expirationBefore ? new Date(expirationBefore as string) : undefined,
            expirationAfter: expirationAfter ? new Date(expirationAfter as string) : undefined,
            searchTerm: searchTerm as string,
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            orderBy: validateOrderBy(orderBy as string),
            sortDirection: (sortDirection as 'asc' | 'desc') || 'asc'
        };

        const result = await CardServiceFetch.fetchCardsWithRandomizedOrder(options);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        if (error.statusCode) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to get cards with randomized order'
            });
        }
    }
};

export const getCreatorsCards = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const cards = await CardServiceFetch.getOrganizedCards(id);
    res.status(StatusCodes.OK).json({data: cards});
})