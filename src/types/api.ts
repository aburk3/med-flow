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
  dateOfBirth: string;
  phoneNumber: string;
  emergencyContact: string;
  intakeStatus: PatientIntakeStatus;
  primaryPhysicianId: string;
  risk: PatientRisk;
  riskReason: string;
}

type PatientRisk = "low" | "medium" | "high";

type PatientIntakeStatus = "sent" | "complete" | "incomplete";

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

type AppointmentFlowStepStatus =
  | "not_started"
  | "in_progress"
  | "incomplete"
  | "complete";

interface AppointmentFlowStep {
  id: string;
  title: string;
  order: number;
  status: AppointmentFlowStepStatus;
}

interface AppointmentFlow {
  id: string;
  appointmentId: string;
  steps: AppointmentFlowStep[];
}

interface AppointmentDetail {
  appointment: Appointment;
  patient: Patient;
  physician: Physician;
  flow: AppointmentFlow;
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
  PatientIntakeStatus,
  PatientFlowStage,
  PatientRisk,
};
export type {
  Appointment,
  AppointmentDetail,
  AppointmentFlow,
  AppointmentFlowStep,
  AppointmentFlowStepStatus,
  Patient,
  Physician,
};
