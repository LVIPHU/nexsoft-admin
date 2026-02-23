import { useMutation, useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { CONFIG_KEY } from '@/constants/query-keys.constant';
import { INDEXER_BASE } from '@/constants/api.constant';
import { axios } from '@/libs/axios';
import { queryClient } from '@/libs/query-client';
import { configResponseSchema, type ConfigResponseDto, type ConfigPayloadDto } from '@nexsoft-admin/models';

const PATH = '/v1/admin/x402/tron/config';

export async function getConfig(): Promise<ConfigResponseDto> {
  const response = await axios.get<unknown>(`${INDEXER_BASE}${PATH}`);
  return configResponseSchema.parse(response.data);
}

export async function updateConfig(payload: ConfigPayloadDto): Promise<void> {
  await axios.post<unknown>(`${INDEXER_BASE}${PATH}`, payload);
}

export function useConfig(
  options?: Omit<UseQueryOptions<ConfigResponseDto, Error, ConfigResponseDto>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [CONFIG_KEY],
    queryFn: getConfig,
    ...options,
  });
}

export function useUpdateConfig() {
  const {
    error,
    isPending: loading,
    mutateAsync: updateConfigFn,
  } = useMutation({
    mutationFn: updateConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONFIG_KEY] });
    },
  });

  return { updateConfig: updateConfigFn, loading, error };
}
