import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { INDEXER_BASE } from '@/constants/api.constant';
import { PERFORMERS_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { performersResponseSchema, type PerformersResponseDto } from '@nexsoft-admin/models';

const PATH = '/v1/admin/x402/tron/report-metrics/performers';

export interface GetPerformersParams {
  from_date: string;
  to_date: string;
  limit?: number;
  page?: number;
}

export async function getPerformers(params: GetPerformersParams): Promise<PerformersResponseDto> {
  const response = await axios.get<unknown>(`${INDEXER_BASE}${PATH}`, {
    params: {
      from_date: params.from_date,
      to_date: params.to_date,
      ...(params.limit != null && { limit: params.limit }),
      ...(params.page != null && { page: params.page }),
    },
  });
  return performersResponseSchema.parse(response.data);
}

export function usePerformers(
  params: GetPerformersParams,
  options?: Omit<UseQueryOptions<PerformersResponseDto, Error, PerformersResponseDto>, 'queryKey' | 'queryFn'>,
) {
  const enabled = options?.enabled !== false && Boolean(params.from_date && params.to_date);

  return useQuery({
    queryKey: [PERFORMERS_KEY, params],
    queryFn: () => getPerformers(params),
    enabled,
    ...options,
  });
}
