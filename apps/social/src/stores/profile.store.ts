import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ProfileDto } from '@nexsoft-admin/models';

type ProfileState = {
  profile: ProfileDto | null;
};

type ProfileActions = {
  setProfile: (profile: ProfileDto | null) => void;
};

export const useProfileStore = create<ProfileState & ProfileActions>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => {
        set({ profile });
      },
    }),
    { name: 'profile' },
  ),
);
