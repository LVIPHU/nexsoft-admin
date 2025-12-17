import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NavbarStyle, SidebarCollapsible, SidebarVariant } from '@/constants/layout.constant';

type layoutState = {
  sidebarVariant: SidebarVariant
  sidebarCollapsible: SidebarCollapsible
  navbarStyle: NavbarStyle
}

type layoutActions = {
  setSidebarVariant: (variant: SidebarVariant) => void
  setSidebarCollapsible: (collapsible: SidebarCollapsible) => void
  setNavbarStyle: (style: NavbarStyle) => void
}

export const useLayoutStore = create<layoutState & layoutActions>()(

);
