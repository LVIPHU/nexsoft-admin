import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { INDEXER_BASE } from '@/constants/api.constant';
import { STATISTIC_OVERVIEW_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import {
  statisticOverviewSchema,
  type StatisticOverviewDto,
} from '@nexsoft-admin/models';

const PATH = '/v1/admin/x402/tron/report-metrics/statistic-overview';

export interface GetStatisticOverviewParams {
  from_date: string;
  to_date: string;
}

export async function getStatisticOverview(
  params: GetStatisticOverviewParams
): Promise<StatisticOverviewDto> {

  const response = await axios.get<unknown>(`${INDEXER_BASE}${PATH}`, {
    params: {
      from_date: params.from_date,
      to_date: params.to_date,
    },
  });
  return statisticOverviewSchema.parse(response.data);
}

export function useStatisticOverview(
  params: GetStatisticOverviewParams,
  options?: Omit<
    UseQueryOptions<StatisticOverviewDto, Error, StatisticOverviewDto>,
    'queryKey' | 'queryFn'
  >
) {
  const enabled =
    options?.enabled !== false &&
    Boolean(params.from_date && params.to_date);

  return useQuery({
    queryKey: [STATISTIC_OVERVIEW_KEY, params],
    queryFn: () => getStatisticOverview(params),
    enabled,
    ...options,
  });
}
