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
    id: "2b6f1d3e-6d4a-4e5c-9a1c-1f2e3d4c5b6a",
    prefix: "Dr",
    firstName: "Avery",
    lastName: "Chen",
    specialty: "Cardiothoracic Surgery",
    location: "Northlake Medical Center",
  },
  patients: [
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
  ],
  appointments: [
    {
      id: "11111111-aaaa-4bbb-8ccc-000000000001",
      patientId: "b2c3d4e5-2222-4bbb-8ccc-222222222222",
      physicianId: "2b6f1d3e-6d4a-4e5c-9a1c-1f2e3d4c5b6a",
      date: "2026-01-28T14:30:00.000Z",
      type: "Consultation",
      location: "Suite 420",
      status: "scheduled",
    },
  ],
  noShowCountsByPatient: {
    "b2c3d4e5-2222-4bbb-8ccc-222222222222": 1,
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
