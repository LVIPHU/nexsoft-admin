import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Organisms/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Default active tab value',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Tab orientation',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue='account'>
      <TabsList>
        <TabsTrigger value='account'>Account</TabsTrigger>
        <TabsTrigger value='password'>Password</TabsTrigger>
        <TabsTrigger value='settings'>Settings</TabsTrigger>
      </TabsList>
      <TabsContent value='account' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Account Settings</h3>
          <p className='text-muted-foreground text-sm'>Manage your account settings and preferences here.</p>
        </div>
      </TabsContent>
      <TabsContent value='password' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Password</h3>
          <p className='text-muted-foreground text-sm'>Change your password and security settings.</p>
        </div>
      </TabsContent>
      <TabsContent value='settings' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Settings</h3>
          <p className='text-muted-foreground text-sm'>Configure your application settings.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Tabs defaultValue='overview'>
      <TabsList>
        <TabsTrigger value='overview'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect width='18' height='18' x='3' y='3' rx='2' />
            <path d='M3 9h18' />
            <path d='M9 21V9' />
          </svg>
          Overview
        </TabsTrigger>
        <TabsTrigger value='analytics'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M3 3v18h18' />
            <path d='m19 9-5 5-4-4-3 3' />
          </svg>
          Analytics
        </TabsTrigger>
        <TabsTrigger value='reports'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
            <path d='M14 2v6h6' />
            <path d='M16 13H8' />
            <path d='M16 17H8' />
            <path d='M10 9H8' />
          </svg>
          Reports
        </TabsTrigger>
      </TabsList>
      <TabsContent value='overview' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Overview</h3>
          <p className='text-muted-foreground text-sm'>View your dashboard overview and key metrics.</p>
        </div>
      </TabsContent>
      <TabsContent value='analytics' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Analytics</h3>
          <p className='text-muted-foreground text-sm'>Detailed analytics and performance metrics.</p>
        </div>
      </TabsContent>
      <TabsContent value='reports' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Reports</h3>
          <p className='text-muted-foreground text-sm'>Generate and download reports.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue='account' orientation='vertical' className='flex gap-4'>
      <TabsList className='h-fit flex-col'>
        <TabsTrigger value='account'>Account</TabsTrigger>
        <TabsTrigger value='password'>Password</TabsTrigger>
        <TabsTrigger value='settings'>Settings</TabsTrigger>
        <TabsTrigger value='notifications'>Notifications</TabsTrigger>
      </TabsList>
      <div className='flex-1'>
        <TabsContent value='account' className='mt-0'>
          <div className='rounded-lg border p-6'>
            <h3 className='mb-2 text-lg font-semibold'>Account Settings</h3>
            <p className='text-muted-foreground text-sm'>Manage your account settings and preferences here.</p>
          </div>
        </TabsContent>
        <TabsContent value='password' className='mt-0'>
          <div className='rounded-lg border p-6'>
            <h3 className='mb-2 text-lg font-semibold'>Password</h3>
            <p className='text-muted-foreground text-sm'>Change your password and security settings.</p>
          </div>
        </TabsContent>
        <TabsContent value='settings' className='mt-0'>
          <div className='rounded-lg border p-6'>
            <h3 className='mb-2 text-lg font-semibold'>Settings</h3>
            <p className='text-muted-foreground text-sm'>Configure your application settings.</p>
          </div>
        </TabsContent>
        <TabsContent value='notifications' className='mt-0'>
          <div className='rounded-lg border p-6'>
            <h3 className='mb-2 text-lg font-semibold'>Notifications</h3>
            <p className='text-muted-foreground text-sm'>Manage your notification preferences.</p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue='tab1'>
      <TabsList className='w-full justify-start overflow-x-auto'>
        <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
        <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
        <TabsTrigger value='tab3'>Tab 3</TabsTrigger>
        <TabsTrigger value='tab4'>Tab 4</TabsTrigger>
        <TabsTrigger value='tab5'>Tab 5</TabsTrigger>
        <TabsTrigger value='tab6'>Tab 6</TabsTrigger>
        <TabsTrigger value='tab7'>Tab 7</TabsTrigger>
      </TabsList>
      <TabsContent value='tab1' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Tab 1 Content</h3>
          <p className='text-muted-foreground text-sm'>Content for tab 1</p>
        </div>
      </TabsContent>
      <TabsContent value='tab2' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Tab 2 Content</h3>
          <p className='text-muted-foreground text-sm'>Content for tab 2</p>
        </div>
      </TabsContent>
      <TabsContent value='tab3' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Tab 3 Content</h3>
          <p className='text-muted-foreground text-sm'>Content for tab 3</p>
        </div>
      </TabsContent>
      <TabsContent value='tab4' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Tab 4 Content</h3>
          <p className='text-muted-foreground text-sm'>Content for tab 4</p>
        </div>
      </TabsContent>
      <TabsContent value='tab5' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Tab 5 Content</h3>
          <p className='text-muted-foreground text-sm'>Content for tab 5</p>
        </div>
      </TabsContent>
      <TabsContent value='tab6' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Tab 6 Content</h3>
          <p className='text-muted-foreground text-sm'>Content for tab 6</p>
        </div>
      </TabsContent>
      <TabsContent value='tab7' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Tab 7 Content</h3>
          <p className='text-muted-foreground text-sm'>Content for tab 7</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue='active'>
      <TabsList>
        <TabsTrigger value='active'>Active Tab</TabsTrigger>
        <TabsTrigger value='disabled' disabled>
          Disabled Tab
        </TabsTrigger>
        <TabsTrigger value='another'>Another Tab</TabsTrigger>
      </TabsList>
      <TabsContent value='active' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Active Tab</h3>
          <p className='text-muted-foreground text-sm'>This tab is active and clickable.</p>
        </div>
      </TabsContent>
      <TabsContent value='disabled' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Disabled Tab</h3>
          <p className='text-muted-foreground text-sm'>This tab is disabled and cannot be clicked.</p>
        </div>
      </TabsContent>
      <TabsContent value='another' className='mt-4'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-2 text-lg font-semibold'>Another Tab</h3>
          <p className='text-muted-foreground text-sm'>This is another active tab.</p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Tabs defaultValue='personal'>
      <TabsList>
        <TabsTrigger value='personal'>Personal Info</TabsTrigger>
        <TabsTrigger value='contact'>Contact</TabsTrigger>
        <TabsTrigger value='preferences'>Preferences</TabsTrigger>
      </TabsList>
      <TabsContent value='personal' className='mt-4'>
        <div className='space-y-4 rounded-lg border p-6'>
          <h3 className='text-lg font-semibold'>Personal Information</h3>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>First Name</label>
            <input type='text' className='w-full rounded-md border px-3 py-2' placeholder='John' />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Last Name</label>
            <input type='text' className='w-full rounded-md border px-3 py-2' placeholder='Doe' />
          </div>
        </div>
      </TabsContent>
      <TabsContent value='contact' className='mt-4'>
        <div className='space-y-4 rounded-lg border p-6'>
          <h3 className='text-lg font-semibold'>Contact Information</h3>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Email</label>
            <input type='email' className='w-full rounded-md border px-3 py-2' placeholder='john.doe@example.com' />
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Phone</label>
            <input type='tel' className='w-full rounded-md border px-3 py-2' placeholder='+1 234 567 8900' />
          </div>
        </div>
      </TabsContent>
      <TabsContent value='preferences' className='mt-4'>
        <div className='space-y-4 rounded-lg border p-6'>
          <h3 className='text-lg font-semibold'>Preferences</h3>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Language</label>
            <select className='w-full rounded-md border px-3 py-2'>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Timezone</label>
            <select className='w-full rounded-md border px-3 py-2'>
              <option>UTC</option>
              <option>EST</option>
              <option>PST</option>
            </select>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};
