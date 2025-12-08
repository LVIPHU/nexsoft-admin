import { z } from 'zod'
import { dateSchema } from '@nexsoft-admin/utils'

export const usernameSchema = z
  .string()
  .min(3)
  .max(255)
  .regex(/^[\w.-]+$/, {
    message:
      'Usernames can only contain letters, numbers, periods, hyphens, and underscores.',
  })
  .transform((value) => value.toLowerCase())

export const statusSchema = z.enum(['ACTIVE', 'INACTIVE']).default('INACTIVE')

export const userSchema = z.object({
  user_id: z.string(),
  username: usernameSchema,
  name: z.string().min(1).max(255),
  status: statusSchema,
  bio: z.string().max(255),
  location: z.string().max(255),
  website_url: z.string().url(),
  thumbnail_url: z.string().url(),
  avatar_url: z.string().url(),
  banner_url: z.string().url(),
  user_stat: z.record(z.string(), z.any()),
  stat: z.record(z.string(), z.any()),
  created_at: dateSchema,
  updated_at: dateSchema,
})

export type UserDto = z.infer<typeof userSchema>
