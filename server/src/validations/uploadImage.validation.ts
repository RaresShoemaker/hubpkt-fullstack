import z from "zod";

export const uploadImageSchema = z.object({
  file: z.any().refine((file) => file !== undefined, {
    message: "Image is required"
  }).refine((file) => {
    if (file?.size) {
      return file.size <= 500 * 1024; // 500KB
    }
    return false;
  }, {
    message: "Image size must be less than 500KB"
  }).refine((file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return file?.mimetype && validTypes.includes(file.mimetype);
  }, {
    message: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed"
  }),
});