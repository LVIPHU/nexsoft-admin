import { z } from 'zod';

const usdtPaymentSchema = z.object({
  basic_fee_usdt: z.number(),
  advance_fee_usdt: z.number(),
});

const trxPaymentUsdtSchema = z.object({
  basic_fee_usdt: z.number(),
  advance_fee_usdt: z.number(),
});

const transferUsdtSchema = z.object({
  usdt_payment: usdtPaymentSchema,
  trx_payment: trxPaymentUsdtSchema,
});

const usdtPaymentTrxSchema = z.object({
  service_fee: z.number(),
  advance_fee: z.number(),
});

const trxPaymentTrxSchema = z.object({
  fee_trx_amount: z.number(),
});

const transferTrxSchema = z.object({
  usdt_payment: usdtPaymentTrxSchema,
  trx_payment: trxPaymentTrxSchema,
});

const configDataSchema = z.object({
  transfer_usdt: transferUsdtSchema,
  transfer_trx: transferTrxSchema,
});

/** GET /v1/admin/x402/tron/config response */
export const configResponseSchema = z.object({
  Config: configDataSchema,
});

/** PUT body: same shape as configDataSchema (no Config wrapper) */
export const configPayloadSchema = configDataSchema;

export type ConfigResponseDto = z.infer<typeof configResponseSchema>;
export type ConfigPayloadDto = z.infer<typeof configPayloadSchema>;
