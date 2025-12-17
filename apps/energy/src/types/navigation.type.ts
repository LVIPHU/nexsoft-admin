/**
 * Copyright (c) 2025 NEXSOFT. All rights reserved.
 *
 * This source code is proprietary and confidential.
 * Unauthorized copying, distribution, or modification of this file,
 * in whole or in part, is strictly prohibited without prior written consent
 * from NEXSOFT.
 */

import type { MessageDescriptor } from '@lingui/core';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  readonly id: string;
  readonly href: string;
  readonly icon?: LucideIcon;
  readonly title: MessageDescriptor;
  readonly description?: MessageDescriptor;
}

export interface NavSection extends Omit<NavItem, 'description'> {
  readonly isCollapsed?: boolean;
  readonly items?: ReadonlyArray<NavItem>;
}

export type Navigation = ReadonlyArray<NavSection>;
