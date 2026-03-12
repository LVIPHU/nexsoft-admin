import { z } from 'zod';

export const signInSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
});

export type SignInDto = z.infer<typeof signInSchema>;
