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

// Get all design elements for a category
export const getCategoryDesignElements = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const elements = await CategoryDesignService.getCategoryDesignElements(categoryId);

  res.json({
    status: 'success',
    data: elements
  });
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

  const device = convertStringToDeviceSize(req.body.device);
  if (!device) {
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
      categoryId: req.body.categoryId,
      url: '', // Will be set by the service after upload
      image: '', // Will be set by the service after upload
      order: parseInt(req.body.order) || 1,
      device,
      backgroundGradient: req.body.backgroundGradient || '',
      transitionGradient: req.body.transitionGradient || '',
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
  
  const device = convertStringToDeviceSize(req.body.device);
  
  const updateData: any = {};
  if (req.body.order) updateData.order = parseInt(req.body.order);
  if (device) updateData.device = device;
  if (req.body.backgroundGradient !== undefined) updateData.backgroundGradient = req.body.backgroundGradient;
  if (req.body.transitionGradient !== undefined) updateData.transitionGradient = req.body.transitionGradient;

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
  const { device } = req.query;
  
  const convertedDevice = convertStringToDeviceSize(device as string);
  if (!convertedDevice) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Invalid device size. Must be one of: mobile, tablet, desktop'
    });
    return;
  }

  const elements = await CategoryDesignService.getDesignElementsByDeviceSize(
    categoryId,
    convertedDevice
  );

  res.json({
    status: 'success',
    data: elements
  });
});

// Reorder design elements
export const reorderDesignElements = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  const { device, elementIds } = req.body;
  
  const convertedDevice = convertStringToDeviceSize(device);
  if (!convertedDevice) {
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
    categoryId,
    convertedDevice,
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