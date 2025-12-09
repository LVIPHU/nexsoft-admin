import type { Meta, StoryObj } from '@storybook/react';
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from './menubar';

const meta: Meta<typeof Menubar> = {
  title: 'Organisms/Menubar',
  component: Menubar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Menubar>;

export const Default: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New</MenubarItem>
          <MenubarItem>Open</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
};
