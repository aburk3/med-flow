export type PatientFlowStage =
  | "Initial Contact"
  | "First Meeting"
  | "Scheduled Surgery"
  | "Pre-Op Clearance"
  | "Post-Op Follow Up";

export interface Physician {
  id: string;
  name: string;
  specialty: string;
  location: string;
}

export interface Patient {
  id: string;
  name: string;
  stage: PatientFlowStage;
  primaryPhysicianId: string;
  risk: PatientRisk;
  riskReason: string;
}

export type PatientRisk = "low" | "medium" | "high";

export type AppointmentStatus =
  | "completed"
  | "canceled"
  | "no-show"
  | "rescheduled"
  | "scheduled";

export interface Appointment {
  id: string;
  patientId: string;
  physicianId: string;
  date: string;
  type: string;
  location: string;
  status: AppointmentStatus;
}

export interface DashboardPayload {
  physician: Physician;
  patients: Patient[];
  appointments: Appointment[];
  noShowCountsByPatient: Record<string, number>;
  appointmentsTotal: number;
}
