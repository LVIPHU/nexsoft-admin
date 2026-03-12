import { z } from 'zod';

import { userSchema } from './user.js';

export const updateUserSchema = userSchema.partial().pick({
  Name: true,
  Bio: true,
  ThumbnailUrl: true,
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
