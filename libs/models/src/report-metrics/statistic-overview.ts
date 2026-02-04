import { z } from 'zod';

export const statisticOverviewSchema = z.object({
  total_transactions: z.number(),
  total_income: z.number(),
  total_value: z.number(),
  total_usdt_revenue: z.number(),
  total_trx_revenue: z.number(),
});

export type StatisticOverviewDto = z.infer<typeof statisticOverviewSchema>;
