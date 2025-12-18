import { i18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import _axios from 'axios';
import type { AxiosRequestHeaders } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { toast } from 'sonner';
import { deepSearchAndParseDates } from '@nexsoft-admin/utils';
import { translateError } from '@/services/errors/translate-error';
import type { ErrorMessage } from '@nexsoft-admin/utils';
import { queryClient } from './query-client';
import { getSSOClient } from '@/libs/sso';

export const axios = _axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 10000,
});

axios.interceptors.request.use(async (config) => {
  const client = getSSOClient();
  const token = await client.getAccessToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as AxiosRequestHeaders;
  }
  return config;
});

// Intercept responses to transform ISO dates to JS date objects
axios.interceptors.response.use(
  (response) => {
    const transformedResponse = deepSearchAndParseDates(response.data, ['created_at', 'updated_at']);
    return { ...response, data: transformedResponse };
  },
  (error) => {
    const message = error.response?.data.message as ErrorMessage;
    const description = translateError(message);

    if (description) {
      toast.error(i18n._(msg`Oops, the server returned an error.`), {
        description: i18n._(description),
      });
    }

    return Promise.reject(new Error(message));
  },
);

// Create another instance to handle failed refresh tokens
// Reference: https://github.com/Flyrell/axios-auth-refresh/issues/191
const axiosForRefresh = _axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 10000,
});

// Interceptor to handle expired access token errors
const handleAuthError = () => {
  const client = getSSOClient();
  return client.refreshToken();
};

// Interceptor to handle expired refresh token errors
const handleRefreshError = async () => {
  const client = getSSOClient();
  queryClient.removeQueries();
  await client.logout();
};

// Intercept responses to check for 401 and 403 errors, refresh token and retry the request
createAuthRefreshInterceptor(axios, handleAuthError, {
  statusCodes: [401, 403],
});
createAuthRefreshInterceptor(axiosForRefresh, handleRefreshError);
