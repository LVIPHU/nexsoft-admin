import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getSSOClient } from '@/libs/sso/setup';

/**
 * Callback page to handle SSO redirect from auth server
 * This page receives the auth_code and exchanges it for tokens
 */
export function CallbackPage() {
  const navigate = useNavigate();
  // const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const client = getSSOClient();
        const currentUrl = window.location.href;

        // Handle callback
        await client.handleCallback(currentUrl);

        // Get the original redirect path from localStorage or default to home
        const redirectPath = localStorage.getItem('sso_redirect_path') || '/';
        localStorage.removeItem('sso_redirect_path');

        // Redirect to original page or home
        navigate(redirectPath, { replace: true });
      } catch (err) {
        console.error('SSO callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (isProcessing) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4'>Processing authentication...</div>
          <div className='animate-spin'>⏳</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 text-red-600'>Authentication Error</div>
          <div className='mb-4'>{error}</div>
          <button
            onClick={() => {
              const client = getSSOClient();
              client.initiateLogin();
            }}
            className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}
