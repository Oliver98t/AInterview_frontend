// App.js

import { useAuth } from "react-oidc-context";

export function AuthButton() {
  const auth = useAuth();

  const handleSignIn = () => {
    localStorage.clear();
    sessionStorage.clear();
    auth.signinRedirect();
  }

  const signOutRedirect = () => {
    sessionStorage.clear(); 
    localStorage.clear();
    const clientId = "5u4vv64b2r4lr2v7de4ta1i4ac";
    const logoutUri = `${window.location.origin}/logout`;
    const cognitoDomain = "https://ainterview-dev-eu-west-2.auth.eu-west-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <button onClick={signOutRedirect}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => handleSignIn()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}
