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
  dateOfBirth: string;
  phoneNumber: string;
  emergencyContact: string;
  intakeStatus: PatientIntakeStatus;
  primaryPhysicianId: string;
  risk: PatientRisk;
  riskReason: string;
}

export type PatientRisk = "low" | "medium" | "high";

export type PatientIntakeStatus = "sent" | "complete" | "incomplete";

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

export type AppointmentFlowStepStatus =
  | "not_started"
  | "in_progress"
  | "incomplete"
  | "complete";

export interface AppointmentFlowStep {
  id: string;
  title: string;
  order: number;
  status: AppointmentFlowStepStatus;
}

export interface AppointmentFlow {
  id: string;
  appointmentId: string;
  steps: AppointmentFlowStep[];
}

export interface AppointmentDetail {
  appointment: Appointment;
  patient: Patient;
  physician: Physician;
  flow: AppointmentFlow;
}

export interface DashboardPayload {
  physician: Physician;
  patients: Patient[];
  appointments: Appointment[];
  noShowCountsByPatient: Record<string, number>;
  appointmentsTotal: number;
}
