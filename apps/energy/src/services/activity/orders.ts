import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { INDEXER_BASE } from '@/constants/api.constant';
import { ORDERS_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { ordersResponseSchema, type OrdersResponseDto } from '@nexsoft-admin/models';

const PATH = '/v1/admin/x402/tron/orders';

export interface GetOrdersParams {
  from: string;
  to: string;
  page: number;
  limit: number;
}

export async function getOrders(params: GetOrdersParams): Promise<OrdersResponseDto> {
  const response = await axios.get<unknown>(`${INDEXER_BASE}${PATH}`, {
    params: {
      from: params.from,
      to: params.to,
      page: params.page,
      limit: params.limit,
    },
  });
  return ordersResponseSchema.parse(response.data);
}

export function useOrders(
  params: GetOrdersParams,
  options?: Omit<UseQueryOptions<OrdersResponseDto, Error, OrdersResponseDto>, 'queryKey' | 'queryFn'>,
) {
  const enabled = options?.enabled !== false && Boolean(params.from && params.to);

  return useQuery({
    queryKey: [ORDERS_KEY, params],
    queryFn: () => getOrders(params),
    enabled,
    ...options,
  });
}
