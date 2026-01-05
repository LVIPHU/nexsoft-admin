import { axios } from '@/libs/axios';
import type { UserDto } from '@nexsoft-admin/models';
import { useQuery } from '@tanstack/react-query';
import { USER_KEY } from '@/constants/query-keys.constant';

interface GetUserParams {
  id: string;
}

export const getUser = async (params: GetUserParams) => {
  const response = await axios.get<UserDto>(`/api/user/user-profile/${params.id}.json`);
  return response.data;
};

export const useUser = (params: GetUserParams) => {
  const {
    error,
    isPending: loading,
    data,
  } = useQuery({
    queryKey: [USER_KEY, params],
    queryFn: () => getUser(params),
  });

  return { user: data, loading, error };
};
