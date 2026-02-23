import { z } from 'zod';

export const orderSchema = z.object({
  id: z.number(),
  delegated_bandwidth: z.number(),
  delegated_energy: z.number(),
  from_address: z.string(),
  to_address: z.string(),
  amount: z.string(),
  token_address: z.string(),
  amount_type: z.string(),
  payment_type: z.string(),
  created_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)),
  updated_at: z.union([z.string(), z.date()]).transform((v) => (v instanceof Date ? v.toISOString() : v)),
  deleted_at: z
    .union([z.string(), z.date()])
    .nullable()
    .transform((v) => (v instanceof Date ? v.toISOString() : v)),
  expired_at: z
    .union([z.string(), z.date()])
    .nullable()
    .transform((v) => (v instanceof Date ? v.toISOString() : v)),
  status: z.string(),
  approval_payment_transaction: z.record(z.string(), z.unknown()).nullable(),
  transfer_payment_transaction: z.record(z.string(), z.unknown()).nullable(),
  user_transaction_hash: z.string(),
  delegate_status: z.string(),
  step: z.string(),
  reclaim_source: z.string(),
  total_charge: z.number(),
  list_transactions: z.unknown().nullable(),
});

export type OrderDto = z.infer<typeof orderSchema>;

export const ordersPaginationSchema = z.object({
  total_rows: z.number(),
  total_pages: z.number(),
  limit: z.number(),
  page: z.number(),
  data: z.array(orderSchema).optional(),
  sort: z.union([z.string(), z.null()]),
});

export const ordersResponseSchema = z.object({
  pagination: ordersPaginationSchema,
});

export type OrdersResponseDto = z.infer<typeof ordersResponseSchema>;
