import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { USER_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { userDetailResponseSchema, type UserDto } from '@nexsoft-admin/models';

const PATH = '/v1/authz/user';

export interface GetUserParams {
  id: string;
}

export async function getUser(params: GetUserParams): Promise<UserDto> {
  const response = await axios.get<unknown>(`${AUTHZ_BASE}${PATH}/${params.id}`);
  return userDetailResponseSchema.parse(response.data).user;
}

export function useUser(params: GetUserParams, options?: Omit<UseQueryOptions<UserDto>, 'queryKey' | 'queryFn'>) {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: [USER_KEY, params],
    queryFn: () => getUser(params),
    ...options,
  });

  return { user: data, loading, error };
}
