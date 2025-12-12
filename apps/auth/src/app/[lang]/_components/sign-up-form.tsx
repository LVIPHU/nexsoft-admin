'use client';
import * as React from 'react';
import { toast } from 'sonner';
import { signUpSchema } from '@nexsoft-admin/models';
import { Button, Form, FormGenerator, type FieldConfig } from '@nexsoft-admin/ui';
import { Trans } from '@lingui/react/macro';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';

function SignUpForm() {
  const { i18n } = useLingui();

  const fieldConfigs: FieldConfig[] = [
    {
      name: 'name',
      label: i18n._(msg`Name`),
      placeholder: i18n._(msg`Enter your name`),
      orientation: 'vertical',
    },
    {
      name: 'username',
      label: i18n._(msg`Username`),
      placeholder: i18n._(msg`Enter your username`),
      orientation: 'vertical',
    },
    {
      name: 'password',
      label: i18n._(msg`Password`),
      type: 'password',
      placeholder: i18n._(msg`Enter your password`),
      orientation: 'vertical',
    },
  ];

  return (
    <Form
      schema={signUpSchema}
      defaultValues={{ name: '', username: '', password: '' }}
      fieldConfigs={fieldConfigs}
      onSubmit={(data) => {
        console.log('Form submitted:', data);
        toast.success(`Signed up as: ${data.username}`);
      }}
    >
      <FormGenerator schema={signUpSchema} fieldConfigs={fieldConfigs} />
      <div className='mt-7 w-full'>
        <Button type='submit' size='lg' className='w-full'>
          <Trans>Sign up</Trans>
        </Button>
      </div>
    </Form>
  );
}

export { SignUpForm };
