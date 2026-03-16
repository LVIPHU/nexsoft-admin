import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { VIOLATION_CONTENTS_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { violationListResponseSchema, type ViolationListResponseDto } from '@nexsoft-admin/models';

const PATH = '/v1/authz/violation/contents';

export interface GetViolationContentsParams {
  violation_status?: string;
  priority?: string;
  page: number;
  limit: number;
}

export async function getViolationContents(params: GetViolationContentsParams): Promise<ViolationListResponseDto> {
  const response = await axios.get<unknown>(`${AUTHZ_BASE}${PATH}`, { params });
  return violationListResponseSchema.parse(response.data);
}

export function useViolationContents(
  params: GetViolationContentsParams,
  options?: Omit<UseQueryOptions<ViolationListResponseDto, Error, ViolationListResponseDto>, 'queryKey' | 'queryFn'>,
) {
  const {
    data,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: [VIOLATION_CONTENTS_KEY, params],
    queryFn: () => getViolationContents(params),
    ...options,
  });

  return { data, loading, error };
}
