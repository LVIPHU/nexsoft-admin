import { z } from 'zod';

export const viewDataItemSchema = z.object({
  date: z.string(),
  total_usdt_revenue: z.number(),
  total_trx_revenue: z.number(),
  total_value: z.number(),
});

export type ViewDataItemDto = z.infer<typeof viewDataItemSchema>;

export const statisticsResponseSchema = z.object({
  view_data: z.array(viewDataItemSchema),
});

export type StatisticsResponseDto = z.infer<typeof statisticsResponseSchema>;
