import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CardService } from '../services/index';

export const createCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const imageFile = req.file;

        if (!imageFile) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Image file is required'
            });
            return;
        }

        const card = await CardService.createCard(
            {
                ...req.body,
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

        const card = await CardService.updateCard(
            id,
            req.body,
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

export const getCard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const card = await CardService.getCard(id);
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

        const result = await CardService.listCards({
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

        await CardService.updateCardOrder(id, order, categoryId);
        res.status(StatusCodes.OK).json({ success: true });
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

        await CardService.reorderCards(orderedCardIds, categoryId);
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