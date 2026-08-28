import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AppNavbar from "./AppNavbar";

jest.mock("./Auth", () => ({
  AuthButton: () => <button>Sign out</button>,
}));

describe("AppNavbar", () => {
  it("renders the application navigation", () => {
    render(
      <MemoryRouter>
        <AppNavbar />
      </MemoryRouter>,
    );

    expect(screen.getByText("AInterview")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Interview" })).toBeInTheDocument();
  });
});