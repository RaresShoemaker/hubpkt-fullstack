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
  hasPreview: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
  userId: z.string().uuid()
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
  const validatedData = createCategorySchema.parse(req.body);

  // Get next order number
  const order = await CategoryServices.getNextCategoryOrder();

  // Create category
  const category = await CategoryServices.createCategory(
    {
      title: validatedData.title,
      hasPreview: validatedData.hasPreview,
      isAvailable: validatedData.isAvailable,
      userId: validatedData.userId,
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

  // Validate body if present
  let validatedData = {};
  if (Object.keys(req.body).length > 0) {
    const updateSchema = createCategorySchema.partial();
    validatedData = updateSchema.parse(req.body);
  }

  // Validate file if present
  if (req.file) {
    validateImageFile(req.file);
  }

  const category = await CategoryServices.updateCategory(
    id,
    validatedData,
    req.file?.buffer,
    req.file?.originalname
  );

  res.json({
    status: "success",
    data: category
  });
});

export const updateCategoryOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { order } = req.body;

  if (typeof order !== "number" || order < 1) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Valid order number is required");
  }

  await CategoryServices.updateCategoryOrder(id, order);

  res.json({
    status: "success",
    message: "Category order updated successfully"
  });
});

export const reorderCategories = catchAsync(async (req: Request, res: Response) => {
  const schema = z.object({
    categoryIds: z.array(z.string().uuid())
  });

  const { categoryIds } = schema.parse(req.body);

  await CategoryServices.reorderCategories(categoryIds);

  res.json({
    status: "success",
    message: "Categories reordered successfully"
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
      isAvailable: true
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