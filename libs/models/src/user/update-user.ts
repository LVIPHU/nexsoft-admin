import { z } from 'zod';

import { userSchema } from './user.js';

const baseUpdateSchema = userSchema.partial().pick({
  username: true,
  name: true,
  bio: true,
  location: true,
  website_url: true,
  thumbnail_url: true,
  avatar_url: true,
  banner_url: true,
});

// Allow empty strings for URL fields
export const updateUserSchema = baseUpdateSchema.extend({
  website_url: z.union([z.string().url(), z.literal('')]).optional(),
  thumbnail_url: z.union([z.string().url(), z.literal('')]).optional(),
  avatar_url: z.union([z.string().url(), z.literal('')]).optional(),
  banner_url: z.union([z.string().url(), z.literal('')]).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
