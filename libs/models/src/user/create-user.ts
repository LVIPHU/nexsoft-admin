import { z } from 'zod';

import { userSchema } from './user.js';

export const createUserSchema = userSchema
  .partial()
  .pick({
    username: true,
    name: true,
    status: true,
    bio: true,
    location: true,
    website_url: true,
    thumbnail_url: true,
    avatar_url: true,
    banner_url: true,
  })
  .required({
    username: true,
    name: true,
  })
  .extend({
    // Allow empty strings for URL fields
    website_url: z.union([z.string().url(), z.literal('')]).optional(),
    thumbnail_url: z.union([z.instanceof(File), z.string().url(), z.literal('')]).optional(),
    avatar_url: z.union([z.instanceof(File), z.string().url(), z.literal('')]).optional(),
    banner_url: z.union([z.instanceof(File), z.string().url(), z.literal('')]).optional(),
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;
