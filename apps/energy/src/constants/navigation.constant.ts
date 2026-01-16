import { msg } from '@lingui/core/macro';
import { BellIcon, FuelIcon, LayoutDashboardIcon, SettingsIcon, UserIcon, WrenchIcon } from 'lucide-react';

import type { NavItem, Navigation } from '@/types/navigation.type';

export const NAVIGATION_ITEMS: Navigation = [
  {
    id: 'dashboard',
    href: '/dashboard',
    title: msg`Dashboard`,
    icon: LayoutDashboardIcon,
  },
  {
    id: 'gas-management',
    title: msg`Gas Management`,
    icon: FuelIcon,
    items: [
      {
        id: 'report-metrics',
        href: '/gas-management/report-metrics',
        title: msg`Report Metrics`,
      },
      {
        id: 'activity-history',
        href: '/gas-management/activity-history',
        title: msg`Activity History`,
      },
    ],
  },
  {
    id: 'account-management',
    title: msg`Account Management`,
    icon: SettingsIcon,
    items: [
      {
        id: 'my-account',
        href: '/account-management/my-account',
        title: msg`My Account`,
      },
      {
        id: 'admin-management',
        href: '/account-management/admin-management',
        title: msg`Admin Management`,
      },
      {
        id: 'roles-and-permissions',
        href: '/account-management/roles-and-permissions',
        title: msg`Roles & Permissions`,
      },
    ],
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
    href: '/settings',
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
