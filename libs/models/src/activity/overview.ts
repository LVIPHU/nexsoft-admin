import { z } from 'zod';

export const statusCountItemSchema = z.object({
  status: z.string(),
  total: z.number(),
});

export type StatusCountItemDto = z.infer<typeof statusCountItemSchema>;

export const activityOverviewSchema = z.object({
  total_request: z.number(),
  status_count: z.array(statusCountItemSchema),
});

export type ActivityOverviewDto = z.infer<typeof activityOverviewSchema>;
