import { useQuery } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { VIOLATION_CONTENT_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { violationDetailResponseSchema, type ViolationDetailResponseDto } from '@nexsoft-admin/models';

const PATH = '/v1/authz/violation/contents';

export async function getViolationContent(id: number): Promise<ViolationDetailResponseDto> {
  const response = await axios.get<unknown>(`${AUTHZ_BASE}${PATH}/${id}`);
  return violationDetailResponseSchema.parse(response.data);
}

export function useViolationContent(id: number) {
  const { data, isPending: loading, error } = useQuery({
    queryKey: [VIOLATION_CONTENT_KEY, { id }],
    queryFn: () => getViolationContent(id),
    enabled: Boolean(id),
  });

  return { data, loading, error };
}
