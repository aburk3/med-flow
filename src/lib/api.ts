import type {
  Appointment,
  AppointmentDetail,
  AppointmentFlowStepStatus,
  DashboardPayload,
  Patient,
  Physician,
} from "@/types/api";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const request = async <T,>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

type DashboardRequestOptions = {
  fromDate?: Date;
};

const buildQuery = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const fetchDashboard = (
  options: DashboardRequestOptions = {}
): Promise<DashboardPayload> => {
  const query = buildQuery({
    from: options.fromDate?.toISOString(),
  });
  return request<DashboardPayload>(`/api/dashboard${query}`);
};

const fetchPatients = (): Promise<Patient[]> =>
  request<Patient[]>("/api/patients");

const fetchPhysicians = (): Promise<Physician[]> =>
  request<Physician[]>("/api/physicians");

const fetchAppointments = (): Promise<Appointment[]> =>
  request<Appointment[]>("/api/appointments");

const fetchAppointmentDetail = (appointmentId: string): Promise<AppointmentDetail> =>
  request<AppointmentDetail>(`/api/appointments/${appointmentId}`);

const updateAppointmentFlowStep = (
  appointmentId: string,
  stepId: string,
  updates: { status?: AppointmentFlowStepStatus; title?: string }
): Promise<AppointmentDetail["flow"]> =>
  request<AppointmentDetail["flow"]>(
    `/api/appointments/${appointmentId}/flow/steps/${stepId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    }
  );

const createAppointmentFlowStep = (
  appointmentId: string,
  payload: { title: string; status?: AppointmentFlowStepStatus }
): Promise<AppointmentDetail["flow"]> =>
  request<AppointmentDetail["flow"]>(`/api/appointments/${appointmentId}/flow/steps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

const deleteAppointmentFlowStep = (
  appointmentId: string,
  stepId: string
): Promise<AppointmentDetail["flow"]> =>
  request<AppointmentDetail["flow"]>(
    `/api/appointments/${appointmentId}/flow/steps/${stepId}`,
    {
      method: "DELETE",
    }
  );

const reorderAppointmentFlowStep = (
  appointmentId: string,
  orderedStepIds: string[]
): Promise<AppointmentDetail["flow"]> =>
  request<AppointmentDetail["flow"]>(
    `/api/appointments/${appointmentId}/flow/steps/reorder`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderedStepIds }),
    }
  );

export {
  fetchAppointmentDetail,
  fetchAppointments,
  fetchDashboard,
  fetchPatients,
  fetchPhysicians,
  createAppointmentFlowStep,
  deleteAppointmentFlowStep,
  reorderAppointmentFlowStep,
  updateAppointmentFlowStep,
};
