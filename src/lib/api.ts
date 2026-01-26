import type {
  Appointment,
  DashboardPayload,
  Patient,
  Physician,
} from "@/types/api";

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const request = async <T,>(path: string): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    cache: "no-store",
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

export { fetchAppointments, fetchDashboard, fetchPatients, fetchPhysicians };
