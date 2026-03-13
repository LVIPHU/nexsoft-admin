import { z } from 'zod';

import { violationSummarySchema } from './violation.js';

const violationUserSchema = z.object({
  user_id: z.string(),
  username: z.string(),
  name: z.string(),
  thumbnail_url: z.string().nullable().optional(),
});

const violationFileSchema = z.object({
  hash: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  size: z.number().optional(),
  duration: z.number().optional(),
  mime_type: z.string().optional(),
  name: z.string().optional(),
  ext: z.string().optional(),
  unique_hash: z.string().optional(),
});

const violationDetailContentSchema = z.object({
  id: z.number(),
  content: z.string(),
  audience_type: z.string().optional(),
  post_content_type: z.string().optional(),
  post_status: z.string().optional(),
  post_type: z.string().optional(),
  files: z.array(violationFileSchema).nullable().optional(),
  hashtags: z.array(z.string()).nullable().optional(),
  created_by: z.string().optional(),
  updated_by: z.string().optional(),
  created_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)).optional(),
  updated_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)).optional(),
  user: violationUserSchema.optional(),
  post_metrics: z.record(z.string(), z.number()).optional(),
  parent_id: z.number().nullable().optional(),
  parent_post: z.unknown().nullable().optional(),
  reply_on_id: z.number().nullable().optional(),
  reply_on_post: z.unknown().nullable().optional(),
});

const violationFullSchema = z.object({
  id: z.number(),
  content_id: z.number(),
  content_type: z.string(),
  content_data_type: z.string(),
  content: z.string(),
  hashtags: z.array(z.string()).nullable().optional(),
  content_created_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)).optional(),
  content_updated_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)).optional(),
  violation_status: z.string(),
  number_of_violations: z.number(),
  total_by_violation_type: z.array(violationSummarySchema).optional(),
  priority: z.string(),
  created_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)),
  updated_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)),
});

export const violationDetailResponseSchema = z.object({
  violation: violationFullSchema,
  content: violationDetailContentSchema.optional(),
});

export type ViolationUserDto = z.infer<typeof violationUserSchema>;
export type ViolationFileDto = z.infer<typeof violationFileSchema>;
export type ViolationDetailContentDto = z.infer<typeof violationDetailContentSchema>;
export type ViolationFullDto = z.infer<typeof violationFullSchema>;
export type ViolationDetailResponseDto = z.infer<typeof violationDetailResponseSchema>;
