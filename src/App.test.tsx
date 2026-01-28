import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "@/App";

vi.mock("@/pages/Dashboard", () => ({
  default: () => <div>Dashboard Page</div>,
}));
vi.mock("@/pages/Patients", () => ({
  default: () => <div>Patients Page</div>,
}));
vi.mock("@/pages/Patients/PatientDetail", () => ({
  default: () => <div>Patient Detail Page</div>,
}));

describe("App routes", () => {
  it("renders the dashboard route by default", () => {
    render(<App />);

    expect(screen.getByText("Dashboard Page")).toBeVisible();
  });
});
