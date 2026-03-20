import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { MODERATION_KEYWORDS_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import {
  moderationKeywordListResponseSchema,
  type ModerationKeywordListResponseDto,
  type SaveModerationKeywordPayload,
} from '@nexsoft-admin/models';

const PATH = '/v1/authz/violation/moderation/keywords';

export interface GetModerationKeywordsParams {
  topic?: string;
  page: number;
  limit: number;
}

export async function getModerationKeywords(
  params: GetModerationKeywordsParams,
): Promise<ModerationKeywordListResponseDto> {
  const response = await axios.get<unknown>(`${AUTHZ_BASE}${PATH}`, { params });
  return moderationKeywordListResponseSchema.parse(response.data);
}

export function useModerationKeywords(
  params: GetModerationKeywordsParams,
  options?: Omit<
    UseQueryOptions<ModerationKeywordListResponseDto, Error, ModerationKeywordListResponseDto>,
    'queryKey' | 'queryFn'
  >,
) {
  const {
    data,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: [MODERATION_KEYWORDS_KEY, params],
    queryFn: () => getModerationKeywords(params),
    ...options,
  });

  return { data, loading, error };
}

export async function saveModerationKeyword(body: SaveModerationKeywordPayload): Promise<{ id: number }> {
  const response = await axios.post<{ id: number }>(`${AUTHZ_BASE}${PATH}`, body);
  return response.data;
}

export function useSaveModerationKeyword() {
  const queryClient = useQueryClient();
  const {
    isPending: loading,
    error,
    mutateAsync: saveModerationKeywordFn,
  } = useMutation({
    mutationFn: (body: SaveModerationKeywordPayload) => saveModerationKeyword(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MODERATION_KEYWORDS_KEY] });
    },
  });

  return { saveModerationKeyword: saveModerationKeywordFn, loading, error };
}
