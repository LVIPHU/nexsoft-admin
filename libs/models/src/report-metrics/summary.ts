import { z } from 'zod';

export const bandwidthInfoSchema = z.object({
  total_bandwidth: z.number(),
  total_bandwidth_remaining: z.number(),
  from_staking: z.number(),
  delegated_by_others: z.number(),
  delegated_to_others: z.number(),
  free_bandwidth_remaining: z.number(),
});

export const energyInfoSchema = z.object({
  total_energy: z.number(),
  total_energy_remaining: z.number(),
  from_staking: z.number(),
  delegated_by_others: z.number(),
  delegated_to_others: z.number(),
});

export const summarySchema = z.object({
  total_delegated_bandwidth: z.number(),
  total_delegated_energy: z.number(),
  bandwidth_info: bandwidthInfoSchema,
  energy_info: energyInfoSchema,
});

export type SummaryDto = z.infer<typeof summarySchema>;
