import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { INDEXER_BASE } from '@/constants/api.constant';
import { ACTIVITY_OVERVIEW_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import {
  activityOverviewSchema,
  type ActivityOverviewDto,
} from '@nexsoft-admin/models';

const PATH = '/v1/admin/x402/tron/activity/overview';

export interface GetActivityOverviewParams {
  from_date: string;
  to_date: string;
}

export async function getActivityOverview(
  params: GetActivityOverviewParams
): Promise<ActivityOverviewDto> {
  const response = await axios.get<unknown>(`${INDEXER_BASE}${PATH}`, {
    params: {
      from_date: params.from_date,
      to_date: params.to_date,
    },
  });
  return activityOverviewSchema.parse(response.data);
}

export function useActivityOverview(
  params: GetActivityOverviewParams,
  options?: Omit<
    UseQueryOptions<ActivityOverviewDto, Error, ActivityOverviewDto>,
    'queryKey' | 'queryFn'
  >
) {
  const enabled =
    options?.enabled !== false &&
    Boolean(params.from_date && params.to_date);

  return useQuery({
    queryKey: [ACTIVITY_OVERVIEW_KEY, params],
    queryFn: () => getActivityOverview(params),
    enabled,
    ...options,
  });
}
