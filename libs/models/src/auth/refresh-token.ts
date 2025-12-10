import { z } from 'zod';
import { authResponseSchema } from './response.js';

export const refreshTokenRequestSchema = z.object({
  refresh_token: z.string().min(1),
});

export type RefreshTokenRequestDto = z.infer<typeof refreshTokenRequestSchema>;

export const refreshTokenResponseSchema = authResponseSchema;

export type RefreshTokenResponseDto = z.infer<typeof refreshTokenResponseSchema>;


