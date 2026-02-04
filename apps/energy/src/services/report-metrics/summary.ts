import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { INDEXER_BASE } from '@/constants/api.constant';
import { SUMMARY_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { summarySchema, type SummaryDto } from '@nexsoft-admin/models';

const PATH = '/v1/admin/x402/tron/report-metrics/summary';

export interface GetSummaryParams {
  from_date: string;
  to_date: string;
}

export async function getSummary(
  params: GetSummaryParams
): Promise<SummaryDto> {
  const response = await axios.get<unknown>(`${INDEXER_BASE}${PATH}`, {
    params: {
      from_date: params.from_date,
      to_date: params.to_date,
    },
  });
  return summarySchema.parse(response.data);
}

export function useSummary(
  params: GetSummaryParams,
  options?: Omit<
    UseQueryOptions<SummaryDto, Error, SummaryDto>,
    'queryKey' | 'queryFn'
  >
) {
  const enabled =
    options?.enabled !== false &&
    Boolean(params.from_date && params.to_date);

  return useQuery({
    queryKey: [SUMMARY_KEY, params],
    queryFn: () => getSummary(params),
    enabled,
    ...options,
  });
}
