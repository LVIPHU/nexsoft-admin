import { z } from 'zod';
import { usernameSchema, statusSchema } from './user.js';

export const createUserSchema = z.object({
  username: usernameSchema,
  name: z.string().min(1).max(255),
  status: statusSchema.optional(),
  bio: z.string().max(255).optional(),
  location: z.string().max(255).optional(),
  website_url: z.union([z.string().url(), z.literal('')]).optional(),
  thumbnail_url: z.union([z.string().url(), z.literal('')]).optional(),
  avatar_url: z.union([z.string().url(), z.literal('')]).optional(),
  banner_url: z.union([z.string().url(), z.literal('')]).optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
