import { z } from 'zod';

import { violationContentSchema } from './violation.js';

export const violationListPaginationSchema = z.object({
  total_rows: z.number(),
  total_pages: z.number(),
  limit: z.number(),
  page: z.number(),
  sort: z.unknown().optional(),
});

export const violationListResponseSchema = z.object({
  data: z.array(violationContentSchema),
  pagination: violationListPaginationSchema,
});

export type ViolationListPaginationDto = z.infer<typeof violationListPaginationSchema>;
export type ViolationListResponseDto = z.infer<typeof violationListResponseSchema>;
