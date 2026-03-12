import { axios } from '@/libs/axios';
import { userDetailResponseSchema, type UserDto } from '@nexsoft-admin/models';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { USER_KEY } from '@/constants/query-keys.constant';

interface GetUserParams {
  id: string;
}

export const getUser = async (params: GetUserParams) => {
  const response = await axios.get(`/v1/authz/user/${params.id}`);
  return userDetailResponseSchema.parse(response.data).user;
};

export const useUser = (params: GetUserParams, options?: Omit<UseQueryOptions<UserDto>, 'queryKey' | 'queryFn'>) => {
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
};
