'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormGenerator,
  FormInput,
  FormTextarea,
  FormSelect,
  FormSwitch,
  FormGroup,
  type FieldConfig,
} from './index';
import { Button } from '../../atoms/button/button';
import { Grid } from '../../atoms/grid/grid';

const meta: Meta<typeof Form> = {
  title: 'Organisms/Form',
  component: Form,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic sign-in schema
const signInSchema = z.object({
  identifier: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// User profile schema
const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(255, 'Bio must be less than 255 characters').optional(),
  role: z.enum(['admin', 'user', 'guest']),
  newsletter: z.boolean().default(false),
  active: z.boolean().default(true),
});

// Complex form schema
const complexSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  country: z.enum(['us', 'uk', 'ca', 'au']),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

export const BasicForm: Story = {
  render: () => {
    const fieldConfigs: FieldConfig[] = [
      {
        name: 'identifier',
        label: 'Username or Email',
        placeholder: 'Enter your username',
        orientation: 'vertical',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        orientation: 'vertical',
      },
    ];

    return (
      <div className='mx-auto max-w-md p-4'>
        <Form
          schema={signInSchema}
          defaultValues={{ identifier: '', password: '' }}
          fieldConfigs={fieldConfigs}
          onSubmit={(data) => {
            console.log('Form submitted:', data);
            toast.success(`Signed in as: ${data.identifier}`);
          }}
        >
          <FormGenerator schema={signInSchema} fieldConfigs={fieldConfigs} />
          <div className='mt-6'>
            <Button type='submit'>Sign In</Button>
          </div>
        </Form>
      </div>
    );
  },
};

export const WithResetAfterSubmit: Story = {
  render: () => {
    const fieldConfigs: FieldConfig[] = [
      {
        name: 'identifier',
        label: 'Username',
        placeholder: 'Enter username',
        orientation: 'vertical',
      },
      {
        name: 'password',
        label: 'Password',
        type: 'password',
        orientation: 'vertical',
      },
    ];

    return (
      <div className='mx-auto max-w-md p-4'>
        <Form
          schema={signInSchema}
          defaultValues={{ identifier: '', password: '' }}
          fieldConfigs={fieldConfigs}
          resetAfterSubmit={true}
          onSubmit={async (data) => {
            console.log('Form submitted:', data);
            await new Promise((resolve) => setTimeout(resolve, 500));
            toast.success('Form submitted and reset!');
          }}
        >
          <FormGenerator schema={signInSchema} fieldConfigs={fieldConfigs} />
          <div className='mt-6'>
            <Button type='submit'>Submit & Reset</Button>
          </div>
        </Form>
      </div>
    );
  },
};

const WithFormChangeTrackingComponent = () => {
  const [changeLog, setChangeLog] = React.useState<string[]>([]);

  const fieldConfigs: FieldConfig[] = [
    {
      name: 'identifier',
      label: 'Username',
      placeholder: 'Enter username',
      orientation: 'vertical',
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      orientation: 'vertical',
    },
  ];

  return (
    <div className='mx-auto max-w-md p-4'>
      <Form
        schema={signInSchema}
        defaultValues={{ identifier: '', password: '' }}
        fieldConfigs={fieldConfigs}
        onFormChange={(changeInfo) => {
          const log = `Changed: ${changeInfo.changedFields.map((f) => String(f.name)).join(', ')} | Dirty: ${changeInfo.isDirty}`;
          setChangeLog((prev) => [log, ...prev].slice(0, 10));
        }}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          toast.success('Form submitted successfully!');
        }}
      >
        <FormGenerator schema={signInSchema} fieldConfigs={fieldConfigs} />
        <div className='mt-6'>
          <Button type='submit'>Submit</Button>
        </div>
      </Form>
      <div className='bg-muted mt-4 rounded-md p-4'>
        <h3 className='mb-2 text-sm font-semibold'>Change Log:</h3>
        <div className='space-y-1 text-xs'>
          {changeLog.length === 0 ? (
            <p className='text-muted-foreground'>No changes yet</p>
          ) : (
            changeLog.map((log, i) => <div key={i}>{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
};

export const WithFormChangeTracking: Story = {
  render: () => <WithFormChangeTrackingComponent />,
};

export const TwoColumnLayout: Story = {
  render: () => {
    const fieldConfigs: FieldConfig[] = [
      {
        name: 'firstName',
        label: 'First Name',
        orientation: 'vertical',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        orientation: 'vertical',
      },
      {
        name: 'email',
        label: 'Email',
        orientation: 'vertical',
      },
      {
        name: 'phone',
        label: 'Phone',
        orientation: 'vertical',
      },
      {
        name: 'country',
        label: 'Country',
        orientation: 'vertical',
        options: [
          { label: 'United States', value: 'us' },
          { label: 'United Kingdom', value: 'uk' },
          { label: 'Canada', value: 'ca' },
          { label: 'Australia', value: 'au' },
        ],
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        orientation: 'vertical',
      },
      {
        name: 'terms',
        label: 'I accept the terms and conditions',
        type: 'switch',
        orientation: 'horizontal',
      },
    ];

    return (
      <div className='mx-auto max-w-4xl p-4'>
        <Form
          schema={complexSchema}
          defaultValues={{
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            message: '',
            country: 'us',
            terms: false,
          }}
          fieldConfigs={fieldConfigs}
          onSubmit={(data) => {
            console.log('Form submitted:', data);
            toast.success('Form submitted!');
          }}
        >
          <FormGenerator as={Grid} cols={2} mdCols={2} gap={4} schema={complexSchema} fieldConfigs={fieldConfigs} />
          <div className='mt-6'>
            <Button type='submit'>Submit</Button>
          </div>
        </Form>
      </div>
    );
  },
};

export const ManualFormFields: Story = {
  render: () => {
    return (
      <div className='mx-auto max-w-md p-4'>
        <Form
          schema={userProfileSchema}
          defaultValues={{
            name: '',
            email: '',
            bio: '',
            role: 'user',
            newsletter: false,
            active: true,
          }}
          onSubmit={(data) => {
            console.log('Form submitted:', data);
            toast.success('Profile updated!');
          }}
        >
          <Grid cols={1} gap={4}>
            <FormInput
              name='name'
              config={{
                name: 'name',
                label: 'Full Name',
                placeholder: 'Enter your name',
                orientation: 'vertical',
              }}
            />
            <FormInput
              name='email'
              type='email'
              config={{
                name: 'email',
                label: 'Email',
                placeholder: 'Enter your email',
                orientation: 'vertical',
              }}
            />
            <FormTextarea
              name='bio'
              config={{
                name: 'bio',
                label: 'Bio',
                placeholder: 'Tell us about yourself',
                orientation: 'vertical',
              }}
            />
            <FormSelect
              name='role'
              config={{
                name: 'role',
                label: 'Role',
                orientation: 'vertical',
                options: [
                  { label: 'Admin', value: 'admin' },
                  { label: 'User', value: 'user' },
                  { label: 'Guest', value: 'guest' },
                ],
              }}
            />
            <FormSwitch
              name='newsletter'
              config={{
                name: 'newsletter',
                label: 'Subscribe to newsletter',
                orientation: 'horizontal',
              }}
            />
            <FormSwitch
              name='active'
              config={{
                name: 'active',
                label: 'Account Active',
                orientation: 'horizontal',
              }}
            />
          </Grid>
          <div className='mt-6'>
            <Button type='submit'>Update Profile</Button>
          </div>
        </Form>
      </div>
    );
  },
};

export const WithFormGroups: Story = {
  render: () => {
    const fieldConfigs: FieldConfig[] = [
      {
        name: 'name',
        label: 'Full Name',
        orientation: 'vertical',
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        orientation: 'vertical',
      },
      {
        name: 'bio',
        label: 'Bio',
        type: 'textarea',
        orientation: 'vertical',
      },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        orientation: 'vertical',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
          { label: 'Guest', value: 'guest' },
        ],
      },
      {
        name: 'newsletter',
        label: 'Subscribe to newsletter',
        type: 'switch',
        orientation: 'horizontal',
      },
      {
        name: 'active',
        label: 'Account Active',
        type: 'switch',
        orientation: 'horizontal',
      },
    ];

    return (
      <div className='mx-auto max-w-2xl p-4'>
        <Form
          schema={userProfileSchema}
          defaultValues={{
            name: '',
            email: '',
            bio: '',
            role: 'user',
            newsletter: false,
            active: true,
          }}
          onSubmit={(data) => {
            console.log('Form submitted:', data);
            toast.success('Profile updated!');
          }}
        >
          <FormGroup legend='Personal Information'>
            <p className='text-muted-foreground mb-4 text-sm'>Update your personal details.</p>
            <Grid cols={1} gap={4}>
              <FormInput name='name' config={fieldConfigs.find((f) => f.name === 'name')} />
              <FormInput name='email' type='email' config={fieldConfigs.find((f) => f.name === 'email')} />
              <FormTextarea name='bio' config={fieldConfigs.find((f) => f.name === 'bio')} />
            </Grid>
          </FormGroup>

          <FormGroup legend='Account Settings'>
            <p className='text-muted-foreground mb-4 text-sm'>Manage your account preferences.</p>
            <Grid cols={1} gap={4}>
              <FormSelect name='role' config={fieldConfigs.find((f) => f.name === 'role')} />
              <FormSwitch name='newsletter' config={fieldConfigs.find((f) => f.name === 'newsletter')} />
              <FormSwitch name='active' config={fieldConfigs.find((f) => f.name === 'active')} />
            </Grid>
          </FormGroup>

          <div className='mt-6'>
            <Button type='submit'>Update Profile</Button>
          </div>
        </Form>
      </div>
    );
  },
};
