// App.js

import { useAuth } from "react-oidc-context";
import { Button } from "@heroui/react";

const authButtonClassName =
  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-default-400 hover:text-foreground hover:bg-white/5";

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
      <div className="flex items-center gap-1">
        <span className={authButtonClassName}>
          {auth.user?.profile.email}
        </span>
        <Button className={authButtonClassName} onPress={signOutRedirect}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Button className={authButtonClassName} onPress={handleSignIn}>
        Sign in
      </Button>
    </div>
  );
}
