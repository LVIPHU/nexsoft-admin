import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { INDEXER_BASE } from '@/constants/api.constant';
import { CONSUMPTION_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import {
  consumptionResponseSchema,
  type ConsumptionResponseDto,
} from '@nexsoft-admin/models';

const PATH = '/v1/admin/x402/tron/report-metrics/consumption';

export interface GetConsumptionParams {
  from_date: string;
  to_date: string;
}

export async function getConsumption(
  params: GetConsumptionParams
): Promise<ConsumptionResponseDto> {
  const response = await axios.get<unknown>(`${INDEXER_BASE}${PATH}`, {
    params: {
      from_date: params.from_date,
      to_date: params.to_date,
    },
  });
  return consumptionResponseSchema.parse(response.data);
}

export function useConsumption(
  params: GetConsumptionParams,
  options?: Omit<
    UseQueryOptions<ConsumptionResponseDto, Error, ConsumptionResponseDto>,
    'queryKey' | 'queryFn'
  >
) {
  const enabled =
    options?.enabled !== false &&
    Boolean(params.from_date && params.to_date);

  return useQuery({
    queryKey: [CONSUMPTION_KEY, params],
    queryFn: () => getConsumption(params),
    enabled,
    ...options,
  });
}
