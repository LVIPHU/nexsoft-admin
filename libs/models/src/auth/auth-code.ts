import { z } from 'zod';

export const authCodeRequestSchema = z.object({
  redirect_uri: z.string().url(),
  app_id: z.string().min(1),
});

export type AuthCodeRequestDto = z.infer<typeof authCodeRequestSchema>;

export const authCodeResponseSchema = z.object({
  code: z.string().min(1),
  redirect_uri: z.string().url(),
});

export type AuthCodeResponseDto = z.infer<typeof authCodeResponseSchema>;


