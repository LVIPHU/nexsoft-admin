import type { z } from 'zod';
import { adminSchema } from '../admin/admin.js';

export const profileSchema = adminSchema.omit({ password: true });

export type ProfileDto = z.infer<typeof profileSchema>;
