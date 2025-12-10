import { z } from 'zod';
import { authResponseSchema } from './response.js';

export const tokenExchangeRequestSchema = z.object({
  code: z.string().min(1),
  redirect_uri: z.string().url(),
});

export type TokenExchangeRequestDto = z.infer<typeof tokenExchangeRequestSchema>;

export const tokenExchangeResponseSchema = authResponseSchema;

export type TokenExchangeResponseDto = z.infer<typeof tokenExchangeResponseSchema>;


