import { z } from 'zod';

export const violationStatisticSchema = z.object({
  total_high: z.number(),
  total_ban: z.number(),
  total_bypass: z.number(),
  total_pending: z.number(),
});

export type ViolationStatisticDto = z.infer<typeof violationStatisticSchema>;
