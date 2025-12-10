'use client'
import { signInSchema } from '@nexsoft-admin/models'
import { toast } from 'sonner';
import {
  Button,
  Form,
  FormGenerator,
  type FieldConfig
} from '@nexsoft-admin/ui';
import * as React from 'react';

export default function SignInForm() {
  const fieldConfigs: FieldConfig[] = [
    {
      name: 'identifier',
      label: 'Username',
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
    <div>
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
        <div className='mt-8 w-full'>
          <Button type='submit' size='lg' className='w-full'>Sign In</Button>
        </div>
      </Form>
    </div>
  )
}
