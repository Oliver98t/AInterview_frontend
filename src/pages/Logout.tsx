import { useEffect } from "react";
import { useAuth } from "react-oidc-context";

export default function Logout() {
  const auth = useAuth();
  
  useEffect(() => {
    // Clear storage to remove old tokens
    localStorage.clear();
    sessionStorage.clear();   
    auth.removeUser().then(() => {
      window.location.href = "/";
    });
  }, [auth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Signing out...</h1>
        <p className="text-gray-400">Please wait while we complete your sign out.</p>
      </div>
    </div>
  );
}
