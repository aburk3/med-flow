import { DetailBadge } from "@/components/DetailCard/type";

const PATIENT_DETAIL_TEXT = {
  detailBadge: DetailBadge.Patient,
  detailTitleFallback: "Patient",
  title: "Patient",
  subtitle: "Track appointments aligned to the patient journey.",
  notFound: "Patient not found.",
  loadingDetails: "Loading patient details...",
  errorDetails: "Unable to load patient details.",
  stageLabel: "Stage:",
  assignedPhysicianFallback: "Assigned Physician",
  riskSectionTitle: "Risk of Missed Appointment",
  riskLoading: "Loading risk details...",
  riskUnavailable: "Risk details unavailable.",
  riskReasonFallback: "No risk explanation available.",
  appointmentsTitle: "Appointments",
  appointmentHeader: "Appointment",
  typeHeader: "Type",
  locationHeader: "Location",
  statusHeader: "Status",
} as const;

export { PATIENT_DETAIL_TEXT };
