import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link,
} from "@heroui/react";
import { AuthButton } from "./Auth"
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Interview", href: "/interview" },
];

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="bg-[#0d0d14]/80 backdrop-blur-xl border-b border-white/[0.06]"
      maxWidth="xl"
    >
      <AuthButton/>
      {/* Brand */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-default-400"
        />
        <NavbarBrand
          className="cursor-pointer gap-2"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xs">AI</span>
          </div>
          <p className="font-bold text-lg gradient-text hidden sm:block">
            AInterview
          </p>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop nav links */}
      <NavbarContent className="hidden sm:flex gap-1" justify="center">
        {navLinks.map((link) => (
          <NavbarItem key={link.href}>
            <Link
              href={link.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.href
                  ? "text-primary bg-primary/10"
                  : "text-default-400 hover:text-foreground hover:bg-white/5"
              }`}
            >
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu className="bg-[#0d0d14]/95 backdrop-blur-xl pt-6 gap-2">
        {navLinks.map((link) => (
          <NavbarMenuItem key={link.href}>
            <Link
              href={link.href}
              className={`w-full text-lg py-2 ${
                location.pathname === link.href
                  ? "text-primary font-semibold"
                  : "text-default-400"
              }`}
              onPress={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
