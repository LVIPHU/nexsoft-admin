import { useEffect, useState, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useSSO } from '@nexsoft-admin/sso';

interface AuthGuardProps {
  fallback?: ReactNode;
}

/**
 * AuthGuard component - Protects routes that require authentication
 * Redirects to auth server if user is not authenticated
 */
function AuthGuard({ fallback }: AuthGuardProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, login } = useSSO();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) {
        return;
      }

      if (!isAuthenticated) {
        // User is not authenticated, redirect to auth server
        const redirectUri = `${window.location.origin}${location.pathname}`;
        login(redirectUri);
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, location.pathname, login]);

  if (isLoading || isChecking) {
    return fallback || <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return fallback || <div>Redirecting to login...</div>;
  }

  return <Outlet />;
}

export { AuthGuard };
