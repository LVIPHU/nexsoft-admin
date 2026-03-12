import { z } from 'zod';

import { userSchema } from './user.js';

export const createUserSchema = userSchema
  .partial()
  .pick({
    Username: true,
    Name: true,
    Bio: true,
    ThumbnailUrl: true,
  })
  .required({
    Username: true,
    Name: true,
  });

export type CreateUserDto = z.infer<typeof createUserSchema>;
