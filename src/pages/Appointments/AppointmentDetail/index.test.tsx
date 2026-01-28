import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import AppointmentDetail from "@/pages/Appointments/AppointmentDetail";
import { renderWithProviders } from "@/test/test-utils";
import {
  createAppointmentFlowStep,
  deleteAppointmentFlowStep,
  fetchAppointmentDetail,
  reorderAppointmentFlowStep,
  updateAppointmentFlowStep,
} from "@/lib/api";

vi.mock("@/lib/api", () => ({
  createAppointmentFlowStep: vi.fn(),
  deleteAppointmentFlowStep: vi.fn(),
  fetchAppointmentDetail: vi.fn(),
  reorderAppointmentFlowStep: vi.fn(),
  updateAppointmentFlowStep: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe("Appointment detail page", () => {
  it("renders flow steps and updates status", async () => {
    vi.mocked(fetchAppointmentDetail).mockResolvedValueOnce({
      appointment: {
        id: "appt-001",
        patientId: "patient-002",
        physicianId: "physician-001",
        date: "2026-01-28T14:30:00.000Z",
        type: "Consultation",
        location: "Suite 420",
        status: "scheduled",
      },
      patient: {
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
      physician: {
        id: "physician-001",
        name: "Dr. Avery Chen",
        specialty: "Cardiothoracic Surgery",
        location: "Northlake Medical Center",
      },
      flow: {
        id: "flow-001",
        appointmentId: "appt-001",
        steps: [
          {
            id: "step-1",
            title: "Scheduled",
            order: 1,
            status: "in_progress",
          },
          {
            id: "step-2",
            title: "Appointment Confirmed",
            order: 2,
            status: "not_started",
          },
        ],
      },
    });

    vi.mocked(updateAppointmentFlowStep).mockResolvedValueOnce({
      id: "flow-001",
      appointmentId: "appt-001",
      steps: [
        {
          id: "step-1",
          title: "Scheduled",
          order: 1,
          status: "complete",
        },
        {
          id: "step-2",
          title: "Appointment Confirmed",
          order: 2,
          status: "not_started",
        },
      ],
    });

    renderWithProviders(<AppointmentDetail />, {
      route: "/appointments/appt-001",
      path: "/appointments/:id",
    });

    expect(
      await screen.findByRole("heading", { name: "Appointment" })
    ).toBeVisible();
    expect(screen.getByText("Scheduled")).toBeVisible();
    expect(screen.getByText("Appointment Confirmed")).toBeVisible();

    const statusSelect = screen.getByLabelText("Scheduled status");
    fireEvent.change(statusSelect, { target: { value: "complete" } });

    await waitFor(() => {
      expect(updateAppointmentFlowStep).toHaveBeenCalledWith(
        "appt-001",
        "step-1",
        { status: "complete" }
      );
    });
    await waitFor(() => {
      expect(statusSelect).toHaveValue("complete");
    });
  });

  it("supports managing flow steps", async () => {
    vi.mocked(fetchAppointmentDetail).mockResolvedValueOnce({
      appointment: {
        id: "appt-001",
        patientId: "patient-002",
        physicianId: "physician-001",
        date: "2026-01-28T14:30:00.000Z",
        type: "Consultation",
        location: "Suite 420",
        status: "scheduled",
      },
      patient: {
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
      physician: {
        id: "physician-001",
        name: "Dr. Avery Chen",
        specialty: "Cardiothoracic Surgery",
        location: "Northlake Medical Center",
      },
      flow: {
        id: "flow-001",
        appointmentId: "appt-001",
        steps: [
          {
            id: "step-1",
            title: "Scheduled",
            order: 1,
            status: "in_progress",
          },
          {
            id: "step-2",
            title: "Appointment Confirmed",
            order: 2,
            status: "not_started",
          },
        ],
      },
    });

    vi.mocked(createAppointmentFlowStep).mockResolvedValueOnce({
      id: "flow-001",
      appointmentId: "appt-001",
      steps: [
        {
          id: "step-1",
          title: "Scheduled",
          order: 1,
          status: "in_progress",
        },
        {
          id: "step-2",
          title: "Appointment Confirmed",
          order: 2,
          status: "not_started",
        },
        {
          id: "step-3",
          title: "Pre-Op Checklist",
          order: 3,
          status: "not_started",
        },
      ],
    });

    vi.mocked(updateAppointmentFlowStep).mockResolvedValueOnce({
      id: "flow-001",
      appointmentId: "appt-001",
      steps: [
        {
          id: "step-1",
          title: "Scheduled",
          order: 1,
          status: "in_progress",
        },
        {
          id: "step-2",
          title: "Confirmation Call",
          order: 2,
          status: "not_started",
        },
      ],
    });

    vi.mocked(reorderAppointmentFlowStep).mockResolvedValueOnce({
      id: "flow-001",
      appointmentId: "appt-001",
      steps: [
        {
          id: "step-2",
          title: "Appointment Confirmed",
          order: 1,
          status: "not_started",
        },
        {
          id: "step-1",
          title: "Scheduled",
          order: 2,
          status: "in_progress",
        },
      ],
    });

    vi.mocked(deleteAppointmentFlowStep).mockResolvedValueOnce({
      id: "flow-001",
      appointmentId: "appt-001",
      steps: [
        {
          id: "step-2",
          title: "Appointment Confirmed",
          order: 1,
          status: "not_started",
        },
      ],
    });

    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    renderWithProviders(<AppointmentDetail />, {
      route: "/appointments/appt-001",
      path: "/appointments/:id",
    });

    await screen.findByRole("heading", { name: "Appointment" });

    fireEvent.click(screen.getByRole("button", { name: "Manage flow" }));

    const newStepInput = screen.getByPlaceholderText("New step title");
    fireEvent.change(newStepInput, { target: { value: "Pre-Op Checklist" } });
    fireEvent.click(screen.getByRole("button", { name: "Add step" }));

    expect(createAppointmentFlowStep).not.toHaveBeenCalled();

    const editInput = screen.getByDisplayValue("Appointment Confirmed");
    fireEvent.change(editInput, { target: { value: "Confirmation Call" } });
    expect(updateAppointmentFlowStep).not.toHaveBeenCalled();

    const scheduledHandle = screen.getAllByRole("button", {
      name: "Drag to reorder",
    })[0];
    const confirmCard = document.querySelector(
      "[data-flow-step-id='step-2']"
    ) as HTMLElement;

    confirmCard.getBoundingClientRect = () => ({
      left: 0,
      right: 100,
      top: 0,
      bottom: 40,
      width: 100,
      height: 40,
      x: 0,
      y: 0,
      toJSON: () => "",
    });

    const dataTransfer = {
      data: {} as Record<string, string>,
      setData: vi.fn((key: string, value: string) => {
        dataTransfer.data[key] = value;
      }),
      getData: vi.fn((key: string) => dataTransfer.data[key]),
      effectAllowed: "",
      dropEffect: "",
    };

    fireEvent.dragStart(scheduledHandle, { dataTransfer });
    fireEvent.dragOver(confirmCard, { dataTransfer, clientX: 75 });
    fireEvent.drop(confirmCard, { dataTransfer, clientX: 75 });
    expect(reorderAppointmentFlowStep).not.toHaveBeenCalled();

    const scheduledCard = document.querySelector(
      "[data-flow-step-id='step-1']"
    ) as HTMLElement;
    fireEvent.click(within(scheduledCard).getByRole("button", { name: "Delete" }));
    expect(deleteAppointmentFlowStep).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(createAppointmentFlowStep).toHaveBeenCalledWith("appt-001", {
        title: "Pre-Op Checklist",
      });
    });
    await waitFor(() => {
      expect(updateAppointmentFlowStep).toHaveBeenCalledWith(
        "appt-001",
        "step-2",
        { title: "Confirmation Call" }
      );
    });
    await waitFor(() => {
      expect(deleteAppointmentFlowStep).toHaveBeenCalledWith("appt-001", "step-1");
    });
    await waitFor(() => {
      expect(reorderAppointmentFlowStep).toHaveBeenCalledWith("appt-001", [
        "step-2",
        "step-3",
      ]);
    });

    confirmSpy.mockRestore();
  });
});
