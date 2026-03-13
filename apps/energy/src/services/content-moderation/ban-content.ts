import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { VIOLATION_CONTENT_KEY, VIOLATION_CONTENTS_KEY, VIOLATION_STATISTIC_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';

const PATH = '/v1/authz/violation/contents';

export async function banContent(id: number): Promise<void> {
  await axios.post(`${AUTHZ_BASE}${PATH}/${id}/ban`);
}

export function useBanContent() {
  const queryClient = useQueryClient();
  const { isPending: loading, error, mutateAsync: banContentFn } = useMutation({
    mutationFn: (id: number) => banContent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [VIOLATION_CONTENT_KEY, { id }] });
      queryClient.invalidateQueries({ queryKey: [VIOLATION_CONTENTS_KEY] });
      queryClient.invalidateQueries({ queryKey: [VIOLATION_STATISTIC_KEY] });
    },
  });

  return { banContent: banContentFn, loading, error };
}
