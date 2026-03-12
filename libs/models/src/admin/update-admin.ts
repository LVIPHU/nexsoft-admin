import { z } from 'zod';

import { adminSchema } from './admin.js';

export const updateAdminSchema = adminSchema
  .partial()
  .pick({
    Username: true,
    Name: true,
    Bio: true,
    ThumbnailUrl: true,
    password: true,
  })
  .extend({
    role: z.string(),
  });

export type UpdateAdminDto = z.infer<typeof updateAdminSchema>;
