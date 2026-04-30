import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}
