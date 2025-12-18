import { msg } from '@lingui/core/macro';

// Sidebar Variant
export const SIDEBAR_VARIANT_OPTIONS = [
  { label: msg`Inset`, value: 'inset' },
  { label: msg`Sidebar`, value: 'sidebar' },
  { label: msg`Floating`, value: 'floating' },
] as const;
export const SIDEBAR_VARIANT_VALUES = SIDEBAR_VARIANT_OPTIONS.map((v) => v.value);
export type SidebarVariant = (typeof SIDEBAR_VARIANT_VALUES)[number];

// Sidebar Collapsible
export const SIDEBAR_COLLAPSIBLE_OPTIONS = [
  { label: msg`Icon`, value: 'icon' },
  { label: msg`Off canvas`, value: 'offcanvas' },
] as const;
export const SIDEBAR_COLLAPSIBLE_VALUES = SIDEBAR_COLLAPSIBLE_OPTIONS.map((v) => v.value);
export type SidebarCollapsible = (typeof SIDEBAR_COLLAPSIBLE_VALUES)[number];

// Navbar Style
export const NAVBAR_STYLE_OPTIONS = [
  { label: msg`Sticky`, value: 'sticky' },
  { label: msg`Scroll`, value: 'scroll' },
] as const;
export const NAVBAR_STYLE_VALUES = NAVBAR_STYLE_OPTIONS.map((v) => v.value);
export type NavbarStyle = (typeof NAVBAR_STYLE_VALUES)[number];
