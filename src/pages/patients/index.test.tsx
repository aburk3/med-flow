import { screen, within } from "@testing-library/react";
import { vi } from "vitest";
import PatientsPage from "@/pages/patients";
import { renderWithProviders } from "@/test/test-utils";
import { fetchPatients, fetchPhysicians } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  fetchPatients: vi.fn(),
  fetchPhysicians: vi.fn(),
}));

describe("Patients page", () => {
  it("renders patient list with primary physician", async () => {
    vi.mocked(fetchPatients).mockResolvedValueOnce([
      {
        id: "patient-001",
        name: "Sophia Ramirez",
        stage: "Initial Contact",
        primaryPhysicianId: "physician-001",
        risk: "low",
        riskReason: "No missed appointments.",
      },
      {
        id: "patient-002",
        name: "Liam Patel",
        stage: "First Meeting",
        primaryPhysicianId: "physician-001",
        risk: "medium",
        riskReason: "Missed 1 appointment.",
      },
    ]);
    vi.mocked(fetchPhysicians).mockResolvedValueOnce([
      {
        id: "physician-001",
        name: "Dr. Avery Chen",
        specialty: "Cardiothoracic Surgery",
        location: "Northlake Medical Center",
      },
    ]);

    renderWithProviders(<PatientsPage />, { route: "/patients", path: "/patients" });

    expect(
      await screen.findByRole("heading", { name: "Patients" })
    ).toBeVisible();

    const table = screen.getByRole("table");
    expect(
      within(table).getByRole("columnheader", { name: "Patient" })
    ).toBeVisible();
    expect(
      within(table).getByRole("columnheader", { name: "Stage" })
    ).toBeVisible();
    expect(
      within(table).getByRole("columnheader", { name: "Primary Physician" })
    ).toBeVisible();

    const sophiaRow = screen.getByRole("button", { name: /Sophia Ramirez/ });
    const liamRow = screen.getByRole("button", { name: /Liam Patel/ });

    expect(within(sophiaRow).getByRole("cell", { name: "Sophia Ramirez" })).toBeVisible();
    expect(within(liamRow).getByRole("cell", { name: "Liam Patel" })).toBeVisible();
    expect(
      within(sophiaRow).getByRole("cell", { name: "Dr. Avery Chen" })
    ).toBeVisible();
    expect(
      within(liamRow).getByRole("cell", { name: "Dr. Avery Chen" })
    ).toBeVisible();
  });
});
