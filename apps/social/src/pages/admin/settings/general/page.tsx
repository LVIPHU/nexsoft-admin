import { useLingui } from '@lingui/react';
import { Label } from '@nexsoft-admin/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@nexsoft-admin/ui/toggle-group';
import { Separator } from '@nexsoft-admin/ui/separator';
import {
  NAVBAR_STYLE_OPTIONS,
  SIDEBAR_COLLAPSIBLE_OPTIONS,
  SIDEBAR_VARIANT_OPTIONS,
  NavbarStyle,
  SidebarCollapsible,
  SidebarVariant,
} from '@/constants/layout.constant';
import { useLayoutStore } from '@/stores/layout.store';
import { Trans } from '@lingui/react/macro';
import { H4 } from '../../_components/heading';

function GeneralPage() {
  const { i18n } = useLingui();
  const { sidebarVariant, sidebarCollapsible, navbarStyle, setSidebarVariant, setSidebarCollapsible, setNavbarStyle } =
    useLayoutStore((state) => state);
  return (
    <div className='flex flex-1 flex-col gap-6'>
      <div>
        <H4>
          <Trans>General</Trans>
        </H4>
        <p className='text-muted-foreground text-sm'>
          <Trans>Settings and options for your application</Trans>
        </p>
      </div>
      <Separator />
      <div className='flex flex-col'>
        <div className='flex flex-col justify-between gap-y-4 lg:flex-row'>
          <div>
            <Label className='font-medium'>
              <Trans>Sidebar Variant</Trans>
            </Label>
            <p className='text-muted-foreground text-[0.8rem]'>
              <Trans>Set the sidebar variant you want to use in the dashboard.</Trans>
            </p>
          </div>
          <ToggleGroup
            className='**:data-[slot=toggle-group-item]:flex-1'
            variant='outline'
            type='single'
            value={sidebarVariant}
            onValueChange={(value) => setSidebarVariant(value as SidebarVariant)}
          >
            {SIDEBAR_VARIANT_OPTIONS.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={`Toggle ${option.value}`}
                className='cursor-pointer'
              >
                {i18n._(option.label)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <Separator className='my-6' />
        <div className='flex flex-col justify-between gap-y-4 lg:flex-row'>
          <div>
            <Label className='font-medium'>
              <Trans>Navbar Style</Trans>
            </Label>
            <p className='text-muted-foreground text-[0.8rem]'>
              <Trans>Set the navbar style you want to use in the dashboard.</Trans>
            </p>
          </div>
          <ToggleGroup
            className='**:data-[slot=toggle-group-item]:flex-1'
            variant='outline'
            type='single'
            value={navbarStyle}
            onValueChange={(value) => setNavbarStyle(value as NavbarStyle)}
          >
            {NAVBAR_STYLE_OPTIONS.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={`Toggle ${option.value}`}
                className='cursor-pointer'
              >
                {i18n._(option.label)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <Separator className='my-6' />
        <div className='flex flex-col justify-between gap-y-4 lg:flex-row'>
          <div>
            <Label className='font-medium'>
              <Trans>Sidebar Collapsible</Trans>
            </Label>
            <p className='text-muted-foreground text-[0.8rem]'>
              <Trans>Set the sidebar collapsible you want to use in the dashboard.</Trans>
            </p>
          </div>
          <ToggleGroup
            className='**:data-[slot=toggle-group-item]:flex-1'
            variant='outline'
            type='single'
            value={sidebarCollapsible}
            onValueChange={(value) => setSidebarCollapsible(value as SidebarCollapsible)}
          >
            {SIDEBAR_COLLAPSIBLE_OPTIONS.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={`Toggle ${option.value}`}
                className='cursor-pointer'
              >
                {i18n._(option.label)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}

export { GeneralPage };
