import { z } from 'zod';

import { usernameSchema } from '../user/user.js';

export const signInSchema = z.object({
  identifier: usernameSchema,
  password: z.string().min(8),
});

export type SignInDto = z.infer<typeof signInSchema>;
