import { Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Settings from "./pages/Settings";
import Callback from "./pages/Callback";
import Logout from "./pages/Logout";
import Login from "./pages/Login";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_LhMWehDIf",
  client_id: "34dfrb7018dccp1i48nfntd9k5",
  redirect_uri: `${window.location.origin}/callback`,
  response_type: "code",
  scope: "email openid profile",
};

function AppRoutes() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider {...cognitoAuthConfig}>
      <AppRoutes />
    </AuthProvider>
  );
}
