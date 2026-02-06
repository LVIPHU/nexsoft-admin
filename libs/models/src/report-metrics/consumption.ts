import { z } from 'zod';

export const consumptionViewItemSchema = z.object({
  date: z.string(),
  total_delegated_bandwidth: z.number(),
  total_delegated_energy: z.number(),
});

export type ConsumptionViewItemDto = z.infer<typeof consumptionViewItemSchema>;

export const consumptionResponseSchema = z.object({
  view_data: z.array(consumptionViewItemSchema),
});

export type ConsumptionResponseDto = z.infer<typeof consumptionResponseSchema>;
