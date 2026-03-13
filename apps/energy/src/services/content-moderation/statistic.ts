import { useQuery } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { VIOLATION_STATISTIC_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { violationStatisticSchema, type ViolationStatisticDto } from '@nexsoft-admin/models';

const PATH = '/v1/authz/violation/statistic';

export async function getViolationStatistic(): Promise<ViolationStatisticDto> {
  const response = await axios.get<unknown>(`${AUTHZ_BASE}${PATH}`);
  return violationStatisticSchema.parse(response.data);
}

export function useViolationStatistic() {
  const { data, isPending: loading, error } = useQuery({
    queryKey: [VIOLATION_STATISTIC_KEY],
    queryFn: getViolationStatistic,
  });

  return { data, loading, error };
}
