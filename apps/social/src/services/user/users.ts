import { useQuery } from '@tanstack/react-query';
import { LIST_USER_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { usersListResponseSchema } from '@nexsoft-admin/models';

interface GetUsersParams {
  keyword?: string;
  sort?: string;
  page: number;
  limit: number;
}

export const getUsers = async (params: GetUsersParams) => {
  const response = await axios.get('/v1/authz/user', {
    params,
  });
  return usersListResponseSchema.parse(response.data);
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
