import { z } from 'zod';

export const violationTopicSchema = z.enum([
  'Spam_Or_Scam',
  'Harassment_Or_Bullying',
  'HateSpeech_Or_Discrimination',
  'Nudity_Or_Sexual_Content',
  'Violence_Or_Harmful_Content',
]);

export const violationStatusSchema = z.enum(['PENDING', 'BYPASS', 'BAN']);

export const violationPrioritySchema = z.enum(['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW']);

export const violationContentTypeSchema = z.enum(['POST', 'COMMENT']);

export const violationSummarySchema = z.object({
  violation_type: z.string(),
  total: z.number(),
});

export const violationContentSchema = z.object({
  id: z.number(),
  type: z.string(),
  content: z
    .string()
    .nullish()
    .transform((v) => v ?? ''),
  violation_status: z.string(),
  number_of_violations: z.number(),
  priority: z.string(),
  created_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)),
  updated_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)),
});

export type ViolationTopicDto = z.infer<typeof violationTopicSchema>;
export type ViolationStatusDto = z.infer<typeof violationStatusSchema>;
export type ViolationPriorityDto = z.infer<typeof violationPrioritySchema>;
export type ViolationSummaryDto = z.infer<typeof violationSummarySchema>;
export type ViolationContentDto = z.infer<typeof violationContentSchema>;
