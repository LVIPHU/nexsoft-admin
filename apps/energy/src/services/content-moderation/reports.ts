import { useQuery } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { VIOLATION_REPORTS_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { violationReportsResponseSchema, type ViolationReportsResponseDto } from '@nexsoft-admin/models';

const PATH = '/v1/authz/violation/reports';

export async function getViolationReports(params: {
  violation_content_id: number;
  page: number;
  limit: number;
}): Promise<ViolationReportsResponseDto> {
  const response = await axios.get<unknown>(`${AUTHZ_BASE}${PATH}`, {
    params: {
      violation_content_id: params.violation_content_id,
      page: params.page,
      limit: params.limit,
    },
  });
  return violationReportsResponseSchema.parse(response.data);
}

export function useViolationReports(violationContentId: number, page: number = 1) {
  const {
    data,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: [VIOLATION_REPORTS_KEY, violationContentId, page],
    queryFn: () => getViolationReports({ violation_content_id: violationContentId, page, limit: 10 }),
    enabled: !!violationContentId,
  });
  return { data, loading, error };
}
