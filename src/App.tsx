import { Routes, Route, Outlet } from "react-router-dom";
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
  authority: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_DYeZceIQR",
  client_id: "5u4vv64b2r4lr2v7de4ta1i4ac",
  redirect_uri: `${window.location.origin}/callback`,
  response_type: "code",
  scope: "email openid profile",
};

function RequireAuth() {
  const auth = useAuth();
  if (auth.isLoading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) return <Login />;
  return (
    <>
      <AppNavbar />
      <Outlet />   {/* renders the matched child route */}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider {...cognitoAuthConfig}>
      <div className="min-h-screen bg-[#0a0a0f]">
        <Routes>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/logout" element={<Logout />} />

          {/* protected — wrapped in auth guard */}
          <Route element={<RequireAuth />}>
            <Route path="/interview" element={<Interview />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
}
