import { z } from 'zod';

const violationReplyCreatorSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  name: z.string(),
  thumbnail_url: z.string().nullable().optional(),
});

const violationReplySchema = z.object({
  id: z.number(),
  content: z.string(),
  hashtags: z.array(z.string()).nullable().optional(),
  reply_on_id: z.number(),
  created_at: z.string().nullable().optional(),
  creator: violationReplyCreatorSchema,
});

const violationRepliesPaginationSchema = z.object({
  total_rows: z.number().optional().default(0),
  total_pages: z.number().optional().default(0),
  limit: z.number(),
  page: z.number(),
  sort: z.unknown().optional(),
});

export const violationRepliesResponseSchema = z.object({
  data: z.array(violationReplySchema),
  pagination: violationRepliesPaginationSchema,
});

export type ViolationReplyCreatorDto = z.infer<typeof violationReplyCreatorSchema>;
export type ViolationReplyDto = z.infer<typeof violationReplySchema>;
export type ViolationRepliesResponseDto = z.infer<typeof violationRepliesResponseSchema>;
