import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/ApiError";
import * as CategoryServices from "../services/category.service";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Define a proper type for the request with file
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Validation schema for category creation
const createCategorySchema = z.object({
  title: z.string().min(2).max(100),
  hasPreview: z.string(),
  isAvailable: z.string(),
  userId: z.string().uuid(),
  previewTitle: z.string()
});

// File validation
const validateImageFile = (file: Express.Multer.File | undefined) => {
  if (!file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Image file is required");
  }

  if (!file.mimetype.startsWith("image/")) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "File must be an image");
  }

  const maxSize = 500 * 1024; // 500KB
  if (file.size > maxSize) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Image size must be less than 500KB"
    );
  }
};

export const createCategory = catchAsync(async (req: MulterRequest, res: Response) => {
  // Validate file
  validateImageFile(req.file);

  // Validate body
  const validatedData = createCategorySchema.parse({...req.body, userId: req.user?.userId});

  // Get next order number
  const order = await CategoryServices.getNextCategoryOrder();

  // Create category
  const category = await CategoryServices.createCategory(
    {
      title: validatedData.title,
      hasPreview: validatedData.hasPreview === "true",
      isAvailable: validatedData.isAvailable === "true",
      userId: validatedData.userId,
      previewTitle: validatedData.previewTitle,
      order
    },
    req.file.buffer,
    req.file.originalname
  );

  res.status(StatusCodes.CREATED).json({
    status: "success",
    data: category
  });
});

export const updateCategory = catchAsync(async (req: RequestWithFile, res: Response) => {
  const { id } = req.params;

  // Validate file if present
  if (req.file) {
    validateImageFile(req.file);
  }

  const category = await CategoryServices.updateCategory(
    id,
    {...req.body,
      hasPreview: req.body.hasPreview === "true",
      isAvailable: req.body.isAvailable === "true",
      hasSquareContent: req.body.hasSquareContent === "true"
    },
    req.file?.buffer,
    req.file?.originalname
  );

  res.json({
    status: "success",
    data: category
  });
});

export const reorderCategories = catchAsync(async (req: Request, res: Response) => {
  const schema = z.array(z.string().uuid());
  const categoryIds = schema.parse(req.body);

  const categories = await CategoryServices.reorderCategories(categoryIds);

  res.json({
    status: "success",
    message: "Categories reordered successfully",
    data: categories
  });
});

export const getCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const category = await CategoryServices.getCategory(id);

  res.json({
    status: "success",
    data: category
  });
});

export const listCategories = catchAsync(async (req: Request, res: Response) => {
  // Parse query parameters
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const orderBy = req.query.orderBy as keyof Prisma.CategoryOrderByWithRelationInput || 'order';
  const order = req.query.order === 'desc' ? 'desc' : 'asc';

  const { total, categories } = await CategoryServices.listCategories({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { [orderBy]: order },
    where: {
      deletedAt: null,
    }
  });

  res.json({
    status: "success",
    data: {
      categories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CategoryServices.deleteCategory(id);

  res.status(StatusCodes.NO_CONTENT).send();
});

export const fetchClientCategories = catchAsync(async (_req: Request, res: Response) => {
  const categories = await CategoryServices.fetchClientCategories();

  res.json({
    status: "success",
    data: categories
  });
});
