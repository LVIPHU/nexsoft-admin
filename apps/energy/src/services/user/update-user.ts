import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AUTHZ_BASE } from '@/constants/api.constant';
import { USER_KEY, LIST_USER_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';

const PATH = '/v1/authz/user';

interface UpdateUserNamePayload {
  user_id: string;
  name: string;
  admin_id: string;
}

export async function updateUser(id: string, data: UpdateUserNamePayload): Promise<void> {
  await axios.patch(`${AUTHZ_BASE}${PATH}/${id}`, data);
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const {
    error,
    isPending: loading,
    mutateAsync: updateUserFn,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserNamePayload }) => updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [USER_KEY, { id }] });
      queryClient.invalidateQueries({ queryKey: [LIST_USER_KEY] });
    },
  });

  return { updateUser: updateUserFn, loading, error };
}
