import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DeviceSize } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import { CategoryDesignService } from '../services/index';

// Helper function to convert string boolean values to actual booleans
const convertStringToDeviceSize = (deviceSize?: string): DeviceSize | undefined => {
  if (!deviceSize) return undefined;
  
  switch (deviceSize.toLowerCase()) {
    case 'mobile':
      return DeviceSize.mobile;
    case 'tablet':
      return DeviceSize.tablet;
    case 'desktop':
      return DeviceSize.desktop;
    default:
      return undefined;
  }
};

// Create a new category design
export const createCategoryDesign = catchAsync(async (req: Request, res: Response) => {
  const design = await CategoryDesignService.createCategoryDesign({
    categoryId: req.body.categoryId,
    backgroundGradient: req.body.backgroundGradient,
    transitionGradient: req.body.transitionGradient
  });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: design
  });
});

// Update a category design
export const updateCategoryDesign = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const design = await CategoryDesignService.updateCategoryDesign(id, {
    backgroundGradient: req.body.backgroundGradient,
    transitionGradient: req.body.transitionGradient
  });

  res.json({
    status: 'success',
    data: design
  });
});

// Get a category design by ID
export const getCategoryDesign = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const design = await CategoryDesignService.getCategoryDesign(id);

  res.json({
    status: 'success',
    data: design
  });
});

// Get a category design by category ID
export const getCategoryDesignByCategoryId = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const design = await CategoryDesignService.getCategoryDesignByCategoryId(categoryId);

  res.json({
    status: 'success',
    data: design
  });
});

// Delete a category design
export const deleteCategoryDesign = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CategoryDesignService.deleteCategoryDesign(id);

  res.status(StatusCodes.NO_CONTENT).send();
});

// Create a new design element
export const createDesignElement = catchAsync(async (req: Request, res: Response) => {
  const imageFile = req.file;

  if (!imageFile) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Image file is required'
    });
    return;
  }

  const deviceSize = convertStringToDeviceSize(req.body.deviceSize);
  if (!deviceSize) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid device size. Must be one of: mobile, tablet, desktop'
    });
    return;
  }

  // Parse HTML elements if provided
  let htmlElements;
  if (req.body.htmlElements) {
    try {
      htmlElements = JSON.parse(req.body.htmlElements);
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: 'error',
        message: 'Invalid JSON format for HTML elements'
      });
      return;
    }
  }

  const element = await CategoryDesignService.createDesignElement(
    {
      categoryDesignId: req.body.categoryDesignId,
      url: '', // Will be set by the service after upload
      order: parseInt(req.body.order) || 1,
      deviceSize,
      htmlElements: htmlElements
    },
    imageFile.buffer,
    imageFile.originalname
  );

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: element
  });
});

// Update a design element
export const updateDesignElement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const imageFile = req.file;
  
  const deviceSize = convertStringToDeviceSize(req.body.deviceSize);
  
  const updateData: any = {};
  if (req.body.order) updateData.order = parseInt(req.body.order);
  if (deviceSize) updateData.deviceSize = deviceSize;

  const element = await CategoryDesignService.updateDesignElement(
    id,
    updateData,
    imageFile?.buffer,
    imageFile?.originalname
  );

  res.json({
    status: 'success',
    data: element
  });
});

// Delete a design element
export const deleteDesignElement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CategoryDesignService.deleteDesignElement(id);

  res.status(StatusCodes.NO_CONTENT).send();
});

// Get design elements by device size for a category
export const getDesignElementsByDeviceSize = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  
  // Support both deviceSize and device query parameters for backward compatibility
  const deviceSizeParam = req.query.deviceSize || req.query.device;
  
  const convertedDeviceSize = convertStringToDeviceSize(deviceSizeParam as string);
  if (!convertedDeviceSize) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid device size. Must be one of: mobile, tablet, desktop'
    });
    return;
  }

  const elements = await CategoryDesignService.getDesignElementsByDeviceSize(
    categoryId,
    convertedDeviceSize
  );

  res.json({
    status: 'success',
    data: elements
  });
});

// Reorder design elements
export const reorderDesignElements = catchAsync(async (req: Request, res: Response) => {
  const { categoryDesignId } = req.params;
  const { deviceSize, elementIds } = req.body;
  
  const convertedDeviceSize = convertStringToDeviceSize(deviceSize);
  if (!convertedDeviceSize) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid device size. Must be one of: mobile, tablet, desktop'
    });
    return;
  }

  if (!Array.isArray(elementIds)) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Element IDs must be an array'
    });
    return;
  }

  const elements = await CategoryDesignService.reorderDesignElements(
    categoryDesignId,
    convertedDeviceSize,
    elementIds
  );

  res.json({
    status: 'success',
    data: elements
  });
});

// Create a new HTML element
export const createHtmlElement = catchAsync(async (req: Request, res: Response) => {
  let htmlTag;
  try {
    htmlTag = typeof req.body.htmlTag === 'string' 
      ? JSON.parse(req.body.htmlTag) 
      : req.body.htmlTag;
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid JSON format for HTML tag'
    });
    return;
  }

  const htmlElement = await CategoryDesignService.createHtmlElement({
    designElementId: req.body.designElementId,
    htmlTag
  });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: htmlElement
  });
});

// Update an HTML element
export const updateHtmlElement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  let htmlTag;
  try {
    htmlTag = typeof req.body.htmlTag === 'string' 
      ? JSON.parse(req.body.htmlTag) 
      : req.body.htmlTag;
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid JSON format for HTML tag'
    });
    return;
  }

  const htmlElement = await CategoryDesignService.updateHtmlElement(id, {
    htmlTag
  });

  res.json({
    status: 'success',
    data: htmlElement
  });
});

// Delete an HTML element
export const deleteHtmlElement = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CategoryDesignService.deleteHtmlElement(id);

  res.status(StatusCodes.NO_CONTENT).send();
});