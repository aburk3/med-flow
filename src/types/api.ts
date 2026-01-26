type PatientFlowStage =
  | "Initial Contact"
  | "First Meeting"
  | "Scheduled Surgery"
  | "Pre-Op Clearance"
  | "Post-Op Follow Up";

interface Physician {
  id: string;
  name: string;
  specialty: string;
  location: string;
}

interface Patient {
  id: string;
  name: string;
  stage: PatientFlowStage;
  primaryPhysicianId: string;
  risk: PatientRisk;
  riskReason: string;
}

type PatientRisk = "low" | "medium" | "high";

type AppointmentStatus =
  | "completed"
  | "canceled"
  | "no-show"
  | "rescheduled"
  | "scheduled";

interface Appointment {
  id: string;
  patientId: string;
  physicianId: string;
  date: string;
  type: string;
  location: string;
  status: AppointmentStatus;
}

interface DashboardPayload {
  physician: Physician;
  patients: Patient[];
  appointments: Appointment[];
  noShowCountsByPatient: Record<string, number>;
  appointmentsTotal: number;
}

export type {
  AppointmentStatus,
  DashboardPayload,
  PatientFlowStage,
  PatientRisk,
};
export type { Appointment, Patient, Physician };
