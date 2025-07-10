import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';
import { uploadFile, deleteFile, FileUploadType } from './uploadMedia.service';

const prisma = new PrismaClient();

interface ProcessedImage {
  buffer: Buffer;
  metadata: {
    width: number;
    height: number;
    size: number;
    format: string;
    mimeType: string;
  };
}

interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  maxSizeKB?: number;
  quality?: number;
}

export async function processImage(
  buffer: Buffer,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImage> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    maxSizeKB = 500,
    quality = 80
  } = options;

  try {
    // Get initial metadata
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Could not extract image dimensions'
      );
    }

    let processedBuffer = buffer;
    let currentMetadata = metadata;

    // Resize if needed
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      processedBuffer = await sharp(buffer)
        .resize(maxWidth, maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();

      currentMetadata = await sharp(processedBuffer).metadata();
    }

    // Compress if needed
    const currentSize = processedBuffer.length / 1024; // Convert to KB
    if (currentSize > maxSizeKB) {
      let currentQuality = quality;
      
      while (currentSize > maxSizeKB && currentQuality > 20) {
        const compressedImage = await sharp(processedBuffer)
          .jpeg({ quality: currentQuality })
          .toBuffer();

        if (compressedImage.length / 1024 <= maxSizeKB) {
          processedBuffer = compressedImage;
          currentMetadata = await sharp(compressedImage).metadata();
          break;
        }

        currentQuality -= 10;
      }

      if (currentSize > maxSizeKB) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Unable to compress image below ${maxSizeKB}KB while maintaining acceptable quality`
        );
      }
    }

    return {
      buffer: processedBuffer,
      metadata: {
        width: currentMetadata.width!,
        height: currentMetadata.height!,
        size: Math.ceil(processedBuffer.length / 1024),
        format: currentMetadata.format || 'unknown',
        mimeType: `image/${currentMetadata.format}`,
      }
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to process image: ${error.message}`
    );
  }
}

export async function createImageMetadata(
  buffer: Buffer,
  fileName: string,
  categoryId: string,
  categoryTitle: string,
  uploadType: FileUploadType
) {
  try {
    // Process image and get metadata
    const { buffer: processedBuffer, metadata } = await processImage(buffer);

    // Upload to filesystem
    const uploadResult = await uploadFile(
      processedBuffer,
      fileName,
      metadata.mimeType,
      {
        categoryId: categoryId,
        uploadType: uploadType
      },
      categoryTitle
    );

    // Create metadata record in database
    const imageMetadata = await prisma.imageMetadata.create({
      data: {
        width: metadata.width,
        height: metadata.height,
        size: metadata.size,
        mimeType: metadata.mimeType,
        url: uploadResult.url,
        filePath: uploadResult.filePath,
        fileName: fileName
      }
    });

    return {
      imageMetadata,
      key: uploadResult.key,
      url: uploadResult.url
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to create image metadata: ${error.message}`
    );
  }
}

export async function updateImageMetadata(
  id: string,
  buffer: Buffer,
  fileName: string,
  categoryId: string,
  categoryTitle: string,
  uploadType: FileUploadType
) {
  try {
    // Get existing metadata
    const existingMetadata = await prisma.imageMetadata.findUnique({
      where: { id }
    });

    if (!existingMetadata) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Image metadata not found'
      );
    }

    // Process new image
    const { buffer: processedBuffer, metadata } = await processImage(buffer);

    // Upload new image to filesystem
    const uploadResult = await uploadFile(
      processedBuffer,
      fileName,
      metadata.mimeType,
      {
        categoryId: categoryId,
        uploadType: uploadType
      },
      categoryTitle
    );

    // Delete old image from filesystem
    await deleteFile(existingMetadata.filePath);

    // Update metadata record
    const updatedMetadata = await prisma.imageMetadata.update({
      where: { id },
      data: {
        width: metadata.width,
        height: metadata.height,
        size: metadata.size,
        mimeType: metadata.mimeType,
        url: uploadResult.url,
        filePath: uploadResult.filePath,
        fileName: fileName
      }
    });

    return {
      imageMetadata: updatedMetadata,
      key: uploadResult.key,
      url: uploadResult.url
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to update image metadata: ${error.message}`
    );
  }
}

export async function deleteImageMetadata(id: string) {
  try {
    const metadata = await prisma.imageMetadata.findUnique({
      where: { id }
    });

    if (!metadata) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Image metadata not found'
      );
    }

    // Delete from filesystem
    await deleteFile(metadata.filePath);

    // Delete metadata record
    await prisma.imageMetadata.delete({
      where: { id }
    });

    return true;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Failed to delete image metadata: ${error.message}`
    );
  }
}