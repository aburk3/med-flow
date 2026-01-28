import { screen, within } from "@testing-library/react";
import { vi } from "vitest";
import Patients from "@/pages/Patients";
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
        id: "a1b2c3d4-1111-4aaa-9bbb-111111111111",
        firstName: "Sophia",
        lastName: "Ramirez",
        stage: "Initial Contact",
        dateOfBirth: "1991-02-14",
        phoneNumber: "(415) 555-0142",
        emergencyContact: "Miguel Ramirez · (415) 555-0177",
        intakeStatus: "sent",
        primaryPhysicianId: "2b6f1d3e-6d4a-4e5c-9a1c-1f2e3d4c5b6a",
        risk: "low",
        riskReason: "No missed appointments.",
      },
      {
        id: "b2c3d4e5-2222-4bbb-8ccc-222222222222",
        firstName: "Liam",
        lastName: "Patel",
        stage: "First Meeting",
        dateOfBirth: "1987-08-22",
        phoneNumber: "(415) 555-0128",
        emergencyContact: "Asha Patel · (415) 555-0194",
        intakeStatus: "complete",
        primaryPhysicianId: "2b6f1d3e-6d4a-4e5c-9a1c-1f2e3d4c5b6a",
        risk: "medium",
        riskReason: "Missed 1 appointment.",
      },
    ]);
    vi.mocked(fetchPhysicians).mockResolvedValueOnce([
      {
        id: "2b6f1d3e-6d4a-4e5c-9a1c-1f2e3d4c5b6a",
        prefix: "Dr",
        firstName: "Avery",
        lastName: "Chen",
        specialty: "Cardiothoracic Surgery",
        location: "Northlake Medical Center",
      },
    ]);

    renderWithProviders(<Patients />, { route: "/patients", path: "/patients" });

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
