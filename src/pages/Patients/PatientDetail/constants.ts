import { DetailBadge } from "@/components/DetailCard/type";

const PATIENT_DETAIL_TEXT = {
  detailBadge: DetailBadge.Patient,
  detailTitleFallback: "Patient",
  title: "Patient",
  subtitle: "Track appointments aligned to the patient journey.",
  notFound: "Patient not found.",
  loadingDetails: "Loading patient details...",
  errorDetails: "Unable to load patient details.",
  dobLabel: "DOB:",
  phoneLabel: "Phone:",
  emergencyContactLabel: "Emergency:",
  intakeLabel: "Intake:",
  stageLabel: "Stage:",
  assignedPhysicianFallback: "Assigned Physician",
  riskSectionTitle: "Risk of Missed Appointment",
  riskLoading: "Loading risk details...",
  riskUnavailable: "Risk details unavailable.",
  riskReasonFallback: "No risk explanation available.",
  flowTitle: "Appointment Flow",
  flowLoading: "Loading appointment flow...",
  flowUnavailable: "No appointment flow available yet.",
  appointmentsTitle: "Appointments",
  appointmentHeader: "Appointment",
  typeHeader: "Type",
  locationHeader: "Location",
  statusHeader: "Status",
} as const;

export { PATIENT_DETAIL_TEXT };
