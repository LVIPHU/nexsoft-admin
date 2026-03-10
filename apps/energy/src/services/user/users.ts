import { useQuery } from '@tanstack/react-query';
import { LIST_USER_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import type { Pagination } from '@/types/pagination.type';
import type { UserDto } from '@nexsoft-admin/models';

interface GetUsersParams {
  search?: string;
  status?: Array<string>;
  page: number;
  limit: number;
}

export const getUsers = async (params: GetUsersParams) => {
  const response = await axios.get<{
    data: Array<UserDto>;
    pagination: Pagination;
  }>('/v1/authz/user/users.json', {
    params,
  });
  return response.data;
};

export const useUsers = (params: GetUsersParams) => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: [LIST_USER_KEY, params],
    queryFn: () => getUsers(params),
  });

  return { users: data, loading, error };
};
