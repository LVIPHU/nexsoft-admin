import type { z } from 'zod'

import { userSchema } from './user.js'

export const updateUserSchema = userSchema.partial().pick({
  username: true,
  name: true,
  bio: true,
  location: true,
  website_url: true,
  thumbnail_url: true,
  avatar_url: true,
  banner_url: true,
})

export type UpdateUserDto = z.infer<typeof updateUserSchema>
