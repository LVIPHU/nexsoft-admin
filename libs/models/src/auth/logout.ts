import { z } from 'zod';

export const logoutTypeSchema = z.enum(['local', 'global']);

export const logoutRequestSchema = z.object({
  type: logoutTypeSchema.default('local'),
  refresh_token: z.string().min(1).optional(),
});

export type LogoutRequestDto = z.infer<typeof logoutRequestSchema>;

export const logoutResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export type LogoutResponseDto = z.infer<typeof logoutResponseSchema>;


