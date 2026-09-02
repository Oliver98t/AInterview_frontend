import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("react-oidc-context", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => ({ isLoading: false, isAuthenticated: false }),
}));

// Interview.tsx relies on import.meta.env, which ts-jest cannot parse; stub it out here.
jest.mock("./pages/Interview", () => ({
  __esModule: true,
  default: () => <div>Interview page</div>,
}));

describe("App integration", () => {
  it("renders the home page at the root route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText(/interview with AI/i)).toBeInTheDocument();
  });

  it("redirects to login when visiting a protected route while unauthenticated", () => {
    render(
      <MemoryRouter initialEntries={["/interview"]}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /Sign In with Cognito/i })).toBeInTheDocument();
  });
});
