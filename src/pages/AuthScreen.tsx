import { useEffect, useState, type ReactNode } from 'react';

import CheckInPage from './CheckInPage.tsx';

type User = {
  computing_id: string;
  roles: string[];
  effective_roles: string[];
};
// Link CSSS Backend server for authentication
const BACKEND_URL = 'http://localhost:3049';

async function getCurrentUser(): Promise<User | null> {
  const response = await fetch(`${BACKEND_URL}/auth/user`, {
    credentials: 'include',
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return (await response.json()) as User;
}

function getLoginUrl(returnTo: string): string {
  const loginUrl = new URL(`${BACKEND_URL}/auth/login`);
  loginUrl.searchParams.set('return_to', returnTo);
  return loginUrl.toString();
}

type AuthContentProps = {
  children?: ReactNode;
};

function AuthScreen({ children = <CheckInPage /> }: AuthContentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        setUser(await getCurrentUser());
      } catch {
        setError('Could not connect to the backend.');
      } finally {
        setIsLoading(false);
      }
    }

    void checkAuthentication();
  }, []);

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  if (error !== null) {
    return (
      <>
        <h1>Error</h1>
        <p>{error}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Try again
        </button>
      </>
    );
  }

  if (user === null) {
    return (
      <>
        <h1>CSSS Events</h1>
        <h2>Authentication required</h2>
        <p>Please log in with your SFU account to continue.</p>
        <button
          type="button"
          onClick={() =>
            window.location.assign(getLoginUrl(window.location.href))
          }
        >
          Log in with SFU
        </button>
      </>
    );
  }

  return children;
}

export default AuthScreen;
