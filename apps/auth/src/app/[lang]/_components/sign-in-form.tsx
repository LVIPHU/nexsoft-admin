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
      description: 'administrator',
      orientation: 'vertical',
    },
    {
      name: 'password',
      label: i18n._(msg`Password`),
      type: 'password',
      placeholder: i18n._(msg`Enter your password`),
      description: 'nexsoft@123',
      orientation: 'vertical',
    },
  ];

  const handleSubmit = async (data: { identifier: string; password: string }) => {
    setIsLoading(true);
    try {
      // Build login URL with redirect_uri and app_id as query params (for SSO flow)
      const loginUrl = new URL('/api/auth/login', window.location.origin);
      if (redirectUri) {
        loginUrl.searchParams.set('redirect_uri', redirectUri);
      }
      if (appId) {
        loginUrl.searchParams.set('app_id', appId);
      }

      // Call login API
      // If redirect_uri and app_id are provided, the server will automatically
      // create auth code and redirect to callback URL
      const loginResponse = await fetch(loginUrl.toString(), {
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

      const result = await loginResponse.json();

      // If redirect_url is provided, redirect to callback URL
      if (result.redirect_url) {
        // Redirect to callback URL with auth code
        window.location.href = result.redirect_url;
        return; // Don't set loading to false, page will redirect
      }

      // No redirect URI, just show success
      if (result.success) {
        toast.success('Signed in successfully');
      }
      setIsLoading(false);
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
