import { useQuery } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { LIST_USER_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { usersListResponseSchema, type UsersListResponseDto } from '@nexsoft-admin/models';

const PATH = '/v1/authz/user';

export interface GetUsersParams {
  keyword?: string;
  sort?: string;
  page: number;
  limit: number;
}

export async function getUsers(params: GetUsersParams): Promise<UsersListResponseDto> {
  const response = await axios.get<unknown>(`${AUTHZ_BASE}${PATH}`, { params });
  return usersListResponseSchema.parse(response.data);
}

export function useUsers(params: GetUsersParams) {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: [LIST_USER_KEY, params],
    queryFn: () => getUsers(params),
  });

  return { users: data, loading, error };
}
