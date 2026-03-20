import { z } from 'zod';

const violationReportSchema = z.object({
  id: z.number(),
  violation_type: z.string(),
  reason: z.string(),
  status: z.string(),
  created_at: z
    .union([z.string(), z.date()])
    .transform((v) => (v instanceof Date ? v.toISOString() : v))
    .nullable()
    .optional(),
});

const violationReportsPaginationSchema = z.object({
  total_rows: z.number().optional().default(0),
  total_pages: z.number().optional().default(0),
  limit: z.number(),
  page: z.number(),
});

export const violationReportsResponseSchema = z.object({
  data: z.array(violationReportSchema),
  pagination: violationReportsPaginationSchema,
});

export type ViolationReportDto = z.infer<typeof violationReportSchema>;
export type ViolationReportsResponseDto = z.infer<typeof violationReportsResponseSchema>;
