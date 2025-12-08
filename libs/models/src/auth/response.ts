import { z } from 'zod'

export const authResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.string().datetime(), // ISO 8601 format
})

export type AuthResponseDto = z.infer<typeof authResponseSchema>
