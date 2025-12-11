'use client';
import * as React from 'react';
import { toast } from 'sonner';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { signInSchema } from '@nexsoft-admin/models';
import { Button, Form, FormGenerator, type FieldConfig } from '@nexsoft-admin/ui';
import { Trans } from '@lingui/react/macro';

function SignInForm() {
  const { i18n } = useLingui();

  const fieldConfigs: FieldConfig[] = [
    {
      name: 'identifier',
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
      schema={signInSchema}
      defaultValues={{ identifier: '', password: '' }}
      fieldConfigs={fieldConfigs}
      onSubmit={(data) => {
        console.log('Form submitted:', data);
        toast.success(`Signed in as: ${data.identifier}`);
      }}
    >
      <FormGenerator schema={signInSchema} fieldConfigs={fieldConfigs} />
      <div className='mt-7 w-full'>
        <Button type='submit' size='lg' className='w-full'>
          <Trans>Sign In</Trans>
        </Button>
      </div>
    </Form>
  );
}

export { SignInForm };
