'use client';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLingui } from '@lingui/react';
import { msg } from '@lingui/core/macro';
import { signInSchema } from '@nexsoft-admin/models';
import { Button, Form, FormGenerator, type FieldConfig } from '@nexsoft-admin/ui';
import { Trans } from '@lingui/react/macro';

interface SignInFormProps {
  redirectUri?: string;
  appId?: string;
}

function SignInForm({ redirectUri, appId }: SignInFormProps) {
  const { i18n } = useLingui();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async (data: { identifier: string; password: string }) => {
    setIsLoading(true);
    try {
      // Step 1: Call login API
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({ error: 'Login failed' }));
        toast.error(errorData.error || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      // Step 2: If redirectUri is provided, create auth code and redirect
      if (redirectUri) {
        // app_id is required by schema, use appId or default to empty string
        // In practice, appId should always be provided from query params
        if (!appId) {
          toast.error('App ID is required');
          setIsLoading(false);
          return;
        }

        const codeResponse = await fetch('/api/auth/code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            redirect_uri: redirectUri,
            app_id: appId,
          }),
        });

        if (!codeResponse.ok) {
          const errorData = await codeResponse.json().catch(() => ({ error: 'Failed to create auth code' }));
          toast.error(errorData.error || 'Failed to create auth code');
          setIsLoading(false);
          return;
        }

        const codeData = (await codeResponse.json()) as { code: string; redirect_uri: string };

        // Step 3: Redirect to app with code
        const redirectUrl = new URL(codeData.redirect_uri);
        redirectUrl.searchParams.set('code', codeData.code);
        window.location.href = redirectUrl.toString();
      } else {
        // No redirect URI, just show success
        toast.success('Signed in successfully');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <Form
      schema={signInSchema}
      defaultValues={{ identifier: '', password: '' }}
      fieldConfigs={fieldConfigs}
      onSubmit={handleSubmit}
    >
      <FormGenerator schema={signInSchema} fieldConfigs={fieldConfigs} />
      <div className='mt-7 w-full'>
        <Button type='submit' size='lg' className='w-full' disabled={isLoading}>
          {isLoading ? <Trans>Signing in...</Trans> : <Trans>Sign In</Trans>}
        </Button>
      </div>
    </Form>
  );
}

export { SignInForm };
