import { screen, within } from "@testing-library/react";
import { vi } from "vitest";
import PatientDetailPage from "@/pages/patients/patient/PatientDetailPage";
import { renderWithProviders } from "@/test/test-utils";
import { fetchAppointments, fetchPatients, fetchPhysicians } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  fetchAppointments: vi.fn(),
  fetchPatients: vi.fn(),
  fetchPhysicians: vi.fn(),
}));

describe("Patient detail page", () => {
  it("renders risk summary and appointment status", async () => {
    vi.mocked(fetchPatients).mockResolvedValueOnce([
      {
        id: "patient-003",
        name: "Noah Kim",
        stage: "Scheduled Surgery",
        dateOfBirth: "1979-11-05",
        phoneNumber: "(415) 555-0113",
        emergencyContact: "Hana Kim · (415) 555-0133",
        intakeStatus: "complete",
        primaryPhysicianId: "physician-001",
        risk: "high",
        riskReason: "Missed 4 appointments.",
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
    vi.mocked(fetchAppointments).mockResolvedValueOnce([
      {
        id: "appt-002",
        patientId: "patient-003",
        physicianId: "physician-001",
        date: "2026-02-02T09:00:00.000Z",
        type: "Surgery",
        location: "OR 3",
        status: "scheduled",
      },
    ]);
    renderWithProviders(<PatientDetailPage />, {
      route: "/patients/patient-003",
      path: "/patients/:id",
    });

    expect(
      await screen.findByRole("heading", { name: "Patient" })
    ).toBeVisible();
    expect(
      screen.getByRole("heading", { name: "Risk of Missed Appointment" })
    ).toBeVisible();
    expect(screen.getByText("High risk")).toBeVisible();
    expect(screen.getByText("Missed 4 appointments.")).toBeVisible();
    expect(screen.getByText(/Intake:\s+Complete/)).toBeVisible();
    expect(screen.getByText(/Phone:\s+\(415\) 555-0113/)).toBeVisible();
    expect(screen.getByText(/Emergency:\s+Hana Kim/)).toBeVisible();
    const table = screen.getByRole("table");
    expect(
      within(table).getByRole("columnheader", { name: "Status" })
    ).toBeVisible();
    expect(
      within(table).getByRole("cell", { name: "scheduled" })
    ).toBeVisible();
    expect(
      within(table).getByRole("cell", { name: /2026/ })
    ).toBeVisible();
  });
});
