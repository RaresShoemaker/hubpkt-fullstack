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
import { uploadFile, deleteFile, FileUploadType } from './uploadMedia.service';
import sharp from 'sharp';

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

    // Process image with sharp based on device type
    let processedBuffer: Buffer;
    
    switch (data.device) {
      case DeviceSize.mobile:
        processedBuffer = await sharp(imageBuffer)
          .resize(375, 667, { fit: 'cover', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
        break;
      case DeviceSize.tablet:
        processedBuffer = await sharp(imageBuffer)
          .resize(768, 1024, { fit: 'cover', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
        break;
      case DeviceSize.desktop:
        processedBuffer = await sharp(imageBuffer)
          .resize(1920, 1080, { fit: 'cover', withoutEnlargement: true })
          .jpeg({ quality: 85 })
          .toBuffer();
        break;
      default:
        processedBuffer = await sharp(imageBuffer)
          .jpeg({ quality: 85 })
          .toBuffer();
    }

    // Get image metadata
    const metadata = await sharp(processedBuffer).metadata();

    // Upload to device-specific folder within category
    const uploadResult = await uploadFile(
      processedBuffer,
      fileName,
      'image/jpeg', // Using processed JPEG
      {
        categoryId: data.categoryId,
        uploadType: FileUploadType.DESIGN_ELEMENT,
        deviceSize: data.device as 'mobile' | 'tablet' | 'desktop'
      },
      category.title
    );

    // Create image metadata record
    const imageMetadata = await prisma.imageMetadata.create({
      data: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        size: uploadResult.fileSize,
        mimeType: 'image/jpeg',
        url: uploadResult.url,
        filePath: uploadResult.filePath,
        fileName: fileName
      }
    });

    // Create design element
    const element = await prisma.designElement.create({
      data: {
        url: uploadResult.url,
        image: uploadResult.url, // Set both url and image to the same value
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
      include: { 
        imageMetadata: true,
        category: true
      }
    });

    if (!element) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Design element not found');
    }

    let imageUrl: string | undefined;

    // Update image if provided
    if (imageBuffer && fileName) {
      // Delete old image if exists
      if (element.imageMetadata) {
        await deleteFile(element.imageMetadata.filePath);
        await prisma.imageMetadata.delete({
          where: { id: element.imageMetadata.id }
        });
      }

      // Process new image based on device type
      let processedBuffer: Buffer;
      
      switch (element.device) {
        case DeviceSize.mobile:
          processedBuffer = await sharp(imageBuffer)
            .resize(375, 667, { fit: 'cover', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
          break;
        case DeviceSize.tablet:
          processedBuffer = await sharp(imageBuffer)
            .resize(768, 1024, { fit: 'cover', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
          break;
        case DeviceSize.desktop:
          processedBuffer = await sharp(imageBuffer)
            .resize(1920, 1080, { fit: 'cover', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();
          break;
        default:
          processedBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 85 })
            .toBuffer();
      }

      const metadata = await sharp(processedBuffer).metadata();

      // Upload new image to device-specific folder
      const uploadResult = await uploadFile(
        processedBuffer,
        fileName,
        'image/jpeg', // Using processed JPEG
        {
          categoryId: element.categoryId,
          uploadType: FileUploadType.DESIGN_ELEMENT,
          deviceSize: element.device as 'mobile' | 'tablet' | 'desktop'
        },
        element.category.title
      );

      // Create new image metadata
      const newImageMetadata = await prisma.imageMetadata.create({
        data: {
          width: metadata.width || 0,
          height: metadata.height || 0,
          size: uploadResult.fileSize,
          mimeType: 'image/jpeg',
          url: uploadResult.url,
          filePath: uploadResult.filePath,
          fileName: fileName
        }
      });
      
      // Connect the new image metadata to the design element
      await prisma.designElement.update({
        where: { id },
        data: {
          imageMetadata: {
            connect: { id: newImageMetadata.id }
          }
        }
      });
      
      imageUrl = uploadResult.url;
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

    // Start transaction for cleanup
    await prisma.$transaction(async (tx) => {
      // Delete associated HTML elements
      await tx.htmlElement.deleteMany({
        where: { designElementId: id }
      });

      // Delete image file and metadata if exists
      if (element.imageMetadata) {
        await deleteFile(element.imageMetadata.filePath);
        await tx.imageMetadata.delete({
          where: { id: element.imageMetadataId! }
        });
      }

      // Delete the design element
      await tx.designElement.delete({
        where: { id }
      });
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

export const getCategoryDesignById = async (id: string) => {
  const design = await prisma.designElement.findUnique({
    where: { id },
    include: {
      category: true,
      imageMetadata: true,
      htmlElements: true
    }
});

  return design;
};