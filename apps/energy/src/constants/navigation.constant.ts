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
        href: '/report-metrics',
        title: msg`Report Metrics`,
      },
      {
        id: 'activity-history',
        href: '/activity-history',
        title: msg`Activity History`,
      },
    ],
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
