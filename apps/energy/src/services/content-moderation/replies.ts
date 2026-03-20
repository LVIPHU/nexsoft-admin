import { useQuery } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { VIOLATION_REPLIES_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { violationRepliesResponseSchema, type ViolationRepliesResponseDto } from '@nexsoft-admin/models';

const PATH = '/v1/authz/violation/replies';

export async function getViolationReplies(params: {
  post_id: number;
  page: number;
  limit: number;
}): Promise<ViolationRepliesResponseDto> {
  const response = await axios.post<unknown>(`${AUTHZ_BASE}${PATH}`, {
    post_id: params.post_id,
    limit: params.limit,
    page: params.page,
    sort: { created_at: 'DESC' },
  });
  return violationRepliesResponseSchema.parse(response.data);
}

export function useViolationReplies(postId: number, page: number = 1) {
  const {
    data,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: [VIOLATION_REPLIES_KEY, postId, page],
    queryFn: () => getViolationReplies({ post_id: postId, page, limit: 10 }),
    enabled: !!postId,
  });

  return { data, loading, error };
}
