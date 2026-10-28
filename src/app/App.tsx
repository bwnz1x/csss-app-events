import { useEffect, useState } from 'react';

type User = {
  computing_id: string;
  roles: string[];
  effective_roles: string[];
};

// URL to csss backend server to facilitate CAS Auth 
const BACKEND_URL = 'http://localhost:3049';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuthentication() {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/user`, {
          credentials: 'include',
        });

        if (response.status === 401) {
          setUser(null);
          return;
        }

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const currentUser = (await response.json()) as User;
        setUser(currentUser);
      } catch {
        setError('Could not connect to the backend.');
      } finally {
        setIsLoading(false);
      }
    }

    void checkAuthentication();
  }, []);

  function logIn() {
    const loginUrl = new URL(`${BACKEND_URL}/auth/login`);

    loginUrl.searchParams.set('return_to', window.location.href);

    window.location.assign(loginUrl.toString());
  }

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
        <button type="button" onClick={logIn}>
          Log in with SFU
        </button>
      </>
    );
  }

  return (
    <>
      <h1>CSSS Events</h1>
      <h2>Authentication successful</h2>
      <p>You are signed in as {user.computing_id}.</p>
      <p>You can now continue to the event check-in.</p>
    </>
  );
}

export default App;

