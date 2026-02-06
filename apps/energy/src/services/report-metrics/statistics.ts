import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { INDEXER_BASE } from '@/constants/api.constant';
import { STATISTICS_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { statisticsResponseSchema, type StatisticsResponseDto } from '@nexsoft-admin/models';

const PATH = '/v1/admin/x402/tron/report-metrics/statistics';

export interface GetStatisticsParams {
  from_date: string;
  to_date: string;
}

export async function getStatistics(params: GetStatisticsParams): Promise<StatisticsResponseDto> {
  const response = await axios.get<unknown>(`${INDEXER_BASE}${PATH}`, {
    params: {
      from_date: params.from_date,
      to_date: params.to_date,
    },
  });
  return statisticsResponseSchema.parse(response.data);
}

export function useStatistics(
  params: GetStatisticsParams,
  options?: Omit<UseQueryOptions<StatisticsResponseDto, Error, StatisticsResponseDto>, 'queryKey' | 'queryFn'>,
) {
  const enabled = options?.enabled !== false && Boolean(params.from_date && params.to_date);

  return useQuery({
    queryKey: [STATISTICS_KEY, params],
    queryFn: () => getStatistics(params),
    enabled,
    ...options,
  });
}
