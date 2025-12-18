import { useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { useEffect } from 'react';
import { PROFILE_KEY } from '@/constants/query-keys.constant';
import { axios } from '@/libs/axios';
import { useProfileStore } from '@/stores/profile.store';
import type { ProfileDto } from '@nexsoft-admin/models';

export const getProfile = async () => {
  const response = await axios.get<ProfileDto, AxiosResponse<ProfileDto>>('/v1/authz/auth/get-admin-profile.json');
  return response.data;
};

export const useProfile = () => {
  const setProfile = useProfileStore((state) => state.setProfile);

  const {
    error,
    isPending: loading,
    data: profile,
  } = useQuery({
    queryKey: [PROFILE_KEY],
    queryFn: getProfile,
  });

  useEffect(() => {
    setProfile(profile ?? null);
  }, [profile, setProfile]);

  return { profile: profile, loading, error };
};
