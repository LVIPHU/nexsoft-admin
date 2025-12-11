import { z } from 'zod';

import { adminSchema } from './admin.js';

export const updateAdminSchema = adminSchema
  .partial()
  .pick({
    username: true,
    password: true,
    name: true,
    status: true,
    thumbnail_url: true,
    avatar_url: true,
  })
  .extend({
    role: z.string(),
  });

export type UpdateAdminDto = z.infer<typeof updateAdminSchema>;
