import { z } from 'zod';

export const moderationKeywordSchema = z.object({
  id: z.number(),
  keyword: z.string(),
  lang_code: z.string(),
  is_active: z.boolean(),
  topics: z.array(z.string()),
});

export const moderationKeywordPaginationSchema = z.object({
  total_rows: z.number().catch(0),
  total_pages: z.number().catch(0),
  limit: z.number(),
  page: z.number(),
});

export const moderationKeywordListResponseSchema = z.object({
  data: z.array(moderationKeywordSchema),
  pagination: moderationKeywordPaginationSchema,
});

export const moderationLanguageSchema = z.object({
  id: z.number(),
  lang_code: z.string(),
  text: z.string(),
  order: z.number(),
});

export const moderationLanguageListResponseSchema = z.object({
  data: z.array(moderationLanguageSchema),
});

export const saveModerationKeywordSchema = z.object({
  keyword: z.string().min(1),
  lang_code: z.string().min(1),
  topics: z.array(z.string()).min(1),
  is_active: z.boolean(),
});

export type ModerationKeywordDto = z.infer<typeof moderationKeywordSchema>;
export type ModerationKeywordListResponseDto = z.infer<typeof moderationKeywordListResponseSchema>;
export type ModerationLanguageDto = z.infer<typeof moderationLanguageSchema>;
export type ModerationLanguageListResponseDto = z.infer<typeof moderationLanguageListResponseSchema>;
export type SaveModerationKeywordDto = z.infer<typeof saveModerationKeywordSchema>;
export type SaveModerationKeywordPayload = SaveModerationKeywordDto & { id?: number };
