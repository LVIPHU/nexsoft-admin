import { z } from 'zod';

export const userStatSchema = z.object({
  TotalPosts: z.number(),
  TotalFollowers: z.number(),
  TotalFollowing: z.number(),
  TotalLikes: z.number(),
});

export const userSchema = z.object({
  UserId: z.string(),
  Username: z.string(),
  Name: z.string(),
  Bio: z.string().nullable(),
  ThumbnailUrl: z.string().nullable(),
  UserStat: userStatSchema,
  CurrentUserFollowers: z.number(),
  CurrentUserReaction: z.unknown().nullable(),
});

export type UserStatDto = z.infer<typeof userStatSchema>;
export type UserDto = z.infer<typeof userSchema>;
