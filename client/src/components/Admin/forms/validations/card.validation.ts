import { z } from 'zod';

// Define the accepted image types
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/svg'];
// Max file size (5KB)
const MAX_FILE_SIZE = 5 * 1024 * 1025;

// Schema for creating a new card
export const createCardSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title cannot exceed 100 characters' }),
  
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(1000, { message: 'Description cannot exceed 1000 characters' }),

  href: z
    .string()
    .min(1, { message: 'Link is required' }),
  
  genre: z
    .string()
    .max(50, { message: 'Genre cannot exceed 50 characters' }),
  
  categoryId: z
    .string()
    .min(1, { message: 'Category is required' }),
  
  isAvailable: z
    .boolean()
    .default(true),
  
  isDiscover: z
    .boolean()
    .default(false),
  
  isHot: z
    .boolean()
    .default(false),
  
  isPreview: z
    .boolean()
    .default(false),

  isSquare: z
    .boolean()
    .default(false),
  
  expirationDate: z
    .string()
    .optional(),
  
  expirationTime: z
    .string()
    .optional(),
  
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= MAX_FILE_SIZE, 
      { message: 'File is too large. Maximum size is 5MB.' }
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      { message: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' }
    ),

    imageUrl: z.string().optional(),
});

// Schema for updating an existing card
export const updateCardSchema = createCardSchema.extend({
  image: z
    .union([
      z.instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE, 
          { message: 'File is too large. Maximum size is 5MB.' }
        )
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          { message: 'Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.' }
        ),
      z.null() // Allow null explicitly
    ])
    .optional(),
});



// Custom validator for expiration date
export const validateExpiration = (date: string, time: string): string | null => {
  if (!date) return null;
  
  const dateTimeStr = `${date}T${time || '00:00'}`;
  const expirationDateTime = new Date(dateTimeStr);
  const now = new Date();
  
  if (expirationDateTime <= now) {
    return 'Expiration date must be in the future';
  }
  
  return null;
};

// Types
export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;