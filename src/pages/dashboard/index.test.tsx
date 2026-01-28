import { screen, within } from "@testing-library/react";
import { vi } from "vitest";
import Dashboard from "@/pages/Dashboard";
import type { DashboardPayload } from "@/types/api";
import { renderWithProviders } from "@/test/test-utils";
import { fetchDashboard } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  fetchDashboard: vi.fn(),
}));

const mockDashboardPayload: DashboardPayload = {
  physician: {
    id: "physician-001",
    name: "Dr. Avery Chen",
    specialty: "Cardiothoracic Surgery",
    location: "Northlake Medical Center",
  },
  patients: [
    {
      id: "patient-002",
      name: "Liam Patel",
      stage: "First Meeting",
      dateOfBirth: "1987-08-22",
      phoneNumber: "(415) 555-0128",
      emergencyContact: "Asha Patel · (415) 555-0194",
      intakeStatus: "complete",
      primaryPhysicianId: "physician-001",
      risk: "medium",
      riskReason: "Missed 1 appointment.",
    },
  ],
  appointments: [
    {
      id: "appt-001",
      patientId: "patient-002",
      physicianId: "physician-001",
      date: "2026-01-28T14:30:00.000Z",
      type: "Consultation",
      location: "Suite 420",
      status: "scheduled",
    },
  ],
  noShowCountsByPatient: {
    "patient-002": 1,
  },
  appointmentsTotal: 3,
};

describe("Dashboard page", () => {
  it("renders upcoming schedule and total appointment count", async () => {
    vi.mocked(fetchDashboard).mockResolvedValueOnce(mockDashboardPayload);

    renderWithProviders(<Dashboard />);

    expect(
      await screen.findByRole("heading", { name: "Patient Flow Dashboard" })
    ).toBeVisible();

    const appointmentsHeading = screen.getByRole("heading", {
      name: "Appointments",
      level: 3,
    });
    const appointmentsCard = appointmentsHeading.closest("article");
    expect(appointmentsCard).not.toBeNull();
    if (appointmentsCard) {
      expect(within(appointmentsCard).getByText("3")).toBeVisible();
    }

    const scheduleTable = screen.getByRole("table");
    const rows = within(scheduleTable).getAllByRole("row");
    expect(rows).toHaveLength(1);

    expect(screen.getByRole("cell", { name: /2026/ })).toBeVisible();
    expect(screen.getByRole("img", { name: /Medium risk/ })).toBeVisible();
  });
});
