import type { PatientFlowStage } from "@/types/api";
import { DetailBadge } from "@/components/DetailCard/type";

const DASHBOARD_TEXT = {
  detailBadge: DetailBadge.Physician,
  detailLoadingTitle: "Loading",
  detailLoadingLine: "Loading details...",
  title: "Patient Flow Dashboard",
  subtitle: "Track each patient through the full surgical journey.",
  liveScheduleBadge: "Live Schedule",
  patientsCardTitle: "Patients",
  patientsCardSubtitle: "Active patient flow stages today.",
  appointmentsCardTitle: "Appointments",
  appointmentsCardSubtitle: "Upcoming visits and procedures.",
  scheduleTitle: "Schedule",
  scheduleHeaders: {
    risk: "Risk",
    patient: "Patient",
    stage: "Stage",
    appointment: "Appointment",
    location: "Location",
  },
  error: "Unable to load dashboard data.",
  unknownPatient: "Unknown Patient",
  missedAppointmentsLabel: "missed appointments",
} as const;

const DEFAULT_PATIENT_STAGE: PatientFlowStage = "Initial Contact";

export { DASHBOARD_TEXT, DEFAULT_PATIENT_STAGE };
