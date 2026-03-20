import { msg } from '@lingui/core/macro';
import { BellIcon, FuelIcon, ShieldAlertIcon, UserIcon, UsersIcon, WrenchIcon } from 'lucide-react';

import type { NavItem, Navigation } from '@/types/navigation.type';

export const NAVIGATION_ITEMS: Navigation = [
  // {
  //   id: 'dashboard',
  //   href: '/dashboard',
  //   title: msg`Dashboard`,
  //   icon: LayoutDashboardIcon,
  // },
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
      {
        id: 'setting',
        href: '/gas-management/setting',
        title: msg`Setting`,
      },
    ],
  },
  {
    id: 'social-manager',
    title: msg`Social Manager`,
    icon: UsersIcon,
    items: [
      {
        id: 'user-management',
        href: '/social-manager/user-management',
        title: msg`User Management`,
      },
      {
        id: 'content-moderation',
        href: '/social-manager/content-moderation',
        title: msg`Content Moderation`,
        icon: ShieldAlertIcon,
      },
      {
        id: 'moderation-keywords',
        href: '/social-manager/moderation-keywords',
        title: msg`Moderation Keywords`,
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
