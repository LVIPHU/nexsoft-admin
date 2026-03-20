import { useQuery } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { MODERATION_LANGUAGES_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { moderationLanguageListResponseSchema, type ModerationLanguageListResponseDto } from '@nexsoft-admin/models';

const PATH = '/v1/authz/violation/moderation/languages';

export async function getModerationLanguages(): Promise<ModerationLanguageListResponseDto> {
  const response = await axios.get<unknown>(`${AUTHZ_BASE}${PATH}`);
  return moderationLanguageListResponseSchema.parse(response.data);
}

export function useModerationLanguages() {
  const {
    data,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: [MODERATION_LANGUAGES_KEY],
    queryFn: getModerationLanguages,
    staleTime: 1000 * 60 * 10, // languages rarely change
  });

  return { data, loading, error };
}
