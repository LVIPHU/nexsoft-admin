import { z } from 'zod';

import { userSchema } from './user.js';

export const usersListResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  users: z.array(userSchema),
});

export const userDetailResponseSchema = z.object({
  user: userSchema,
});

export type UsersListResponseDto = z.infer<typeof usersListResponseSchema>;
export type UserDetailResponseDto = z.infer<typeof userDetailResponseSchema>;
