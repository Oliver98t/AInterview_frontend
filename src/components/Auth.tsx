// App.js

import { useAuth } from "react-oidc-context";
import { appEnv } from "../config/env";
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
    const clientId = appEnv.VITE_AUTH0_CLIENT_ID as string;
    const logoutUri = `${window.location.origin}/logout`;
    const cognitoDomain = appEnv.VITE_COGNITO_DOMAIN as string;
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
