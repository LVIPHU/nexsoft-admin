import { z } from 'zod';

export const performerSchema = z.object({
  user_address: z.string(),
  total_orders: z.number(),
  total_completed_orders: z.number(),
  total_failed_orders: z.number(),
  total_value: z.number(),
  total_transaction_value: z.number(),
  total_usdt_revenue: z.number(),
  total_trx_revenue: z.number(),
  total_delegated_bandwidth: z.number(),
  total_delegated_energy: z.number(),
});

export type PerformerDto = z.infer<typeof performerSchema>;

export const performersPaginationSchema = z.object({
  TotalRows: z.number(),
  TotalPages: z.number(),
  Limit: z.number(),
  Page: z.number(),
  Data: z.array(performerSchema),
  Sort: z.union([z.string(), z.null()]),
});

export const performersResponseSchema = z.object({
  pagination: performersPaginationSchema,
});

export type PerformersResponseDto = z.infer<typeof performersResponseSchema>;
