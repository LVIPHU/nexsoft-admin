import { msg } from '@lingui/core/macro';
import { BellIcon, LayoutDashboardIcon, LeafIcon, SettingsIcon, UserIcon, WrenchIcon } from 'lucide-react';

import type { NavItem, Navigation } from '@/types/navigation.type';

export const NAVIGATION_ITEMS: Navigation = [
  {
    id: 'dashboard',
    href: '/dashboard',
    title: msg`Dashboard`,
    icon: LayoutDashboardIcon,
  },
  {
    id: 'energy-management',
    href: '/energy',
    title: msg`Energy Management`,
    icon: LeafIcon,
  },
  {
    id: 'settings',
    href: '/settings',
    title: msg`Settings`,
    icon: SettingsIcon,
  },
];

export const USER_NAVIGATION_ITEMS: Array<NavItem> = [
  {
    id: 'profile',
    href: '/settings/profile',
    title: msg`Profile`,
    icon: UserIcon,
  },
  {
    id: 'notifications',
    href: '/notifications',
    title: msg`Notifications`,
    icon: BellIcon,
  },
];

export const SETTINGS_NAVIGATION_ITEMS: Array<NavItem> = [
  {
    id: 'general',
    href: '/settings/general',
    title: msg`General`,
    icon: WrenchIcon,
  },
  {
    id: 'profile',
    href: '/settings/profile',
    title: msg`Profile`,
    icon: UserIcon,
  },
];
