import { Prisma, DeviceSize } from '@prisma/client';
import { prisma } from '../db/prisma-client';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';
import { 
  CreateDesignElementInput,
  UpdateDesignElementInput,
  CreateHtmlElementInput,
  UpdateHtmlElementInput 
} from '../types/categoryDesign.types';
import { UploadMediaTypes } from '../types';
import { ImageMetadataServices } from './index';

// Create a new design element
export async function createDesignElement(
  data: CreateDesignElementInput, 
  imageBuffer: Buffer, 
  fileName: string
) {
  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    });

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
    }

    // Upload image and create metadata
    const { imageMetadata, url } = await ImageMetadataServices.createImageMetadata(
      imageBuffer, 
      fileName, 
      {
        bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
        folder: UploadMediaTypes.UploadMediaFolders.CATEGORIES
      }
    );

    // Create design element
    const element = await prisma.designElement.create({
      data: {
        url,
        image: url, // Set both url and image to the same value
        order: data.order,
        device: data.device,
        categoryId: data.categoryId,
        backgroundGradient: data.backgroundGradient || '',
        transitionGradient: data.transitionGradient || '',
        imageMetadataId: imageMetadata.id
      }
    });

    // Create HTML elements if provided
    if (data.htmlElements && data.htmlElements.length > 0) {
      await Promise.all(
        data.htmlElements.map(htmlElement => 
          prisma.htmlElement.create({
            data: {
              designElementId: element.id,
              htmlTag: htmlElement.htmlTag
            }
          })
        )
      );
    }

    // Return the created element with its related data
    return await prisma.designElement.findUnique({
      where: { id: element.id },
      include: {
        imageMetadata: true,
        htmlElements: true
      }
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to create design element: ${error.message}`);
  }
}

// Update a design element
export async function updateDesignElement(
  id: string,
  data: UpdateDesignElementInput,
  imageBuffer?: Buffer,
  fileName?: string
) {
  try {
    const element = await prisma.designElement.findUnique({
      where: { id },
      include: { imageMetadata: true }
    });

    if (!element) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Design element not found');
    }

    let imageUrl: string | undefined;

    // Update image if provided
    if (imageBuffer && fileName) {
      if (element.imageMetadata) {
        // Update existing image
        const { url } = await ImageMetadataServices.updateImageMetadata(
          element.imageMetadata.id,
          imageBuffer,
          fileName,
          {
            bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
            folder: UploadMediaTypes.UploadMediaFolders.CATEGORIES
          }
        );
        imageUrl = url;
      } else {
        // Create new image
        const { imageMetadata, url } = await ImageMetadataServices.createImageMetadata(
          imageBuffer,
          fileName,
          {
            bucketName: UploadMediaTypes.UploadMediaBucket.MAIN_BUCKET,
            folder: UploadMediaTypes.UploadMediaFolders.CATEGORIES
          }
        );
        
        // Connect the new image metadata to the design element
        await prisma.designElement.update({
          where: { id },
          data: {
            imageMetadata: {
              connect: { id: imageMetadata.id }
            }
          }
        });
        
        imageUrl = url;
      }
    }

    // Update the design element
    const updateData: Prisma.DesignElementUpdateInput = { ...data };
    if (imageUrl) {
      updateData.url = imageUrl;
      updateData.image = imageUrl; // Update both url and image fields
    }

    const updatedElement = await prisma.designElement.update({
      where: { id },
      data: updateData,
      include: {
        imageMetadata: true,
        htmlElements: true
      }
    });

    return updatedElement;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to update design element: ${error.message}`);
  }
}

// Delete a design element
export async function deleteDesignElement(id: string) {
  try {
    const element = await prisma.designElement.findUnique({
      where: { id },
      include: {
        imageMetadata: true,
        htmlElements: true
      }
    });

    if (!element) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Design element not found');
    }

    // Delete associated HTML elements
    await prisma.htmlElement.deleteMany({
      where: { designElementId: id }
    });

    // Delete image metadata if it exists
    if (element.imageMetadata) {
      await prisma.imageMetadata.delete({
        where: { id: element.imageMetadataId! }
      });
    }

    // Delete the design element
    await prisma.designElement.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to delete design element: ${error.message}`);
  }
}

// Create a new HTML element
export async function createHtmlElement(data: CreateHtmlElementInput) {
  try {
    const element = await prisma.designElement.findUnique({
      where: { id: data.designElementId }
    });

    if (!element) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Design element not found');
    }

    const htmlElement = await prisma.htmlElement.create({
      data: {
        designElementId: data.designElementId,
        htmlTag: data.htmlTag
      }
    });

    return htmlElement;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to create HTML element: ${error.message}`);
  }
}

// Update an HTML element
export async function updateHtmlElement(id: string, data: UpdateHtmlElementInput) {
  try {
    const htmlElement = await prisma.htmlElement.findUnique({
      where: { id }
    });

    if (!htmlElement) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'HTML element not found');
    }

    const updatedElement = await prisma.htmlElement.update({
      where: { id },
      data
    });

    return updatedElement;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to update HTML element: ${error.message}`);
  }
}

// Delete an HTML element
export async function deleteHtmlElement(id: string) {
  try {
    const htmlElement = await prisma.htmlElement.findUnique({
      where: { id }
    });

    if (!htmlElement) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'HTML element not found');
    }

    await prisma.htmlElement.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to delete HTML element: ${error.message}`);
  }
}

// Get design elements by device size for a category
export async function getDesignElementsByDeviceSize(categoryId: string, device: DeviceSize) {
  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
    }

    const elements = await prisma.designElement.findMany({
      where: {
        categoryId,
        device,
        deletedAt: null
      },
      include: {
        imageMetadata: true,
        htmlElements: {
          where: { deletedAt: null }
        }
      },
      orderBy: { order: 'asc' }
    });

    return elements;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to get design elements: ${error.message}`);
  }
}

// Reorder design elements
export async function reorderDesignElements(
  categoryId: string, 
  device: DeviceSize, 
  elementIds: string[]
) {
  try {
    // Check if all elements exist and belong to the specified category and device size
    const elements = await prisma.designElement.findMany({
      where: {
        id: { in: elementIds },
        categoryId,
        device,
        deletedAt: null
      }
    });

    if (elements.length !== elementIds.length) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST, 
        'One or more design elements do not exist or do not belong to the specified category and device size'
      );
    }

    // Update the order of each element in a transaction
    await prisma.$transaction(
      elementIds.map((id, index) => 
        prisma.designElement.update({
          where: { id },
          data: { order: index + 1 }
        })
      )
    );

    // Return the reordered elements
    return await prisma.designElement.findMany({
      where: {
        categoryId,
        device,
        deletedAt: null
      },
      include: {
        imageMetadata: true,
        htmlElements: {
          where: { deletedAt: null }
        }
      },
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to reorder design elements: ${error.message}`);
  }
}

// Get all design elements for a category, grouped by device size
export async function getDesignElementsByCategory(categoryId: string) {
  try {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
    }

    const elements = await prisma.designElement.findMany({
      where: {
        categoryId,
        deletedAt: null
      },
      include: {
        imageMetadata: true,
        htmlElements: {
          where: { deletedAt: null }
        }
      },
      orderBy: { order: 'asc' }
    });

    // Group elements by device size
    const groupedElements = {
      mobile: elements.filter(el => el.device === DeviceSize.mobile),
      tablet: elements.filter(el => el.device === DeviceSize.tablet),
      desktop: elements.filter(el => el.device === DeviceSize.desktop)
    };

    return groupedElements;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to get design elements: ${error.message}`);
  }
}