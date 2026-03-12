import type { z } from 'zod';

import { profileSchema } from './profile.js';

export const updateProfileSchema = profileSchema.partial().pick({
  Username: true,
  Name: true,
  Bio: true,
  ThumbnailUrl: true,
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
