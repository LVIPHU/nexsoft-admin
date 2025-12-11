import { z } from 'zod';

import { adminSchema } from '../admin/admin.js';

export const signUpSchema = adminSchema.pick({ name: true, username: true }).extend({ password: z.string().min(6) });

export type SignUpDto = z.infer<typeof signUpSchema>;
